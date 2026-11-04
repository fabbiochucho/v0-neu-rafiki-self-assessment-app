import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { buildCsp } from "@/lib/csp"
import { ADMIN_COOKIE, adminCookieFresh, adminCookieOptions, signAdminCookie } from "@/lib/staff/session"

// Session refresh (and its signed-out redirect to /auth/login) only runs on
// the authenticated app shell. Every one of these already does its own
// supabase.auth.getUser() check server-side (see app/dashboard/*,
// app/admin/*, app/assessment/*, app/connect/page.tsx), so this isn't the
// only thing gating access. Public pages skip it.
const SESSION_PATHS = ["/dashboard", "/admin", "/assessment", "/connect", "/check-in", "/account", "/staff"]

const needsSession = (path: string) => SESSION_PATHS.some((p) => path === p || path.startsWith(`${p}/`))

export async function middleware(request: NextRequest) {
  // Every page gets a fresh nonce; Next.js reads it from this request header
  // and stamps its own scripts with it.
  const nonce = btoa(crypto.randomUUID())
  const csp = buildCsp(nonce)
  request.headers.set("x-nonce", nonce)
  request.headers.set("Content-Security-Policy", csp)

  const response = needsSession(request.nextUrl.pathname)
    ? await updateSession(request)
    : NextResponse.next({ request })
  response.headers.set("Content-Security-Policy", csp)

  // Staff idle timer: renew it on each staff page view, but only while it's still fresh,
  // so an expired timer can't be revived by loading a page (lib/staff/session.ts).
  if (request.nextUrl.pathname.startsWith("/staff")) {
    const value = request.cookies.get(ADMIN_COOKIE)?.value
    const userId = value?.split(".")[0] ?? ""
    if (userId && (await adminCookieFresh(value, userId))) {
      response.cookies.set(ADMIN_COOKIE, await signAdminCookie(userId), adminCookieOptions)
    }
  }
  return response
}

export const config = {
  matcher: [
    {
      // Pages only: not API routes, build assets or static files.
      source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json|webmanifest)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
