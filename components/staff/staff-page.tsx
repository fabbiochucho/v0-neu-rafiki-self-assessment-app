import Link from "next/link"
import { SiteHeader } from "@/components/site-header"

/** Frame for staff pages: site header, back link, title and an optional status line. */
export function StaffPage({
  title,
  intro,
  back = { href: "/staff", label: "Staff dashboard" },
  message,
  children,
  wide = false,
}: {
  title: string
  intro?: React.ReactNode
  back?: { href: string; label: string }
  message?: string | null
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 ${wide ? "" : "max-w-5xl"}`}>
        <header className="space-y-2">
          <Link href={back.href} className="text-sm text-primary underline">
            {back.label}
          </Link>
          <h1 className="text-3xl font-bold">{title}</h1>
          {intro && <div className="text-muted-foreground">{intro}</div>}
          {message && (
            <p role="status" className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              {message}
            </p>
          )}
        </header>
        {children}
      </main>
    </div>
  )
}

export const fieldClass = "rounded-md border border-input bg-background px-3 py-2 text-sm"
