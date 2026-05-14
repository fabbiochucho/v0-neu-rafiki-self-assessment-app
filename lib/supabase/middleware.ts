import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check if Supabase credentials are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, check for mock auth or allow through
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase credentials not found. Using mock auth fallback...")
    
    // Check if mock auth session exists
    const mockUserCookie = request.cookies.get("mock_user_session")?.value
    const isPublicPath = request.nextUrl.pathname === "/" || 
                         request.nextUrl.pathname.startsWith("/login") ||
                         request.nextUrl.pathname.startsWith("/auth") ||
                         request.nextUrl.pathname.startsWith("/public")

    // Allow access to public paths
    if (isPublicPath) {
      return supabaseResponse
    }

    // For protected paths, require mock session
    if (!mockUserCookie) {
      console.log("[v0] No mock session found, redirecting to login")
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
    
    return supabaseResponse
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  let user = null
  
  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
          },
        },
      },
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: If you remove getUser() and you use server-side rendering
    // with the Supabase client, your users may be randomly logged out.
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.warn("[v0] Failed to get user from Supabase:", error.message)
    } else {
      user = data?.user
    }
  } catch (error) {
    console.warn("[v0] Supabase auth check failed:", error instanceof Error ? error.message : String(error))
  }

  // Check if mock auth is enabled and if there's a mock session in cookies
  const isMockAuthEnabled = process.env.NEXT_PUBLIC_MOCK_AUTH === "true"
  const mockUserCookie = request.cookies.get("mock_user_session")?.value

  const hasValidSession = user || (isMockAuthEnabled && mockUserCookie)

  if (
    request.nextUrl.pathname !== "/" &&
    !hasValidSession &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
