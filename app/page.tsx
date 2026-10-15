import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KenteStrip } from "@/components/afro/kente-strip"
import { PillarPreview } from "@/components/home/pillar-preview"

const DOMAINS = [
  { name: "Autism", description: "Social communication and repetitive behaviours", thread: "var(--thread-indigo)" },
  { name: "ADHD", description: "Attention, hyperactivity and impulse control", thread: "var(--thread-terracotta)" },
  { name: "Dyslexia", description: "Reading, writing and language processing", thread: "var(--thread-gold)" },
  { name: "Dyspraxia", description: "Motor coordination and planning", thread: "var(--thread-teal)" },
  { name: "Sensory processing", description: "Sensory sensitivity and integration", thread: "var(--thread-green)" },
  { name: "Executive function", description: "Planning, organisation and flexible thinking", thread: "var(--thread-indigo)" },
]

const PROMISES = [
  { title: "Several people, one account", text: "Manage screenings for family members or students from one account." },
  { title: "Made for African contexts", text: "Questions and recommendations tailored to African cultural contexts and school systems." },
  { title: "Privacy first", text: "Data is anonymised where possible and stored securely. Your answers stay yours." },
  { title: "Connected to support", text: "Continue into ANDA to turn what you learn into a plan with goals and a support team." },
]

export default function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="NeuRafiki home">
            <span aria-hidden="true" className="companion-orb h-8 w-8 shrink-0 rounded-full" data-state="ready" />
            <span className="hidden min-[400px]:inline font-display text-2xl font-semibold">NeuRafiki</span>
          </Link>
          <nav aria-label="Account" className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
          </nav>
        </div>
        <KenteStrip height={6} />
      </header>

      <main>
        {/* Hero: the promise, beside a working example of each pillar (brief §46) */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden">
          <div aria-hidden="true" className="afro-texture absolute inset-y-0 right-0 hidden lg:block lg:w-[50%]" />
          <div className="container relative mx-auto px-4 py-12 lg:py-16 grid gap-10 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-center">
            <div className="max-w-xl min-w-0">
              <h1 id="hero-heading" className="text-5xl sm:text-6xl xl:text-[4.25rem] font-semibold leading-[1.02] text-balance">
                Assess. Understand. <span className="text-primary">Accompany.</span>
              </h1>
              <p className="mt-6 text-xl text-muted-foreground text-pretty leading-relaxed">
                A structured neurodevelopmental assessment platform with an intelligent companion that helps you
                understand your results and navigate your next steps.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild className="h-12 px-7 text-base">
                  <Link href="/auth/sign-up">
                    Start free assessment <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-7 text-base bg-background">
                  <Link href="/about">Learn more</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Screening, not a diagnosis. Culturally adapted for African communities.
              </p>
            </div>
            <PillarPreview />
          </div>
        </section>

        <KenteStrip height={8} />

        {/* Areas: woven chips, each with its own thread */}
        <section aria-labelledby="areas-heading" className="py-20">
          <div className="container mx-auto px-4">
            <h2 id="areas-heading" className="text-4xl lg:text-5xl font-semibold text-balance max-w-2xl">
              Areas a screening can explore
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-pretty">
              Age-appropriate questions for ages 2 to adult, answered by the person or by a parent, caregiver, teacher or
              professional.
            </p>
            <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {DOMAINS.map((d) => (
                <li key={d.name} className="flex gap-4 border-t py-5">
                  <span aria-hidden="true" className="mt-1.5 h-10 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: d.thread }} />
                  <span>
                    <span className="block font-display text-xl font-semibold">{d.name}</span>
                    <span className="mt-1 block text-muted-foreground">{d.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why NeuRafiki: one committed deep-indigo band */}
        <section aria-labelledby="why-heading" className="relative overflow-hidden bg-loom text-loom-foreground">
          <div aria-hidden="true" className="afro-texture absolute inset-0" style={{ ["--texture" as string]: "rgb(243 239 230 / 0.08)" }} />
          <div className="container relative mx-auto px-4 py-20">
            <h2 id="why-heading" className="text-4xl lg:text-5xl font-semibold text-balance max-w-3xl">
              Structured screening, with care built in
            </h2>
            <ul className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {PROMISES.map((p, i) => (
                <li key={p.title} className="border-t-2 pt-5" style={{ borderColor: ["var(--thread-gold)", "var(--thread-teal)", "var(--thread-terracotta)", "var(--thread-green)"][i] }}>
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-loom-muted text-pretty">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Close */}
        <section aria-labelledby="begin-heading" className="py-20">
          <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <h2 id="begin-heading" className="text-4xl lg:text-5xl font-semibold text-balance">
                Ready to begin your journey?
              </h2>
              <p className="mt-4 text-xl text-muted-foreground text-pretty">
                Start with a free screening. You can pause at any time and pick up where you left off.
              </p>
            </div>
            <Button size="lg" asChild className="h-12 px-7 text-base">
              <Link href="/auth/sign-up">Start your free assessment</Link>
            </Button>
          </div>
        </section>
      </main>

    </div>
  )
}
