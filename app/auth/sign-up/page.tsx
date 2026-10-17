"use client";

import React from "react"
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart } from "lucide-react"
import { Turnstile, TURNSTILE_SITE_KEY } from "@/components/turnstile"
import { LEGAL_UPDATED } from "@/lib/legal"

const CONSENT_VERSION = "1.0"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [accountType, setAccountType] = useState<"individual" | "organization">("individual");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaKey, setCaptchaKey] = useState(0)
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+\-=[\]{};'\:"|<>?,./`~]/.test(password)) {
      setError("Password must be at least 12 characters, with an uppercase letter, a lowercase letter, a number and a symbol");
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Privacy Policy and Terms to create an account");
      setIsLoading(false);
      return;
    }

    try {
      // Store user metadata for post-signup profile creation
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "pending_profile_data",
          JSON.stringify({
            full_name: fullName,
            account_type: accountType,
          })
        );
      }

      const supabase = createClient();

      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken: captchaToken ?? undefined,
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/auth/sign-up-success`,
          data: {
            full_name: fullName,
            account_type: accountType,
            // Which version of the terms and privacy policy this person agreed to.
            terms_version: LEGAL_UPDATED,
            terms_accepted_at: new Date().toISOString(),
          },
        },
      });

      if (error) {
        setCaptchaToken(null)
        setCaptchaKey((k) => k + 1)
        throw error
      }

      // Record account-level consent. This project has email confirmation
      // enabled (see app/auth/sign-up-success/page.tsx), so signUp() does not
      // return an active session yet -- an insert attempted right now would
      // fail RLS (auth.uid() = user_id has no uid() to compare against
      // without a session). Try anyway in case confirmation is disabled in
      // some environments, but always also stash the fact that consent was
      // given so app/auth/login/page.tsx can record it as soon as a real
      // session exists (first login after confirming).
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "pending_consent",
          JSON.stringify({ consent_type: "account_terms", version: CONSENT_VERSION }),
        );
      }

      if (signUpData.user && signUpData.session) {
        const { error: consentError } = await supabase.from("consents").insert({
          user_id: signUpData.user.id,
          consent_type: "account_terms",
          version: CONSENT_VERSION,
          granted_at: new Date().toISOString(),
          is_for_minor: false,
        });
        if (!consentError && typeof window !== "undefined") {
          localStorage.removeItem("pending_consent");
        } else if (consentError) {
          console.error("[consent] Failed to record account_terms consent:", consentError);
        }
      }

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      console.error("[v0] Sign-up error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during sign-up. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Join NeuRafiki to begin your neurodivergent journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your full name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select value={accountType} onValueChange={(value) => setAccountType(value as "individual" | "organization")}>
                      <SelectTrigger id="accountType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="12+ characters: Aa, 1 and a symbol"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Confirm Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <Checkbox
                      id="agreeToTerms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      required
                    />
                    <Label htmlFor="agreeToTerms" className="block min-w-0 text-sm font-normal leading-snug">
                      I agree to the{" "}
                      <Link href="/privacy" target="_blank" className="text-primary underline underline-offset-2">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" target="_blank" className="text-primary underline underline-offset-2">
                        Terms
                      </Link>
                      . This may include storing my child&apos;s assessment responses if I assess a child.
                    </Label>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                      {error}
                    </div>
                  )}

                  <Turnstile key={captchaKey} onToken={setCaptchaToken} />
                  <Button type="submit" className="w-full mt-2" disabled={isLoading || !agreedToTerms || (!!TURNSTILE_SITE_KEY && !captchaToken)}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </div>

                <div className="mt-6 text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
