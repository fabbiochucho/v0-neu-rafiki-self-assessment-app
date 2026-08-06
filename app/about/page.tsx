import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Heart, Globe, Shield, Users } from "lucide-react"

export const metadata = {
  title: "About - NeuRafiki",
}

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold mb-2">About NeuRafiki</h1>
          <p className="text-muted-foreground">Understanding your neurodivergent journey, culturally adapted for Africa.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              NeuRafiki provides a privacy-first, accessible platform for neurodivergent self-assessment screening
              across domains such as autism spectrum, ADHD, dyslexia, dyspraxia, sensory processing, and executive
              function -- built with African cultural and educational context in mind rather than adapted as an
              afterthought.
            </p>
            <p>
              Many neurodivergent individuals and families face real barriers to getting screened: too few
              specialists, long waitlists, distance from clinics, and cost. NeuRafiki doesn&apos;t replace clinical
              diagnosis, but it aims to give people an accessible first step -- clarity on what to look into further,
              and a path to local professional support and resources.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <Globe className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-base">Culturally adapted</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Questions and recommendations designed around African cultural and educational contexts, not translated
              Western defaults.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-base">Privacy first</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Assessment data is encrypted at rest, gated behind explicit consent, and never sold. See our{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-base">Built for families</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Manage assessments for multiple family members or students, and track changes over time with follow-up
              screenings.
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>A screening tool, not a diagnosis</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            NeuRafiki is a screening tool, not a diagnostic service. Results are designed to help you decide whether
            to seek a professional evaluation -- they are not a substitute for one. If you or someone you support is
            in crisis, please see our{" "}
            <Link href="/support/resources" className="underline">
              support resources
            </Link>{" "}
            page.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Reach out via our{" "}
            <Link href="/contact" className="underline">
              contact page
            </Link>{" "}
            or check the{" "}
            <Link href="/faq" className="underline">
              FAQ
            </Link>
            .
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
