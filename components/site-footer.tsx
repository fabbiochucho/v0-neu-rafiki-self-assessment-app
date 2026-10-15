import Link from "next/link"
import { KenteStrip } from "@/components/afro/kente-strip"
import { getSiblingAppUrl } from "@/lib/federation/config"
import { BECOMECHANGE_URL, LEGAL_BRAND, LEGAL_CONTACT_EMAIL, LEGAL_OWNER } from "@/lib/legal"

const LINKS = [
  ["/about", "About"],
  ["/faq", "FAQ"],
  ["/blog", "Blog"],
  ["/support/resources", "Support resources"],
  ["/contact", "Contact"],
]

const LEGAL = [
  ["/privacy", "Privacy policy"],
  ["/terms", "Terms of use"],
  ["/guidelines", "Community guidelines"],
]

// Site-wide footer (rendered once in app/layout.tsx). Hidden when printing
// so printed reports stay clean.
export function SiteFooter() {
  const allianceUrl = getSiblingAppUrl()

  return (
    <footer className="bg-background text-muted-foreground print:hidden">
      <KenteStrip height={10} />
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <p className="max-w-md text-pretty">
            NeuRafiki and{" "}
            {allianceUrl ? (
              <a href={allianceUrl} className="underline hover:text-foreground">
                ANDA, the African Neurodiversity Alliance
              </a>
            ) : (
              "ANDA, the African Neurodiversity Alliance"
            )}
            , are products of{" "}
            <a href={BECOMECHANGE_URL} className="underline hover:text-foreground">
              {LEGAL_BRAND}
            </a>
            . Screening, not diagnosis.
          </p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm md:justify-end">
            {LINKS.map(([href, label]) => (
              <Link key={href} href={href} className="hover:text-foreground hover:underline">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm">
          <p>&copy; {new Date().getFullYear()} {LEGAL_OWNER}. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL.map(([href, label]) => (
              <Link key={href} href={href} className="hover:text-foreground hover:underline">
                {label}
              </Link>
            ))}
            <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="hover:text-foreground hover:underline break-all">
              {LEGAL_CONTACT_EMAIL}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
