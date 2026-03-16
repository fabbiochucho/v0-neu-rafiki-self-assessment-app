import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockSignIn, mockSignUp, getMockUser, clearMockUser, isMockMode } from './auth-mock'

describe('Mock Auth Functions', () => {
  beforeEach(() => {
    clearMockUser()
    vi.clearAllMocks()
  })

  describe('mockSignIn', () => {
    it('should successfully sign in with any email/password combination', async () => {
      const result = await mockSignIn('test@example.com', 'password123')
      expect(result.user).toEqual({ email: 'test@example.com' })
      expect(result.session).toEqual({ access_token: 'mock_token' })
    })

    it('should throw error for invalid email format', async () => {
      await expect(mockSignIn('invalid-email', 'password123')).rejects.toThrow('Invalid email format')
    })

    it('should store user in localStorage', async () => {
      await mockSignIn('test@example.com', 'password123')
      const stored = localStorage.getItem('mock_auth_user')
      expect(stored).toBeDefined()
      const parsed = JSON.parse(stored!)
      expect(parsed.email).toBe('test@example.com')
    })

    it('should simulate network delay', async () => {
      const start = performance.now()
      await mockSignIn('test@example.com', 'password123')
      const end = performance.now()
      expect(end - start).toBeGreaterThanOrEqual(500)
    })
  })

  describe('mockSignUp', () => {
    it('should successfully sign up with valid credentials', async () => {
      const result = await mockSignUp('newuser@example.com', 'password123')
      expect(result.user).toEqual({ email: 'newuser@example.com' })
      expect(result.session).toBeNull()
    })

    it('should throw error for invalid email format', async () => {
      await expect(mockSignUp('invalid-email', 'password123')).rejects.toThrow('Invalid email format')
    })

    it('should throw error for password too short', async () => {
      await expect(mockSignUp('test@example.com', 'pass')).rejects.toThrow('Password must be at least 6 characters')
    })

    it('should store user in localStorage', async () => {
      await mockSignUp('test@example.com', 'password123')
      const stored = localStorage.getItem('mock_auth_user')
      expect(stored).toBeDefined()
      const parsed = JSON.parse(stored!)
      expect(parsed.email).toBe('test@example.com')
    })
  })

  describe('getMockUser', () => {
    it('should return null when no user is logged in', () => {
      const user = getMockUser()
      expect(user).toBeNull()
    })

    it('should return user after sign in', async () => {
      await mockSignIn('test@example.com', 'password123')
      const user = getMockUser()
      expect(user).toBeDefined()
      expect(user?.email).toBe('test@example.com')
    })

    it('should return user with valid id and createdAt', async () => {
      await mockSignIn('test@example.com', 'password123')
      const user = getMockUser()
      expect(user?.id).toBeDefined()
      expect(user?.createdAt).toBeDefined()
      expect(typeof user?.id).toBe('string')
      expect(typeof user?.createdAt).toBe('string')
    })
  })

  describe('clearMockUser', () => {
    it('should clear user from localStorage', async () => {
      await mockSignIn('test@example.com', 'password123')
      expect(getMockUser()).toBeDefined()
      clearMockUser()
      expect(getMockUser()).toBeNull()
    })

    it('should be idempotent', () => {
      clearMockUser()
      clearMockUser()
      expect(getMockUser()).toBeNull()
    })
  })

  describe('isMockMode', () => {
    it('should return true when NEXT_PUBLIC_MOCK_AUTH is true', () => {
      process.env.NEXT_PUBLIC_MOCK_AUTH = 'true'
      expect(isMockMode()).toBe(true)
    })

    it('should return false when NEXT_PUBLIC_MOCK_AUTH is false', () => {
      process.env.NEXT_PUBLIC_MOCK_AUTH = 'false'
      expect(isMockMode()).toBe(false)
    })

    it('should return true on vusercontent.net domain (v0 preview)', () => {
      process.env.NEXT_PUBLIC_MOCK_AUTH = 'false'
      // Mock window.location.href to simulate v0 preview environment
      const originalLocation = window.location
      delete (window as any).location
      ;(window as any).location = new URL('https://test-vusercontent.net/')
      
      expect(isMockMode()).toBe(true)
      
      window.location = originalLocation
    })
  })
})
