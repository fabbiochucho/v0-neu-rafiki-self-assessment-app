import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { ADMIN_PANEL_ROLES, type UserRole } from "@/lib/auth/roles"

interface RouteParams {
  params: Promise<{ id: string }>
}

interface EnrollRow {
  email?: string
  name?: string
  role?: string
}

const VALID_ROLES: readonly UserRole[] = ["admin", "teacher", "hr_staff", "member"]

/**
 * Creates organization_members rows for a CSV of {email, name, role}.
 * organization_members.user_id is a hard FK to auth.users, so this can't be
 * done with a plain client-side insert (the app/admin/enrollment page used
 * to try exactly that, against columns -- email/name/status -- that don't
 * even exist on organization_members, so it silently failed on every row).
 *
 * For a row whose email has no existing account, this invites a real user
 * via the Auth Admin API (service-role only) -- Supabase sends the invite
 * email and the person sets their own password, which is the standard,
 * secure way to onboard someone who doesn't yet have credentials. An
 * existing account is just added as a member, no invite needed.
 *
 * Also writes the bulk_enrollments audit row (create here, update with
 * final counts below) through the service-role client rather than letting
 * the browser do it directly: bulk_enrollments' RLS checks
 * organizations.admin_user_id (the single-owner field from 004), but actual
 * admin access to this panel is multi-admin via organization_members.role
 * (see app/admin/layout.tsx). A caller who's an admin via organization_members
 * but isn't the literal admin_user_id would pass this route's auth check yet
 * get rejected by that RLS policy on a direct client insert -- routing
 * through here, authorized the same way the panel itself authorizes,
 * sidesteps that mismatch entirely.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: organizationId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Caller must be an admin of THIS organization specifically, not just any
  // organization (mirrors the check in app/admin/layout.tsx, scoped down).
  const { data: membership } = await supabase
    .from("organization_members")
    .select("id")
    .eq("user_id", user.id)
    .eq("organization_id", organizationId)
    .in("role", ADMIN_PANEL_ROLES)
    .maybeSingle()

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const rows: EnrollRow[] = Array.isArray(body?.rows) ? body.rows : []
  const fileName: string = typeof body?.fileName === "string" ? body.fileName : "pasted-data.csv"

  if (rows.length === 0) {
    return NextResponse.json({ error: "No rows to enroll" }, { status: 400 })
  }

  const service = createServiceRoleClient()

  const { data: enrollment, error: createError } = await service
    .from("bulk_enrollments")
    .insert([
      {
        organization_id: organizationId,
        uploaded_by: user.id,
        file_name: fileName,
        total_records: rows.length,
        status: "processing",
      },
    ])
    .select()
    .single()

  if (createError) {
    console.error("[bulk-enroll] failed to create audit row:", createError)
    return NextResponse.json({ error: "Failed to start bulk enrollment" }, { status: 500 })
  }

  const results: { email: string; success: boolean; error?: string }[] = []

  for (const row of rows) {
    const email = row.email?.trim().toLowerCase()
    const name = row.name?.trim()
    const requestedRole = row.role?.trim().toLowerCase()
    const role: UserRole = (VALID_ROLES as string[]).includes(requestedRole || "")
      ? (requestedRole as UserRole)
      : "member"

    if (!email || !name) {
      results.push({ email: email || "(missing)", success: false, error: "Missing required fields: email, name" })
      continue
    }

    try {
      // profiles.id mirrors auth.users.id 1:1 via the handle_new_user
      // trigger, so a profiles lookup by email tells us whether this person
      // already has an account without needing the admin-only
      // auth.admin.listUsers API.
      const { data: existingProfile } = await service.from("profiles").select("id").eq("email", email).maybeSingle()

      let userId = existingProfile?.id as string | undefined

      if (!userId) {
        const { data: invited, error: inviteError } = await service.auth.admin.inviteUserByEmail(email, {
          data: { full_name: name },
        })
        if (inviteError) throw inviteError
        userId = invited.user.id
      }

      const { error: memberError } = await service
        .from("organization_members")
        .upsert({ organization_id: organizationId, user_id: userId, role }, { onConflict: "organization_id,user_id" })

      if (memberError) throw memberError

      results.push({ email, success: true })
    } catch (err) {
      results.push({ email, success: false, error: err instanceof Error ? err.message : "Unknown error" })
    }
  }

  const successful = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length
  const errors = results.filter((r) => !r.success).map((r) => `${r.email}: ${r.error}`)

  await service
    .from("bulk_enrollments")
    .update({
      processed_records: successful,
      failed_records: failed,
      status: failed === rows.length ? "failed" : "completed",
      error_log: errors,
    })
    .eq("id", enrollment.id)

  return NextResponse.json({ enrollmentId: enrollment.id, successful, failed, errors })
}
