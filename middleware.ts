import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Session-refresh middleware only needs to run on routes that actually
    // read auth state. Every one of these already does its own independent
    // supabase.auth.getUser() check server-side (see app/dashboard/*,
    // app/admin/*, app/assessment/*, app/connect/page.tsx), so this isn't the
    // only thing gating access -- it's here to refresh the session cookie for
    // logged-in users navigating the authenticated app shell. Public pages,
    // /auth/*, /privacy, /terms, and every /api/* route (each of which
    // creates its own Supabase client and checks auth internally) never need
    // this, so excluding them removes an unnecessary Supabase network
    // round-trip from nearly every page load on the site.
    "/dashboard/:path*",
    "/admin/:path*",
    "/assessment/:path*",
    "/connect",
  ],
}
