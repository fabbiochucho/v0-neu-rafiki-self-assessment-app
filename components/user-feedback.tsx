'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { track, captureError } from '@/lib/telemetry'

export const UserFeedback = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    type: 'general',
    message: '',
    email: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('user_feedback').insert({
        rating: formData.rating,
        feedback_type: formData.type,
        message: formData.message,
        contact_email: formData.email || null,
        page_url: typeof window !== 'undefined' ? window.location.pathname : null,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : null,
      })
      if (error) throw error

      track('feedback_submitted', { rating: formData.rating, type: formData.type })
      setSubmitted(true)
      setTimeout(() => {
        setOpen(false)
        setSubmitted(false)
        setFormData({ rating: 5, type: 'general', message: '', email: '' })
      }, 3000)
    } catch (err) {
      captureError(err, { context: 'user_feedback_submit' })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50"
      >
        ✅ Thank you! Your feedback helps us improve.
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="feedback-panel"
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground w-12 h-12 rounded-full shadow-lg hover:scale-105 transition flex items-center justify-center text-xl z-40"
        title="Send feedback"
      >
        💬
      </button>

      {open && (
        <div
          id="feedback-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          className="fixed bottom-20 right-6 w-80 bg-background border rounded-xl shadow-xl p-4 space-y-3 animate-slide-up z-50"
        >
          <div className="flex justify-between items-center">
            <h2 id="feedback-title" className="font-semibold">
              Share Feedback
            </h2>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close feedback"
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-sm font-medium">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: n })}
                  aria-pressed={formData.rating === n}
                  className={`text-2xl transition ${
                    formData.rating >= n ? 'grayscale-0' : 'grayscale opacity-40'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>

            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border rounded bg-transparent text-sm"
            >
              <option value="general">General Feedback</option>
              <option value="bug">Report a Bug</option>
              <option value="feature">Feature Request</option>
            </select>

            <textarea
              required
              rows={3}
              placeholder="What can we improve?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2 border rounded bg-transparent text-sm resize-none"
            />

            <input
              type="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded bg-transparent text-sm"
            />

            <button
              type="submit"
              disabled={loading || !formData.message.trim()}
              className="w-full py-2 bg-primary text-primary-foreground rounded text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
            >
              {loading ? 'Sending...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
