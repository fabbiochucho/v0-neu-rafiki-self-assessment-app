export type LogLevel = 'info' | 'warn' | 'error' | 'debug'
export type Meta = Record<string, unknown>

const LOGSNAG_KEY = process.env.LOGSNAG_API_KEY
const LOGSNAG_PROJECT = process.env.LOGSNAG_PROJECT

export function track(event: string, meta?: Meta) {
  sendToLogSnag('track', event, meta)
  if (process.env.NODE_ENV === 'development') {
    console.log('[track]', event, meta)
  }
}

export function captureError(error: unknown, meta?: Meta) {
  const err = error instanceof Error ? error : new Error(String(error))
  sendToLogSnag('error', err.message, { stack: err.stack, ...meta })
  console.error('[error]', err.message, meta)
}

export function captureWarning(message: string, meta?: Meta) {
  sendToLogSnag('warn', message, meta)
  console.warn('[warning]', message, meta)
}

async function sendToLogSnag(
  type: string,
  title: string,
  meta?: Meta
) {
  if (!LOGSNAG_KEY || !LOGSNAG_PROJECT) return

  try {
    await fetch('https://api.logsnag.com/v1/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LOGSNAG_KEY}`,
      },
      body: JSON.stringify({
        project: LOGSNAG_PROJECT,
        channel: 'neurafiki-app',
        event: title,
        description: type,
        icon: type === 'error' ? '🚨' : type === 'warn' ? '⚠️' : '📊',
        notify: type === 'error',
        tags: { env: process.env.NODE_ENV, ...meta },
      }),
    })
  } catch (e) {
    // Silent fail for monitoring fallback
  }
}
