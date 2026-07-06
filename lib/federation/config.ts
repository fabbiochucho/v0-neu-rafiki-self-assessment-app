// Cross-app federation configuration.
//
// Federation lets a user optionally link their Neu Rafiki account to a
// sibling "Alliance" app account so completed assessment results can be
// exported (pulled by Alliance, with per-profile consent). Everything here
// is opt-in: if NEXT_PUBLIC_ALLIANCE_APP_URL is unset, federation is fully
// disabled and the app behaves exactly as it does without this feature.

export function isFederationEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_ALLIANCE_APP_URL)
}

export function getSiblingAppUrl(): string | null {
  return process.env.NEXT_PUBLIC_ALLIANCE_APP_URL || null
}

export const THIS_APP_ID = "neurafiki" as const
export const SIBLING_APP_ID = "alliance" as const
