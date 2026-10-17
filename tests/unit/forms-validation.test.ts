import { describe, expect, it } from "vitest"
import { assessmentStartSchema, contactSchema, validateFormData } from "@/lib/validation/forms"

describe("form schemas (zod 4)", () => {
  it("keeps the custom enum message", () => {
    const r = assessmentStartSchema.safeParse({ profileId: "p", domains: ["adhd"], respondentType: "robot" })
    expect(r.success).toBe(false)
    expect(r.error?.issues[0].message).toBe("Please select a respondent type")
  })
  it("reports contact-form errors by field", async () => {
    const r = await validateFormData(contactSchema, { name: "A", email: "x", subject: "Hi there", message: "Long enough message" })
    expect(r.valid).toBe(false)
    expect(r.errors?.name).toEqual(["Name must be at least 2 characters"])
    expect(r.errors?.email).toEqual(["Invalid email address"])
    expect(contactSchema.safeParse({ name: "Ada", email: "ada@example.org", subject: "Hello", message: "A real message here" }).success).toBe(true)
  })
})
