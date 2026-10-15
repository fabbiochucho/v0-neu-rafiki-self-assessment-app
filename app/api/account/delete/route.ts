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
// links. ponytail: blocked until the owner decides an org-deletion policy.
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
  const { count: adminOf } = await service
    .from("organizations")
    .select("id", { count: "exact", head: true })
    .eq("admin_user_id", uid)
  if (adminOf) {
    return NextResponse.json(
      {
        error:
          "You're the admin of an organisation, so your account can't be deleted here. Email dpo@becomechange.institute and we'll help transfer or close it. Nothing was deleted.",
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
