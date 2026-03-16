import { z } from 'zod'

const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anonymous key is required'),
  
  // Mock Auth Configuration (optional, defaults to false)
  NEXT_PUBLIC_MOCK_AUTH: z.enum(['true', 'false']).optional().default('false'),
  
  // Demo Mode Configuration (optional)
  NEXT_PUBLIC_DEMO_MODE: z.enum(['true', 'false']).optional().default('false'),
  NEXT_PUBLIC_DEFAULT_DEMO_ROLE: z.string().optional().default('donor'),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
})

// Validate environment variables at runtime
export function validateEnv() {
  try {
    const env = envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_MOCK_AUTH: process.env.NEXT_PUBLIC_MOCK_AUTH,
      NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
      NEXT_PUBLIC_DEFAULT_DEMO_ROLE: process.env.NEXT_PUBLIC_DEFAULT_DEMO_ROLE,
      NODE_ENV: process.env.NODE_ENV,
    })
    
    return env
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n')
      
      throw new Error(
        `❌ Invalid environment configuration:\n${missingVars}\n\nPlease check your .env.local file.`
      )
    }
    throw error
  }
}

// Export the validated environment type
export type Env = z.infer<typeof envSchema>
