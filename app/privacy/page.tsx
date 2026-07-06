import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Heart } from "lucide-react"

export const metadata = {
  title: "Privacy Policy - NeuRafiki",
}

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: 2026-07-05 &middot; Version 1.0</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What data we collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              NeuRafiki collects account information (name, email), profile information for each person you assess
              (which may include a child or other dependant you are the parent or guardian of), and your responses
              to self-assessment screening questions across domains such as autism spectrum, ADHD, dyslexia,
              dyspraxia, sensory processing, and executive function.
            </p>
            <p>
              Because this platform is used to screen for neurodivergence in both adults and children, some of the
              data we store is about minors and is inherently sensitive. We only collect a child&apos;s assessment
              data with the explicit, revocable consent of their parent or legal guardian, captured immediately
              before the assessment begins.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How your data is stored and protected</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Assessment responses and results are encrypted at rest using PostgreSQL&apos;s <code>pgcrypto</code>{" "}
              extension. Only our server-side API, using a service-role database connection, can request decrypted
              values through a restricted database function -- your browser and any client-side code never has
              direct access to the encryption key or to plaintext responses.
            </p>
            <p>
              Row-level security policies restrict every account to its own data. Score computation happens
              server-side so that assessment results cannot be tampered with by modifying requests from the browser.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              We retain assessment data for as long as your account is active, or until you request deletion. You (or,
              for a child profile, their parent/guardian) may revoke consent at any time, which stops further use of
              that data for active screening purposes. Revoking consent does not by itself delete historical records
              needed for legal or safety obligations, but you may separately request full deletion.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your rights and how to reach us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              You may request access to, correction of, or deletion of any data associated with your account or a
              profile you manage, including a child&apos;s profile, at any time.
            </p>
            <p>
              To exercise these rights or ask a question about this policy, contact us at{" "}
              <a className="text-primary hover:underline" href="mailto:privacy@neurafiki.org">
                privacy@neurafiki.org
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          This is a placeholder policy pending legal review. It is intended to describe our current technical
          practices accurately and should be replaced with counsel-reviewed language before wide public launch.
        </p>
      </div>
    </div>
  )
}
