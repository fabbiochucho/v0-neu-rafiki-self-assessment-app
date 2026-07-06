import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Heart } from "lucide-react"

export const metadata = {
  title: "Terms of Service - NeuRafiki",
}

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: 2026-07-05 &middot; Version 1.0</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Not a medical diagnosis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              NeuRafiki is a self-assessment screening tool. It is designed to help identify areas that may benefit
              from further professional evaluation, and does not itself provide a medical or psychological diagnosis.
              Always consult a qualified healthcare professional for diagnosis and treatment decisions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessing a child as a parent or guardian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              If you create a profile for and complete an assessment about a child, you represent that you are that
              child&apos;s parent or legal guardian and are authorized to consent to the collection and storage of
              their responses on their behalf. You may revoke this consent at any time from your account.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              You are responsible for keeping your login credentials confidential and for the accuracy of the
              information you submit. You agree not to attempt to bypass the platform&apos;s access controls,
              including by tampering with requests used to compute or store assessment scores.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Questions about these terms can be sent to{" "}
              <a className="text-primary hover:underline" href="mailto:legal@neurafiki.org">
                legal@neurafiki.org
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          This is a placeholder Terms of Service pending legal review, provided to support an explicit consent flow
          ahead of wide public launch.
        </p>
      </div>
    </div>
  )
}
