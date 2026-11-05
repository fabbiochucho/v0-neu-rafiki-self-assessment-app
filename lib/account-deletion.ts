// Permanently deletes one account. Used by self-service deletion (app/api/account/delete)
// and by the 30-day purge of accounts staff soft-deleted. Callers check organisation
// hand-over first: the primary admin of an organisation can't be deleted.
import type { createServiceRoleClient } from "@/lib/supabase/service"

type Service = ReturnType<typeof createServiceRoleClient>

export async function isOrganisationAdmin(service: Service, uid: string): Promise<boolean> {
  const { data } = await service.from("organizations").select("id").eq("admin_user_id", uid).limit(1)
  return !!data?.length
}

export async function deleteAccountData(service: Service, uid: string): Promise<void> {
  // Other people's records can point at this user without cascading.
  const { error: unassignError } = await service.from("profiles").update({ assigned_to: null }).eq("assigned_to", uid)
  if (unassignError) throw unassignError

  const { error: authError } = await service.auth.admin.deleteUser(uid)
  if (authError) throw authError
}
