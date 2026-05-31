'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Route-level error:', error)
  }, [error])

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="rounded-lg bg-destructive/10 p-6 border border-destructive/30 max-w-md">
        <h2 className="text-xl font-semibold text-destructive mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">
          We couldn&apos;t load this section. Please try again or contact support if the issue persists.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/60 mb-4 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <Button onClick={reset} variant="secondary">
          Try Again
        </Button>
      </div>
    </div>
  )
}
