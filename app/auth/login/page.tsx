"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Heart } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Login attempt with email:", email)

      const supabase = createClient()

      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message || "Authentication failed")
      }

      console.log("[v0] Supabase login successful")

      // If sign-up happened while email confirmation was pending, the
      // account_terms consent recorded there couldn't be inserted yet (no
      // session = no auth.uid() for the RLS check). Now that we have a real
      // session, record it if it's still outstanding.
      if (typeof window !== "undefined" && data.user) {
        const pending = localStorage.getItem("pending_consent")
        if (pending) {
          try {
            const { consent_type, version } = JSON.parse(pending)
            const { error: consentError } = await supabase.from("consents").insert({
              user_id: data.user.id,
              consent_type,
              version,
              granted_at: new Date().toISOString(),
              is_for_minor: false,
            })
            if (!consentError) {
              localStorage.removeItem("pending_consent")
            }
          } catch (consentErr) {
            console.error("[consent] Failed to record pending consent on login:", consentErr)
          }
        }
      }

      console.log("[v0] Login successful, redirecting to dashboard")
      router.push("/dashboard")
    } catch (error: unknown) {
      console.error("[v0] Login error:", error)
      let errorMessage = "An error occurred during login"

      if (error instanceof Error) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">NeuRafiki</span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">Sign in to continue your journey</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
                <div className="mt-6 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
