// Page URLs can carry a person's record id or query values. Analytics only
// needs the page, so send neither.
export function scrubUrl(url: string): string {
  const u = new URL(url)
  return u.origin + u.pathname.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "[id]")
}
