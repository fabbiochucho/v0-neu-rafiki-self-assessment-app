import Link from "next/link"
import { Button } from "@/components/ui/button"
import { KenteStrip } from "@/components/afro/kente-strip"

// Header for public reading pages (legal, guidelines).
export function SiteHeader() {
  return (
    <header className="bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className="companion-orb h-8 w-8 shrink-0 rounded-full" data-state="ready" />
          <span className="font-display text-2xl font-semibold truncate">NeuRafiki</span>
        </Link>
        <Button variant="ghost" asChild>
          <Link href="/auth/login">Sign in</Link>
        </Button>
      </div>
      <KenteStrip height={6} />
    </header>
  )
}
