import { notFound, redirect } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { staffRole } from "@/lib/staff"
import { AdminVerify } from "./verify-form"

export const dynamic = "force-dynamic"
export const metadata = { title: "Staff sign-in | NeuRafiki", robots: { index: false } }

export default async function AdminVerifyPage() {
  const who = await staffRole()
  if (!who) redirect("/auth/login?redirect=%2Fstaff")
  if (!who.role) notFound()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-md px-4 py-16 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Staff sign-in</h1>
          <p className="text-muted-foreground">
            The staff panel needs a code from an authenticator app (such as Google Authenticator, Microsoft
            Authenticator or 1Password) every time you sign in, and again after 30 minutes without activity.
          </p>
        </header>
        <AdminVerify />
      </main>
    </div>
  )
}
