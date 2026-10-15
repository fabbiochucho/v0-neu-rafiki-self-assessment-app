import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"

// POST /api/account/delete { email } -- permanently deletes the caller's
// account. The typed email must match. Deleting the auth user cascades
// through profiles -> user_profiles -> assessments, responses, results,
// follow-ups, appointments and consents, plus check-ins, notifications,
// AI usage, organisation memberships and linked ANDA accounts.
//
// Organisation admins are refused: organizations.admin_user_id cascades,
// so deleting them would delete the whole organisation and its members'
// links. Owner decision (Oct 2026): hand over or close it first (lib/organizations.ts).
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  if (typeof body.email !== "string" || body.email.trim().toLowerCase() !== user.email.toLowerCase()) {
    return NextResponse.json({ error: "The email you typed doesn't match your account." }, { status: 400 })
  }

  let service: ReturnType<typeof createServiceRoleClient>
  try {
    service = createServiceRoleClient()
  } catch {
    return NextResponse.json({ error: "Account deletion isn't available right now. Nothing was deleted." }, { status: 503 })
  }

  const uid = user.id
  const { data: adminOf } = await service.from("organizations").select("closing_at").eq("admin_user_id", uid)
  if (adminOf?.length && adminOf.every((o) => o.closing_at)) {
    const last = adminOf.map((o) => o.closing_at as string).sort().at(-1)!
    return NextResponse.json(
      {
        error: `Your organisation closes on ${new Date(last).toLocaleDateString("en-GB")}. You can delete your account after that. Nothing was deleted.`,
      },
      { status: 409 },
    )
  }
  if (adminOf?.length) {
    return NextResponse.json(
      {
        error:
          "You're the primary admin of an organisation. Hand it over to another member, or close it, in the Organisations section of this page first. Nothing was deleted.",
      },
      { status: 409 },
    )
  }

  try {
    // Other people's records can point at this user without cascading.
    const { error: unassignError } = await service.from("profiles").update({ assigned_to: null }).eq("assigned_to", uid)
    if (unassignError) throw unassignError

    const { error: authError } = await service.auth.admin.deleteUser(uid)
    if (authError) throw authError
  } catch {
    console.error("account deletion failed")
    return NextResponse.json(
      { error: "Something went wrong while deleting. Your account is still here; please try again or contact us." },
      { status: 500 },
    )
  }

  await supabase.auth.signOut().catch(() => {})
  return NextResponse.json({ ok: true })
}
