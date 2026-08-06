"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ValidatedInput } from "@/components/form/validated-input"
import { contactSchema } from "@/lib/validation/forms"
import { Loader2, CheckCircle2 } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const result = contactSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Failed to send message")
      }

      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to send message")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-8 space-y-3">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
        <h3 className="text-lg font-semibold">Message sent</h3>
        <p className="text-sm text-muted-foreground">Thanks for reaching out -- we&apos;ll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ValidatedInput
        label="Name"
        required
        value={formData.name}
        onChange={handleChange("name")}
        error={errors.name}
      />
      <ValidatedInput
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange("email")}
        error={errors.email}
      />
      <ValidatedInput
        label="Subject"
        required
        value={formData.subject}
        onChange={handleChange("subject")}
        error={errors.subject}
      />
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none" htmlFor="message">
          Message <span className="text-destructive ml-1">*</span>
        </label>
        <Textarea
          id="message"
          rows={6}
          value={formData.message}
          onChange={handleChange("message")}
          className={errors.message ? "border-destructive" : ""}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
      </div>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Send Message
      </Button>
    </form>
  )
}
