import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, Heart } from "lucide-react"

export const metadata = {
  title: "FAQ - NeuRafiki",
}

const faqs = [
  {
    question: "Is a NeuRafiki assessment a medical diagnosis?",
    answer:
      "No. NeuRafiki is a screening tool, not a diagnostic service. It's designed to help you identify areas that may benefit from a professional evaluation. Please consult a qualified healthcare professional, psychologist, or educational specialist for an actual diagnosis.",
  },
  {
    question: "Who can complete an assessment?",
    answer:
      "You can complete a self-assessment for yourself, or -- with explicit consent -- as a parent/guardian, teacher, or therapist assessing someone in your care. Question sets adapt based on the respondent type and the age group of the person being assessed.",
  },
  {
    question: "How is my data protected?",
    answer:
      "Assessment responses and results are encrypted at rest, access is restricted by row-level security so only you can see your own profiles' data, and nothing is collected without your explicit consent. See our Privacy Policy for the full details.",
  },
  {
    question: "Can I delete my data?",
    answer:
      "Yes. You can revoke consent for a profile at any time, which stops further data collection for it. For full account or data deletion requests, use the contact page.",
  },
  {
    question: "What conditions does NeuRafiki screen for?",
    answer:
      "Current domains include Autism Spectrum, ADHD, Dyslexia/Learning Differences, Dyspraxia, Sensory Processing, and Executive Function, with age-appropriate question sets for toddlers, children/adolescents, and adults.",
  },
  {
    question: "Can I track changes over time?",
    answer:
      "Yes. You can schedule follow-up assessments (weekly, monthly, quarterly, or bi-annual) for a profile from your dashboard, and NeuRafiki will send a reminder email when one becomes due.",
  },
  {
    question: "What is the optional \"Alliance\" connection I see on some pages?",
    answer:
      "Some NeuRafiki deployments can optionally link to a sibling app (\"Alliance\") so completed results can be shared across the two, with your explicit per-profile consent. It's fully opt-in -- if a given deployment isn't connected to Alliance, you won't see this option at all.",
  },
  {
    question: "Where can I find local support services?",
    answer:
      "Visit the Support & Resources page for professional referrals and crisis resources. If a deployment is connected to Alliance, that directory is used; otherwise a small set of verified resources is shown.",
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">NeuRafiki</span>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Common questions about assessments, privacy, and how NeuRafiki works.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="text-sm text-muted-foreground">
          Didn&apos;t find what you were looking for?{" "}
          <Link href="/contact" className="underline">
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
