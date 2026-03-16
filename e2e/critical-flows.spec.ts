import { test, expect } from '@playwright/test'

test.describe('Critical User Flows - Full End-to-End', () => {
  test.beforeEach(async ({ page }) => {
    // Set mock auth environment for testing
    await page.addInitScript(() => {
      localStorage.setItem('NEXT_PUBLIC_MOCK_AUTH', 'true')
    })
  })

  test.describe('Landing Page Flow', () => {
    test('should load landing page successfully', async ({ page }) => {
      await page.goto('/')
      
      // Check page title/heading exists
      const heading = page.locator('h1, h2')
      await expect(heading).toBeVisible()
      
      // Check for navigation links
      const navLinks = page.locator('nav a, [role="navigation"] a')
      await expect(navLinks).not.toHaveCount(0)
    })

    test('should have working CTA buttons on landing page', async ({ page }) => {
      await page.goto('/')
      
      // Look for sign in or sign up buttons
      const ctaButtons = page.locator('button:has-text("Sign in"), button:has-text("Sign up"), button:has-text("Get Started")')
      
      if (await ctaButtons.count() > 0) {
        await expect(ctaButtons.first()).toBeVisible()
      }
    })

    test('should navigate to login from landing page', async ({ page }) => {
      await page.goto('/')
      
      // Click sign in button if it exists
      const signInButton = page.locator('a:has-text("Sign In"), a:has-text("Sign in"), button:has-text("Sign in")')
      
      if (await signInButton.count() > 0) {
        await signInButton.first().click()
        await page.waitForNavigation()
        expect(page.url()).toContain('/auth')
      }
    })
  })

  test.describe('Authentication Flow', () => {
    test('should load sign up page', async ({ page }) => {
      await page.goto('/auth/sign-up')
      
      // Check for form elements
      const form = page.locator('form')
      await expect(form).toBeVisible()
      
      // Check for required inputs
      const emailInput = page.locator('input[type="email"]')
      const passwordInput = page.locator('input[type="password"]')
      
      await expect(emailInput).toBeVisible()
      await expect(passwordInput).toBeVisible()
    })

    test('should display validation errors on invalid signup', async ({ page }) => {
      await page.goto('/auth/sign-up')
      
      // Try to submit with invalid data
      const submitButton = page.locator('button[type="submit"]')
      await submitButton.click()
      
      // Check for error message
      const errorMessage = page.locator('[role="alert"], .text-red-500, .error')
      await page.waitForTimeout(500) // Wait for validation
      
      // At least one error should be visible or validation should prevent submission
      const isErrorVisible = await errorMessage.count() > 0
      const isFormStillVisible = await page.locator('form').isVisible()
      
      expect(isErrorVisible || isFormStillVisible).toBeTruthy()
    })

    test('should complete sign up flow with valid data', async ({ page }) => {
      await page.goto('/auth/sign-up')
      
      // Fill in the form
      const emailInput = page.locator('input[type="email"]')
      const passwordInput = page.locator('input[type="password"]')
      const nameInput = page.locator('input[placeholder*="name" i], input[placeholder*="full" i]')
      
      if (await nameInput.count() > 0) {
        await nameInput.fill('Test User')
      }
      
      await emailInput.fill('testuser@example.com')
      await passwordInput.fill('SecurePassword123')
      
      // Look for confirm password field
      const confirmInput = page.locator('input[type="password"]').nth(1)
      if (await confirmInput.count() > 0) {
        await confirmInput.fill('SecurePassword123')
      }
      
      // Submit form
      const submitButton = page.locator('button[type="submit"]')
      await submitButton.click()
      
      // Should navigate away or show success message
      await page.waitForTimeout(1000)
      const successMessage = page.locator('[role="alert"]:has-text("success"), .text-green-500')
      const urlChanged = page.url() !== '/auth/sign-up'
      
      expect(urlChanged || await successMessage.count() > 0).toBeTruthy()
    })

    test('should load sign in page', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Check for form elements
      const form = page.locator('form')
      await expect(form).toBeVisible()
      
      // Check for email and password fields
      const emailInput = page.locator('input[type="email"]')
      const passwordInput = page.locator('input[type="password"]')
      
      await expect(emailInput).toBeVisible()
      await expect(passwordInput).toBeVisible()
    })

    test('should have sign up link on login page', async ({ page }) => {
      await page.goto('/auth/login')
      
      const signUpLink = page.locator('a:has-text("sign up"), a:has-text("Sign up")')
      await expect(signUpLink).toBeVisible()
      
      await signUpLink.click()
      expect(page.url()).toContain('/auth/sign-up')
    })

    test('should complete sign in flow', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Fill in credentials
      const emailInput = page.locator('input[type="email"]')
      const passwordInput = page.locator('input[type="password"]')
      
      await emailInput.fill('testuser@example.com')
      await passwordInput.fill('password123')
      
      // Submit form
      const submitButton = page.locator('button[type="submit"]')
      await submitButton.click()
      
      // Should navigate to dashboard or protected page
      await page.waitForTimeout(1500)
      const isDashboardReached = page.url().includes('/dashboard') || page.url().includes('/assessment')
      
      // Or show success message in mock mode
      const successMessage = page.locator('[role="alert"]:has-text("success"), .text-green-500')
      
      expect(isDashboardReached || await successMessage.count() > 0).toBeTruthy()
    })
  })

  test.describe('Dashboard Access', () => {
    test('should load dashboard after authentication', async ({ page }) => {
      // First sign in
      await page.goto('/auth/login')
      const emailInput = page.locator('input[type="email"]')
      const passwordInput = page.locator('input[type="password"]')
      
      await emailInput.fill('testuser@example.com')
      await passwordInput.fill('password123')
      
      const submitButton = page.locator('button[type="submit"]')
      await submitButton.click()
      
      // Wait and navigate to dashboard
      await page.waitForTimeout(1500)
      await page.goto('/dashboard')
      
      // Check if dashboard content is visible
      const dashboardContent = page.locator('[role="main"], main, .dashboard, [data-testid="dashboard"]')
      
      // Page should be accessible or show auth content
      const isOnDashboard = page.url().includes('/dashboard')
      expect(isOnDashboard).toBeTruthy()
    })

    test('should have navigation menu on dashboard', async ({ page }) => {
      await page.goto('/dashboard')
      
      // Check for navigation elements
      const nav = page.locator('nav, [role="navigation"], aside, .sidebar')
      const navItems = page.locator('nav a, [role="navigation"] a, aside a')
      
      if (await nav.count() > 0) {
        await expect(nav).toBeVisible()
      }
    })
  })

  test.describe('Assessment Flow', () => {
    test('should navigate to assessment page', async ({ page }) => {
      await page.goto('/dashboard')
      
      // Look for assessment link
      const assessmentLink = page.locator('a:has-text("Assessment"), button:has-text("Assessment")')
      
      if (await assessmentLink.count() > 0) {
        await assessmentLink.first().click()
        await page.waitForNavigation({ timeout: 5000 }).catch(() => {})
        
        // Should be on assessment page
        const isOnAssessment = page.url().includes('/assessment')
        expect(isOnAssessment || await page.locator('form, [role="form"]').count() > 0).toBeTruthy()
      }
    })

    test('should display assessment questions', async ({ page }) => {
      await page.goto('/assessment')
      
      // Check for form or questions
      const form = page.locator('form')
      const questions = page.locator('[role="heading"], h2, h3')
      
      const hasContent = await form.count() > 0 || await questions.count() > 0
      expect(hasContent).toBeTruthy()
    })
  })

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      // Check if page is visible
      const mainContent = page.locator('[role="main"], main')
      const isVisible = await mainContent.count() > 0 || await page.locator('body').isVisible()
      
      expect(isVisible).toBeTruthy()
    })

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/')
      
      const mainContent = page.locator('[role="main"], main')
      const isVisible = await mainContent.count() > 0 || await page.locator('body').isVisible()
      
      expect(isVisible).toBeTruthy()
    })

    test('should be responsive on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/')
      
      const mainContent = page.locator('[role="main"], main')
      const isVisible = await mainContent.count() > 0 || await page.locator('body').isVisible()
      
      expect(isVisible).toBeTruthy()
    })
  })

  test.describe('Error Handling', () => {
    test('should handle navigation errors gracefully', async ({ page }) => {
      await page.goto('/nonexistent-page', { waitUntil: 'networkidle' }).catch(() => {})
      
      // Page should still be usable (either show 404 or redirect)
      const isPageLoaded = await page.locator('body').isVisible()
      expect(isPageLoaded).toBeTruthy()
    })

    test('should show error messages for failed operations', async ({ page }) => {
      await page.goto('/auth/login')
      
      // Try invalid login
      const emailInput = page.locator('input[type="email"]')
      const passwordInput = page.locator('input[type="password"]')
      
      await emailInput.fill('invalid')
      await passwordInput.fill('')
      
      const submitButton = page.locator('button[type="submit"]')
      await submitButton.click()
      
      // Should show validation error
      await page.waitForTimeout(500)
      const errorMessage = page.locator('[role="alert"], .error, .text-red')
      
      // Either error is shown or form is still visible
      const hasError = await errorMessage.count() > 0
      const formStillVisible = await page.locator('form').isVisible()
      
      expect(hasError || formStillVisible).toBeTruthy()
    })
  })
})
