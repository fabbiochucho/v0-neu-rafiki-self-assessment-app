"use client"

import type React from "react"
import { isMockMode, mockSignIn } from "@/lib/auth-mock"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Heart, Zap } from "lucide-react"
import { getAllDemoUsers } from "@/lib/demo-test-users"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)
  const router = useRouter()
  const demoUsers = getAllDemoUsers()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Use mock auth in preview environment, real auth in production
      if (isMockMode()) {
        await mockSignIn(email, password)
      } else {
        const supabase = createClient()

        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw new Error(error.message || "Authentication failed")
        }
      }

      router.push("/dashboard")
    } catch (error: unknown) {
      console.error("Login error:", error)
      let errorMessage = "An error occurred during login"

      if (error instanceof Error) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLoginDemo = async (demoEmail: string, demoPassword: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await mockSignIn(demoEmail, demoPassword)
      router.push("/dashboard")
    } catch (error: unknown) {
      console.error("Demo login error:", error)
      setError(error instanceof Error ? error.message : "Demo login failed")
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

                {/* Demo Users Section */}
                <div className="mt-6 border-t pt-6">
                  <button
                    type="button"
                    onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Zap className="h-4 w-4" />
                    {showDemoAccounts ? "Hide Demo Accounts" : "Try Demo Accounts"}
                  </button>

                  {showDemoAccounts && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-muted-foreground text-center mb-3">
                        Quick access for testing different user types
                      </p>
                      {demoUsers.map((demoUser) => (
                        <Button
                          key={demoUser.id}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start"
                          onClick={() =>
                            handleQuickLoginDemo(demoUser.email, demoUser.password)
                          }
                          disabled={isLoading}
                        >
                          <div className="flex flex-col items-start w-full">
                            <span className="font-medium text-xs">
                              {demoUser.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {demoUser.role === "health_professional"
                                ? "Health Professional"
                                : demoUser.role
                                    .replace(/_/g, " ")
                                    .charAt(0)
                                    .toUpperCase() +
                                  demoUser.role
                                    .replace(/_/g, " ")
                                    .slice(1)}
                            </span>
                          </div>
                        </Button>
                      ))}
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        All demo accounts use mock data
                      </p>
                    </div>
                  )}
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
