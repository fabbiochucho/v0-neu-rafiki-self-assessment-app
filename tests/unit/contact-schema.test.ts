import { describe, it, expect } from "vitest"
import { contactSchema } from "@/lib/validation/forms"

describe("contactSchema", () => {
  it("accepts a valid submission", () => {
    const result = contactSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      subject: "Question about consent",
      message: "How do I revoke consent for a profile I created?",
    })
    expect(result.success).toBe(true)
  })

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({
      name: "Ada",
      email: "not-an-email",
      subject: "Hi",
      message: "This message is long enough.",
    })
    expect(result.success).toBe(false)
  })

  it("rejects a message that's too short", () => {
    const result = contactSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      subject: "Hi",
      message: "short",
    })
    expect(result.success).toBe(false)
  })
})
