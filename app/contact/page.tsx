import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Heart, AlertTriangle } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata = {
  title: "Contact - NeuRafiki",
}

export default function ContactPage() {
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

      <div className="container mx-auto px-4 py-10 max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground">
            Questions about your account, data, or a partnership inquiry? Send us a message.
          </p>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              This form is not for emergencies. If you or someone you support is in crisis, please see our{" "}
              <Link href="/support/resources" className="underline font-medium">
                support resources
              </Link>{" "}
              page for immediate help.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send a message</CardTitle>
            <CardDescription>We aim to respond within a few business days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
