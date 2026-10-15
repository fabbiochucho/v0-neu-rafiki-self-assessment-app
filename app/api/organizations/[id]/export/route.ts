import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { getAdministeredOrg, otherMembers } from "@/lib/organizations"

// GET /api/organizations/:id/export -- the organisation's own data as JSON:
// the organisation, its members, bulk enrolments and the list of
// assessments linked to it. Screening answers and results aren't included;
// they belong to each member's personal account.
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })

  const service = createServiceRoleClient()
  const org = await getAdministeredOrg(service, params.id, user.id)
  if (!org) return NextResponse.json({ error: "Only the organisation's primary admin can do this." }, { status: 403 })

  const [members, { data: enrollments }, { data: assessments }] = await Promise.all([
    otherMembers(service, org.id, user.id),
    service.from("bulk_enrollments").select("*").eq("organization_id", org.id),
    service.from("assessments").select("id, profile_id, status, created_at").eq("organization_id", org.id),
  ])

  const stamp = new Date().toISOString().slice(0, 10)
  return new NextResponse(
    JSON.stringify({ exported_at: new Date().toISOString(), organization: org, members, bulk_enrollments: enrollments ?? [], assessments: assessments ?? [] }, null, 2),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="neurafiki-organisation-${stamp}.json"`,
      },
    },
  )
}
