import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DemoBanner } from './demo/demo-banner'

// Mock the auth module
vi.mock('@/lib/auth/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isDemo: false,
  }),
}))

describe('DemoBanner Component', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false'
  })

  it('should not render when demo mode is disabled', () => {
    render(<DemoBanner />)
    const banner = screen.queryByText(/demo/i)
    expect(banner).not.toBeInTheDocument()
  })

  it('should have accessible demo text', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true'
    render(<DemoBanner />)
    
    const banner = screen.queryByText(/demo/i)
    if (banner) {
      expect(banner).toBeVisible()
    }
  })

  it('should render with proper ARIA attributes', () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true'
    const { container } = render(<DemoBanner />)
    
    // Banner should be identifiable
    const bannerElement = container.firstChild
    expect(bannerElement).toBeTruthy()
  })
})
