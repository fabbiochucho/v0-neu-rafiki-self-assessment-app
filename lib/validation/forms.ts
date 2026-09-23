import { z } from "zod"

// Authentication schemas
export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  accountType: z.enum(["individual", "organization"], {
    errorMap: () => ({ message: "Please select an account type" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Profile schemas
export const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  preferredName: z.string().optional(),
  dateOfBirth: z.string().refine((date) => {
    const d = new Date(date)
    return d < new Date()
  }, "Date of birth must be in the past"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  country: z.string().min(1, "Country is required"),
  ethnicity: z.string().optional(),
  religion: z.string().optional(),
  educationalBackground: z.string().optional(),
})

// Assessment schemas
export const assessmentStartSchema = z.object({
  profileId: z.string().min(1, "Please select a profile"),
  domains: z.array(z.string()).min(1, "Please select at least one domain"),
  respondentType: z.enum(["self", "parent", "educator", "caregiver"], {
    errorMap: () => ({ message: "Please select a respondent type" }),
  }),
})

// Organization schemas
export const organizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  type: z.enum(["school", "clinic", "ngo", "hospital", "research", "other"]),
  country: z.string().min(1, "Country is required"),
  description: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  contactEmail: z.string().email("Invalid contact email"),
  phoneNumber: z.string().optional(),
})

// Validate form data
export async function validateFormData<T>(schema: z.ZodSchema, data: unknown): Promise<{ valid: boolean; errors?: Record<string, string[]>; data?: T }> {
  try {
    const validatedData = schema.parse(data) as T
    return { valid: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const path = err.path.join(".")
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(err.message)
      })
      return { valid: false, errors }
    }
    return { valid: false, errors: { form: ["Validation failed"] } }
  }
}

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
})

// Export types
export type SignUpFormData = z.infer<typeof signUpSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type AssessmentStartData = z.infer<typeof assessmentStartSchema>
export type OrganizationFormData = z.infer<typeof organizationSchema>
export type ContactFormData = z.infer<typeof contactSchema>
