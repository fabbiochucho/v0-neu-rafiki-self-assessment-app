// Mock authentication for v0 preview environment
// This allows testing the UI without actual Supabase connectivity

export const isMockMode = () => {
  // Check if explicitly disabled
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'false') return false
  
  // If in browser, check hostname
  if (typeof window !== 'undefined') {
    const isPreviewEnvironment = window.location.hostname.includes('vusercontent.net') || 
                                 window.location.hostname.includes('localhost') ||
                                 window.location.hostname.includes('127.0.0.1')
    return isPreviewEnvironment || process.env.NEXT_PUBLIC_MOCK_AUTH === 'true'
  }
  
  // Server-side: check environment variable or default to true for non-production
  return process.env.NEXT_PUBLIC_MOCK_AUTH === 'true' || process.env.NODE_ENV !== 'production'
}

export async function mockSignUp(email: string, password: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (!email.includes('@')) {
    throw new Error('Invalid email format')
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }
  
  // Store mock user in localStorage
  const mockUser = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    createdAt: new Date().toISOString(),
  }
  
  localStorage.setItem('mock_auth_user', JSON.stringify(mockUser))
  
  // Also set a cookie so middleware can detect the session
  if (typeof document !== 'undefined') {
    document.cookie = `mock_user_session=${JSON.stringify(mockUser)}; path=/; max-age=86400; SameSite=Strict`
  }
  
  return { user: { email }, session: null }
}

export async function mockSignIn(email: string, password: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (!email.includes('@')) {
    throw new Error('Invalid email format')
  }
  
  // For demo, accept any email/password combination
  const mockUser = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    createdAt: new Date().toISOString(),
  }
  
  localStorage.setItem('mock_auth_user', JSON.stringify(mockUser))
  
  // Also set a cookie so middleware can detect the session
  if (typeof document !== 'undefined') {
    // Set cookie that persists across requests
    document.cookie = `mock_user_session=${JSON.stringify(mockUser)}; path=/; max-age=86400; SameSite=Strict`
  }
  
  return { user: { email }, session: { access_token: 'mock_token' } }
}

export function getMockUser() {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('mock_auth_user')
  return userStr ? JSON.parse(userStr) : null
}

export function clearMockUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mock_auth_user')
    // Clear the cookie by setting max-age to 0
    document.cookie = 'mock_user_session=; path=/; max-age=0; SameSite=Strict'
  }
}
