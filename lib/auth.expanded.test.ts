import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mockSignUp, mockSignIn, getMockUser, clearMockUser, isMockMode } from './auth-mock'

describe('Auth Module - Mock Authentication', () => {
  beforeEach(() => {
    clearMockUser()
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clearMockUser()
    localStorage.clear()
  })

  describe('isMockMode()', () => {
    it('should detect mock mode from environment variable', () => {
      process.env.NEXT_PUBLIC_MOCK_AUTH = 'true'
      expect(isMockMode()).toBe(true)
    })

    it('should return false when not in mock mode', () => {
      process.env.NEXT_PUBLIC_MOCK_AUTH = 'false'
      expect(isMockMode()).toBe(false)
    })
  })

  describe('mockSignUp()', () => {
    it('should successfully sign up a user with valid email and password', async () => {
      const result = await mockSignUp('test@example.com', 'password123')
      expect(result.user.email).toBe('test@example.com')
      expect(result.session).toBeNull()
    })

    it('should store user in localStorage after signup', async () => {
      await mockSignUp('user@example.com', 'secure123')
      const storedUser = getMockUser()
      expect(storedUser).not.toBeNull()
      expect(storedUser?.email).toBe('user@example.com')
    })

    it('should reject email without @', async () => {
      await expect(mockSignUp('invalidemail', 'password123')).rejects.toThrow(
        'Invalid email format'
      )
    })

    it('should reject password shorter than 6 characters', async () => {
      await expect(mockSignUp('test@example.com', 'short')).rejects.toThrow(
        'Password must be at least 6 characters'
      )
    })

    it('should reject empty password', async () => {
      await expect(mockSignUp('test@example.com', '')).rejects.toThrow(
        'Password must be at least 6 characters'
      )
    })

    it('should generate unique user IDs', async () => {
      const user1 = await mockSignUp('user1@example.com', 'password123')
      const user2 = await mockSignUp('user2@example.com', 'password123')
      
      const stored1 = JSON.parse(localStorage.getItem('mock_auth_user') || '{}')
      expect(stored1.id).toBeTruthy()
      expect(stored1.id).toHaveLength(9)
    })

    it('should set creation timestamp', async () => {
      const beforeTime = new Date()
      await mockSignUp('test@example.com', 'password123')
      const afterTime = new Date()
      
      const user = getMockUser()
      const createdTime = new Date(user!.createdAt)
      
      expect(createdTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime())
      expect(createdTime.getTime()).toBeLessThanOrEqual(afterTime.getTime())
    })
  })

  describe('mockSignIn()', () => {
    it('should successfully sign in with valid email and password', async () => {
      const result = await mockSignIn('test@example.com', 'password123')
      expect(result.user.email).toBe('test@example.com')
      expect(result.session).not.toBeNull()
      expect(result.session?.access_token).toBe('mock_token')
    })

    it('should store user in localStorage after signin', async () => {
      await mockSignIn('signin@example.com', 'password123')
      const storedUser = getMockUser()
      expect(storedUser?.email).toBe('signin@example.com')
    })

    it('should reject invalid email format', async () => {
      await expect(mockSignIn('invalidemail', 'password123')).rejects.toThrow(
        'Invalid email format'
      )
    })

    it('should create session token on signin', async () => {
      const result = await mockSignIn('test@example.com', 'password123')
      expect(result.session?.access_token).toBe('mock_token')
    })

    it('should accept any password in mock mode', async () => {
      const validResult = await mockSignIn('test@example.com', 'anypassword')
      expect(validResult.user).toBeTruthy()
    })
  })

  describe('getMockUser()', () => {
    it('should return null when no user is logged in', () => {
      const user = getMockUser()
      expect(user).toBeNull()
    })

    it('should return the current logged in user', async () => {
      await mockSignIn('current@example.com', 'password123')
      const user = getMockUser()
      expect(user?.email).toBe('current@example.com')
    })

    it('should return user with id and timestamp', async () => {
      await mockSignUp('user@example.com', 'password123')
      const user = getMockUser()
      expect(user?.id).toBeTruthy()
      expect(user?.createdAt).toBeTruthy()
      expect(user?.email).toBe('user@example.com')
    })
  })

  describe('clearMockUser()', () => {
    it('should clear user from localStorage', async () => {
      await mockSignIn('test@example.com', 'password123')
      expect(getMockUser()).not.toBeNull()
      
      clearMockUser()
      expect(getMockUser()).toBeNull()
    })

    it('should be idempotent', () => {
      clearMockUser()
      clearMockUser()
      expect(getMockUser()).toBeNull()
    })

    it('should clear cookie', async () => {
      await mockSignIn('test@example.com', 'password123')
      clearMockUser()
      const user = getMockUser()
      expect(user).toBeNull()
    })
  })

  describe('Auth Flow Integration', () => {
    it('should complete signup and signin flow', async () => {
      // Signup
      const signupResult = await mockSignUp('newuser@example.com', 'password123')
      expect(signupResult.user.email).toBe('newuser@example.com')
      
      // Check localStorage
      let user = getMockUser()
      expect(user?.email).toBe('newuser@example.com')
      
      // Clear
      clearMockUser()
      user = getMockUser()
      expect(user).toBeNull()
      
      // Signin again
      const signinResult = await mockSignIn('newuser@example.com', 'password123')
      expect(signinResult.user.email).toBe('newuser@example.com')
      expect(signinResult.session?.access_token).toBe('mock_token')
    })

    it('should handle multiple users (last one wins)', async () => {
      await mockSignUp('user1@example.com', 'password123')
      let user = getMockUser()
      expect(user?.email).toBe('user1@example.com')
      
      // Signup another user
      await mockSignUp('user2@example.com', 'password123')
      user = getMockUser()
      expect(user?.email).toBe('user2@example.com')
    })
  })
})
