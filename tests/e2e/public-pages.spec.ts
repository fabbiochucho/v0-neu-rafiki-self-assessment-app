import { test, expect } from "@playwright/test"

// The marketing/narrative pages added alongside this test (about, faq,
// contact, blog) must be reachable without authentication -- unlike
// /dashboard, /admin, /assessment/*, they don't create a Supabase client or
// check a session, so there's nothing to redirect on.
for (const path of ["/about", "/faq", "/contact", "/blog", "/support/resources"]) {
  test(`${path} is publicly reachable without authentication`, async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.ok()).toBe(true)
    await expect(page).toHaveURL(new RegExp(`${path.replace(/\//g, "\\/")}$`))
  })
}

test("contact form rejects an empty submission client-side", async ({ page }) => {
  await page.goto("/contact")
  await page.getByRole("button", { name: "Send Message" }).click()
  // Validation errors render inline rather than submitting -- the page
  // should not navigate away or show the "Message sent" success state.
  await expect(page.getByText("Message sent")).toHaveCount(0)
})
