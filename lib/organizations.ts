import type { SupabaseClient } from "@supabase/supabase-js"

// Owner decision (Oct 2026): an organisation's primary admin must hand over
// to another member before leaving. If they're the only member, they can
// close it: it's deleted after a 30-day grace period, with an export option.
// Members' personal accounts always stay theirs.
export const CLOSURE_GRACE_DAYS = 30

export function closingDate(from = new Date()): string {
  return new Date(from.getTime() + CLOSURE_GRACE_DAYS * 24 * 60 * 60 * 1000).toISOString()
}

/** Loads an organisation only if `userId` is its primary admin. */
export async function getAdministeredOrg(service: SupabaseClient, orgId: string, userId: string) {
  const { data } = await service
    .from("organizations")
    .select("id, name, admin_user_id, closing_at, created_at")
    .eq("id", orgId)
    .eq("admin_user_id", userId)
    .maybeSingle()
  return data
}

/** Members other than the primary admin, with their emails. */
export async function otherMembers(service: SupabaseClient, orgId: string, adminId: string) {
  const { data } = await service
    .from("organization_members")
    .select("user_id, role")
    .eq("organization_id", orgId)
    .neq("user_id", adminId)
  const ids = (data ?? []).map((m) => m.user_id as string)
  const { data: profiles } = ids.length ? await service.from("profiles").select("id, email").in("id", ids) : { data: [] }
  const email = new Map((profiles ?? []).map((p) => [p.id as string, (p.email as string | null) ?? null]))
  return (data ?? []).map((m) => ({ user_id: m.user_id as string, role: m.role as string, email: email.get(m.user_id as string) ?? null }))
}

/**
 * Deletes organisations whose grace period has ended. Members' assessments
 * and profiles are detached first (organization_id -> null) so personal
 * records are kept; memberships and bulk enrolments cascade with the org.
 */
export async function closeDueOrganizations(service: SupabaseClient, now = new Date()) {
  const { data: due, error } = await service.from("organizations").select("id").lte("closing_at", now.toISOString())
  if (error) throw error
  const closed: string[] = []
  for (const { id } of due ?? []) {
    const detach1 = await service.from("assessments").update({ organization_id: null }).eq("organization_id", id)
    const detach2 = await service.from("profiles").update({ organization_id: null }).eq("organization_id", id)
    if (detach1.error || detach2.error) continue
    const { error: delError } = await service.from("organizations").delete().eq("id", id)
    if (!delError) closed.push(id)
  }
  return closed
}
