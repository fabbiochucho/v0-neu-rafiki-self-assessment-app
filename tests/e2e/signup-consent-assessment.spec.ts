import { test, expect } from "@playwright/test"
import { signUp, logIn, uniqueEmail } from "./helpers"

// Full happy-path flow: sign up (with the required account-terms consent),
// create a profile, start an assessment (with the required per-profile
// assessment_data consent), answer every question, and land on the results
// page. This requires a live Supabase project with the question bank seeded
// (scripts/005-007) and email confirmation disabled -- see
// playwright.config.ts for the full list of prerequisites.
test("sign up with consent, complete an assessment, and see results", async ({ page }) => {
  const email = uniqueEmail("e2e-signup")

  await signUp(page, email)
  await expect(page).toHaveURL(/sign-up-success/)

  await logIn(page, email)
  await expect(page).toHaveURL(/dashboard/)

  // Create a profile to assess (self, adult, so no child-consent branch).
  await page.goto("/dashboard/profiles/new")
  await page.getByLabel("Full Name *").fill("Self Profile")
  await page.getByLabel("Age").fill("30")
  await page.getByRole("button", { name: /Create Profile/ }).click()
  await expect(page).toHaveURL(/dashboard\/profiles$/)

  await page.goto("/assessment/start")
  await page.getByLabel(/Who are you assessing/).click()
  await page.getByRole("option", { name: /Self Profile/ }).click()

  await page.getByLabel(/Who is completing this assessment/).click()
  await page.getByRole("option", { name: "Self-report" }).click()

  // Select at least one domain.
  const firstDomainCheckbox = page.locator('button[role="checkbox"]').first()
  await firstDomainCheckbox.check()

  // Consent step defaults to "Myself" for an adult profile -- no child
  // checkbox should be required, so the Start button should already be
  // enabled once the fields above are filled in.
  await page.getByRole("button", { name: /Start Assessment/ }).click()
  await expect(page).toHaveURL(/\/assessment\/.+\/questions/)

  // Answer every question by always picking the first available option,
  // until we land on the results page.
  while (true) {
    const onResults = await page
      .waitForURL(/\/assessment\/.+\/results/, { timeout: 1_000 })
      .then(() => true)
      .catch(() => false)
    if (onResults) break

    const firstOption = page.locator('button[role="radio"]').first()
    await firstOption.click()

    const completeButton = page.getByRole("button", { name: /Complete Assessment/ })
    if (await completeButton.isVisible().catch(() => false)) {
      await completeButton.click()
    } else {
      await page.getByRole("button", { name: "Next" }).click()
    }
  }

  await expect(page.getByText("Assessment Results")).toBeVisible()
  await expect(page.getByText("Domain Results")).toBeVisible()
})
