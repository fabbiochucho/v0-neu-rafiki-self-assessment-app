import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { ThreadMark } from "@/components/afro/thread-mark"
import { LEGAL_CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/legal"

export const metadata = {
  title: "Community guidelines | NeuRafiki",
  description: "How to use NeuRafiki well: respectful, honest and private screening for neurodivergent people across Africa.",
}

const PRINCIPLES = [
  { label: "Dignity", desc: "Neurodivergence is a difference, not a defect", thread: "var(--thread-teal)" },
  { label: "Honesty", desc: "Answer as things really are, not as you hope", thread: "var(--thread-gold)" },
  { label: "Privacy", desc: "Protect people, especially children", thread: "var(--thread-indigo)" },
  { label: "Inclusion", desc: "Every family, language and context belongs", thread: "var(--thread-terracotta)" },
]

const SECTIONS = [
  {
    title: "Respect and neurodiversity-affirming language",
    description: "Treat everyone with respect, and talk about neurodivergence with dignity.",
    thread: "var(--thread-teal)",
    rules: [
      "Use respectful language about autism, ADHD, dyslexia and every other difference, and follow the person's own preference for how they're described.",
      "Don't describe neurodivergent people as broken, cursed, a burden, or something to be cured.",
      "Respect different cultures, faiths and family structures across Africa, while never excusing harm to a child or adult.",
      "Be kind in anything you write to us or in notes others may read.",
    ],
  },
  {
    title: "Screening honestly",
    description: "A screening is only useful when it reflects real life.",
    thread: "var(--thread-gold)",
    rules: [
      "Answer based on what you see day to day. There are no right or wrong answers.",
      "Treat results as a starting point for a conversation with a professional, not a diagnosis.",
      "Don't use a result to label, exclude or punish anyone, at school, at work or at home.",
      "Don't screen someone without their knowledge. Involve them as much as they're able.",
    ],
  },
  {
    title: "Privacy and protecting children",
    description: "Much of what's stored on NeuRafiki is about children and is sensitive.",
    thread: "var(--thread-indigo)",
    rules: [
      "Only screen a child if you're their parent or legal guardian, or have the guardian's permission.",
      "Only share a result or check-in when the person, or for a child their guardian, would agree.",
      "Don't post screenshots of someone else's results in public.",
      "If you see a child or adult at risk of harm, contact local emergency services first, then tell us.",
    ],
  },
  {
    title: "Check-ins and sharing with ANDA",
    description: "For families and support teams linking NeuRafiki to a support plan.",
    thread: "var(--thread-green)",
    rules: [
      "Tick the sharing box only when you're happy for the support team on ANDA to see that check-in.",
      "Keep check-in notes factual and kind. Someone else on the team may read the summary.",
      "If a team member's role ends, ask the plan owner on ANDA to remove their access.",
    ],
  },
  {
    title: "Using the AI companion responsibly",
    description: "The companion is a helper, not an expert.",
    thread: "var(--thread-terracotta)",
    rules: [
      "Treat its answers as a starting point, and check anything important with a professional.",
      "Don't type names, addresses or other identifying details into the chat.",
      "Don't use it to create misleading content or anything these guidelines don't allow.",
    ],
  },
  {
    title: "Reporting problems",
    description: "How to raise a concern, and what happens next.",
    thread: "var(--thread-teal)",
    rules: [
      `Email ${LEGAL_CONTACT_EMAIL} and tell us what's wrong.`,
      "For urgent safety concerns, contact local emergency services or a crisis line first.",
      "Deliberately false reports are themselves a breach of these guidelines.",
    ],
  },
]

const LEVELS = [
  { level: "Minor", text: "A reminder, and the content edited or removed." },
  { level: "Serious", text: "Account features restricted. For example: screening someone without permission, or sharing their results." },
  {
    level: "Severe",
    text: "Account closed, and serious matters reported to the authorities. For example: exploiting or endangering a child, fraud.",
  },
]

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-semibold text-balance">Community guidelines</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated {LEGAL_UPDATED}</p>
          <p className="mt-6 text-lg text-pretty">
            How to use NeuRafiki well. These guidelines apply to everyone: individuals, families, educators and
            professionals. They sit alongside our{" "}
            <Link href="/terms" className="text-primary underline">
              terms of use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary underline">
              privacy policy
            </Link>
            .
          </p>

          <section aria-labelledby="principles-h" className="mt-10">
            <h2 id="principles-h" className="text-2xl font-semibold">
              Our principles
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {PRINCIPLES.map((p) => (
                <li key={p.label} className="flex gap-3 rounded-2xl border bg-card p-4">
                  <ThreadMark color={p.thread} className="mt-1" />
                  <span>
                    <span className="block font-semibold">{p.label}</span>
                    <span className="block text-sm text-muted-foreground">{p.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((s, i) => (
              <section key={s.title} aria-labelledby={`g-${i}`}>
                <h2 id={`g-${i}`} className="flex items-center gap-3 text-2xl font-semibold">
                  <ThreadMark color={s.thread} />
                  {s.title}
                </h2>
                <p className="mt-1 text-muted-foreground">{s.description}</p>
                <ul className="mt-4 space-y-2.5 list-disc pl-5 marker:text-muted-foreground">
                  {s.rules.map((r) => (
                    <li key={r} className="text-pretty break-words">
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <section aria-labelledby="breaches-h" className="mt-14 rounded-2xl border-2 border-[var(--thread-gold)] p-6">
            <h2 id="breaches-h" className="text-2xl font-semibold">
              If guidelines are broken
            </h2>
            <ul className="mt-4 space-y-4">
              {LEVELS.map((l) => (
                <li key={l.level}>
                  <p className="font-semibold">{l.level}</p>
                  <p className="text-muted-foreground text-pretty">{l.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-pretty">
              If you think we got a decision wrong, email{" "}
              <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="text-primary underline break-all">
                {LEGAL_CONTACT_EMAIL}
              </a>{" "}
              and someone who wasn&apos;t involved will look at it again.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
