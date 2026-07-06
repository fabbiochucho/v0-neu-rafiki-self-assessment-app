import type { Page } from "@playwright/test"

/** Generates a unique, throwaway email for each test run. */
export function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`
}

export const TEST_PASSWORD = "Test-Password-123!"

/**
 * Signs up a brand-new account through the real UI, including checking the
 * required consent checkbox added in this pass -- signup should fail (button
 * stays disabled) if that checkbox isn't checked first.
 */
export async function signUp(page: Page, email: string, password = TEST_PASSWORD) {
  await page.goto("/auth/sign-up")
  await page.getByLabel("Full Name").fill("Test User")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password", { exact: true }).fill(password)
  await page.getByLabel("Confirm Password").fill(password)
  await page.getByLabel(/I agree to the/).check()
  await page.getByRole("button", { name: /Sign Up/ }).click()
}

export async function logIn(page: Page, email: string, password = TEST_PASSWORD) {
  await page.goto("/auth/login")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill(password)
  await page.getByRole("button", { name: /Sign In/ }).click()
}
