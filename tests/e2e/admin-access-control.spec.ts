import { test, expect } from "@playwright/test"
import { signUp, logIn, uniqueEmail } from "./helpers"

// Negative test: a freshly-signed-up, authenticated user who is not an
// 'admin' in any organization_members row must be blocked from /admin.
// Before this pass, app/admin/layout.tsx had no auth/role check at all.
test("an authenticated non-admin user is redirected away from /admin", async ({ page }) => {
  const email = uniqueEmail("e2e-nonadmin")

  await signUp(page, email)
  await logIn(page, email)
  await expect(page).toHaveURL(/dashboard/)

  await page.goto("/admin")

  // app/admin/layout.tsx redirects unauthorized users to "/". Assert we do
  // NOT end up staying on an /admin route.
  await expect(page).not.toHaveURL(/\/admin(\/|$)/)
  await expect(page).toHaveURL("/")
})
