import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set mock auth for testing
    await page.context().addInitScript(() => {
      localStorage.setItem('NEXT_PUBLIC_MOCK_AUTH', 'true')
    })
  })

  test('should navigate to login page from landing page', async ({ page }) => {
    await page.goto('/')
    
    // Find and click sign in button
    const signInButton = page.getByRole('link', { name: /sign in/i })
    await expect(signInButton).toBeVisible()
    await signInButton.click()
    
    // Should be on login page
    await expect(page).toHaveURL('/auth/login')
  })

  test('should navigate to sign up page from landing page', async ({ page }) => {
    await page.goto('/')
    
    // Find and click sign up button
    const signUpButton = page.getByRole('link', { name: /sign up|get started/i })
    await expect(signUpButton).toBeVisible()
    await signUpButton.click()
    
    // Should be on sign up page
    await expect(page).toHaveURL('/auth/sign-up')
  })

  test('should complete sign up flow with mock auth', async ({ page }) => {
    await page.goto('/auth/sign-up')
    
    // Fill in sign up form
    await page.fill('input[placeholder*="full name" i]', 'Test User')
    await page.fill('input[type="email"]', 'testuser@example.com')
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Individual' }).click()
    await page.fill('input[type="password"][placeholder*="at least" i]', 'password123')
    await page.fill('input[id="repeat-password"]', 'password123')
    
    // Submit form
    await page.getByRole('button', { name: /sign up/i }).click()
    
    // Should be redirected to sign-up-success page
    await expect(page).toHaveURL('/auth/sign-up-success', { timeout: 5000 })
  })

  test('should complete login flow with mock auth', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Fill in login form
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })
  })

  test('should show error on empty form submission', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should show validation error
    const errorMessage = page.locator('text=/please enter/i')
    await expect(errorMessage).toBeVisible({ timeout: 2000 })
  })

  test('should show error on password mismatch in sign up', async ({ page }) => {
    await page.goto('/auth/sign-up')
    
    // Fill in mismatched passwords
    await page.fill('input[placeholder*="full name" i]', 'Test User')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Individual' }).click()
    await page.fill('input[type="password"][placeholder*="at least" i]', 'password123')
    await page.fill('input[id="repeat-password"]', 'differentpassword')
    
    // Submit form
    await page.getByRole('button', { name: /sign up/i }).click()
    
    // Should show password mismatch error
    const errorMessage = page.locator('text=/passwords do not match/i')
    await expect(errorMessage).toBeVisible({ timeout: 2000 })
  })

  test('should navigate from login to sign up', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Click "Sign up" link
    const signUpLink = page.getByRole('link', { name: /sign up/i })
    await expect(signUpLink).toBeVisible()
    await signUpLink.click()
    
    // Should be on sign up page
    await expect(page).toHaveURL('/auth/sign-up')
  })

  test('should navigate from sign up to login', async ({ page }) => {
    await page.goto('/auth/sign-up')
    
    // Click "Sign in" link
    const signInLink = page.getByRole('link', { name: /sign in/i })
    await expect(signInLink).toBeVisible()
    await signInLink.click()
    
    // Should be on login page
    await expect(page).toHaveURL('/auth/login')
  })
})

test.describe('Protected Routes', () => {
  test('should redirect unauthenticated user to login', async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto('/dashboard')
    
    // Should be redirected to login
    await expect(page).toHaveURL('/auth/login')
  })

  test('should allow authenticated user to access dashboard', async ({ page }) => {
    // Set mock auth
    await page.context().addInitScript(() => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('mock_auth_user', JSON.stringify(mockUser))
      document.cookie = `mock_user_session=${JSON.stringify(mockUser)}; path=/`
    })
    
    // Navigate to dashboard
    await page.goto('/dashboard')
    
    // Should be on dashboard
    await expect(page).toHaveURL('/dashboard')
  })
})
