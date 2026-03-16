import { describe, it, expect, beforeEach } from 'vitest'
import { validateEnv, envSchema } from './env.schema'

describe('Environment Validation Schema', () => {
  const validEnv = {
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    NEXT_PUBLIC_MOCK_AUTH: 'false',
    NEXT_PUBLIC_DEMO_MODE: 'false',
    NEXT_PUBLIC_DEFAULT_DEMO_ROLE: 'donor',
    NODE_ENV: 'development',
  }

  beforeEach(() => {
    // Reset environment
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  describe('envSchema parsing', () => {
    it('should parse valid environment variables', () => {
      const result = envSchema.parse(validEnv)
      expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe('https://example.supabase.co')
      expect(result.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    })

    it('should reject invalid Supabase URL', () => {
      const invalidEnv = { ...validEnv, NEXT_PUBLIC_SUPABASE_URL: 'not-a-url' }
      expect(() => envSchema.parse(invalidEnv)).toThrow()
    })

    it('should reject empty Supabase anon key', () => {
      const invalidEnv = { ...validEnv, NEXT_PUBLIC_SUPABASE_ANON_KEY: '' }
      expect(() => envSchema.parse(invalidEnv)).toThrow()
    })

    it('should accept valid mock auth values', () => {
      const envTrue = envSchema.parse({ ...validEnv, NEXT_PUBLIC_MOCK_AUTH: 'true' })
      const envFalse = envSchema.parse({ ...validEnv, NEXT_PUBLIC_MOCK_AUTH: 'false' })
      
      expect(envTrue.NEXT_PUBLIC_MOCK_AUTH).toBe('true')
      expect(envFalse.NEXT_PUBLIC_MOCK_AUTH).toBe('false')
    })

    it('should use default values for optional fields', () => {
      const minimalEnv = {
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'key123',
      }
      const result = envSchema.parse(minimalEnv)
      
      expect(result.NEXT_PUBLIC_MOCK_AUTH).toBe('false')
      expect(result.NEXT_PUBLIC_DEMO_MODE).toBe('false')
      expect(result.NEXT_PUBLIC_DEFAULT_DEMO_ROLE).toBe('donor')
      expect(result.NODE_ENV).toBe('development')
    })

    it('should accept valid NODE_ENV values', () => {
      const devEnv = envSchema.parse({ ...validEnv, NODE_ENV: 'development' })
      const prodEnv = envSchema.parse({ ...validEnv, NODE_ENV: 'production' })
      const testEnv = envSchema.parse({ ...validEnv, NODE_ENV: 'test' })
      
      expect(devEnv.NODE_ENV).toBe('development')
      expect(prodEnv.NODE_ENV).toBe('production')
      expect(testEnv.NODE_ENV).toBe('test')
    })

    it('should reject invalid NODE_ENV values', () => {
      const invalidEnv = { ...validEnv, NODE_ENV: 'staging' }
      expect(() => envSchema.parse(invalidEnv)).toThrow()
    })
  })

  describe('validateEnv() function', () => {
    it('should validate and return environment on success', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = validEnv.NEXT_PUBLIC_SUPABASE_URL
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = validEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      const result = validateEnv()
      expect(result).toBeTruthy()
      expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe('https://example.supabase.co')
    })

    it('should throw formatted error on validation failure', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'invalid-url'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = validEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      expect(() => validateEnv()).toThrow()
      // Error should contain helpful message
    })

    it('should throw error for missing required fields', () => {
      expect(() => validateEnv()).toThrow()
    })

    it('should provide helpful error message with missing var names', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://valid.com'
      // NEXT_PUBLIC_SUPABASE_ANON_KEY not set
      
      try {
        validateEnv()
        expect.fail('Should have thrown')
      } catch (error) {
        expect(String(error)).toContain('Invalid environment configuration')
      }
    })
  })

  describe('Demo mode configuration', () => {
    it('should validate demo mode as enabled/disabled', () => {
      const enabledDemo = envSchema.parse({ ...validEnv, NEXT_PUBLIC_DEMO_MODE: 'true' })
      const disabledDemo = envSchema.parse({ ...validEnv, NEXT_PUBLIC_DEMO_MODE: 'false' })
      
      expect(enabledDemo.NEXT_PUBLIC_DEMO_MODE).toBe('true')
      expect(disabledDemo.NEXT_PUBLIC_DEMO_MODE).toBe('false')
    })

    it('should allow custom demo role', () => {
      const result = envSchema.parse({ ...validEnv, NEXT_PUBLIC_DEFAULT_DEMO_ROLE: 'admin' })
      expect(result.NEXT_PUBLIC_DEFAULT_DEMO_ROLE).toBe('admin')
    })

    it('should have sensible default demo role', () => {
      const result = envSchema.parse(validEnv)
      expect(result.NEXT_PUBLIC_DEFAULT_DEMO_ROLE).toBe('donor')
    })
  })

  describe('URL validation', () => {
    it('should accept valid Supabase URLs', () => {
      const urls = [
        'https://example.supabase.co',
        'https://my-project.supabase.co',
        'https://subdomain.example.com',
      ]
      
      urls.forEach(url => {
        const result = envSchema.parse({ ...validEnv, NEXT_PUBLIC_SUPABASE_URL: url })
        expect(result.NEXT_PUBLIC_SUPABASE_URL).toBe(url)
      })
    })

    it('should reject non-URL strings', () => {
      const invalidUrls = [
        'not a url',
        'localhost',
        'example',
        'ftp://example.com', // Only HTTPS expected
      ]
      
      invalidUrls.forEach(url => {
        expect(() => 
          envSchema.parse({ ...validEnv, NEXT_PUBLIC_SUPABASE_URL: url })
        ).toThrow()
      })
    })

    it('should accept http and https URLs', () => {
      const httpsEnv = envSchema.parse({ ...validEnv, NEXT_PUBLIC_SUPABASE_URL: 'https://example.com' })
      const httpEnv = envSchema.parse({ ...validEnv, NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:3000' })
      
      expect(httpsEnv.NEXT_PUBLIC_SUPABASE_URL).toContain('https://')
      expect(httpEnv.NEXT_PUBLIC_SUPABASE_URL).toContain('http://')
    })
  })
})
