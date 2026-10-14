// Cross-app federation configuration.
//
// Federation lets a user optionally link their Neu Rafiki account to the
// sibling ANDA app (called "Alliance" in older code and in the federation
// JWT issuer/remote_app values, which stay "alliance" for compatibility).
// Everything here is opt-in: if neither NEXT_PUBLIC_ANDA_APP_URL nor the
// older NEXT_PUBLIC_ALLIANCE_APP_URL is set, federation is fully disabled.

/** ANDA's base URL (no trailing slash), or null when federation is off. */
export function getSiblingAppUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_ANDA_APP_URL || process.env.NEXT_PUBLIC_ALLIANCE_APP_URL
  return url ? url.replace(/\/+$/, "") : null
}

export function isFederationEnabled(): boolean {
  return Boolean(getSiblingAppUrl())
}

export const THIS_APP_ID = "neurafiki" as const
export const SIBLING_APP_ID = "alliance" as const
