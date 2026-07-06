import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"

/**
 * Replaces the old lib/api/organizations.ts, which instantiated a service-role
 * Supabase client (bypassing RLS entirely) with zero caller-side
 * authorization -- any code path that imported it could list every
 * organization on the platform. This route checks the caller's role first
 * and only ever returns organizations they actually administer.
 *
 * GET /api/admin/organizations
 */
export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Ground truth for roles is organization_members.role, defined in
  // scripts/004_expand_institutional_schema.sql as
  // ('admin', 'teacher', 'hr_staff', 'member').
  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .eq("role", "admin")

  if (membershipError) {
    return NextResponse.json({ error: "Failed to verify permissions" }, { status: 500 })
  }

  const orgIds = (memberships || []).map((m) => m.organization_id)

  if (orgIds.length === 0) {
    return NextResponse.json({ organizations: [] })
  }

  // Once authorized, use the service-role client so results aren't further
  // filtered by (and don't depend on the exact shape of) organizations' own
  // RLS policies -- authorization already happened above.
  const serviceClient = createServiceRoleClient()
  const { data: organizations, error } = await serviceClient
    .from("organizations")
    .select("*")
    .in("id", orgIds)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "Failed to load organizations" }, { status: 500 })
  }

  return NextResponse.json({ organizations })
}
