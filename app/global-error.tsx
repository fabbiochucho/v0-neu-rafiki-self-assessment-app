'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-2">Application Error</h1>
          <p className="text-muted-foreground mb-4">
            A critical issue occurred. Please refresh the page or try again later.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/60 mb-4 font-mono">
              ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  )
}
