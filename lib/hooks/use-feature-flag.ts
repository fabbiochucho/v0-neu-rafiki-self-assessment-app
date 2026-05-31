'use client'
import { useState, useEffect } from 'react'

export function useFeatureFlag(flag: string, defaultValue = true) {
  const [isEnabled, setIsEnabled] = useState(defaultValue)

  useEffect(() => {
    // Check env var first, then localStorage override for testing
    const envKey = `NEXT_PUBLIC_ENABLE_${flag.toUpperCase()}`
    const envFlag = typeof window !== 'undefined' ? process.env[envKey] : undefined
    const stored = typeof window !== 'undefined' ? localStorage.getItem(`flag:${flag}`) : null

    setIsEnabled(stored !== null ? stored === 'true' : envFlag !== 'false')
  }, [flag])

  const toggle = () => {
    const next = !isEnabled
    if (typeof window !== 'undefined') {
      localStorage.setItem(`flag:${flag}`, String(next))
    }
    setIsEnabled(next)
  }

  return { isEnabled, toggle }
}
