import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Shield, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">NeuRafiki</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Culturally Adapted for African Communities
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Understand Your <span className="text-primary">Neurodivergent</span> Journey
          </h1>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            Comprehensive, privacy-first self-assessment tools for autism, ADHD, dyslexia, and other neurodivergent
            conditions. Built with African cultural context in mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Assessment
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose NeuRafiki?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines evidence-based assessments with cultural sensitivity and privacy protection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Multi-Profile Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage assessments for multiple family members or students from one account.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-lg">Culturally Adapted</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Questions and recommendations tailored to African cultural contexts and educational systems.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  GDPR and NDPR compliant with anonymized data collection and secure storage.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="text-lg">Support Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect directly with local support services, therapists, and educational resources.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment Domains */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Assessment Domains</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Screen across multiple neurodivergent conditions with validated, age-appropriate questionnaires.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Autism Spectrum", description: "Social communication and repetitive behaviors" },
              { name: "ADHD", description: "Attention, hyperactivity, and impulse control" },
              { name: "Dyslexia", description: "Reading, writing, and language processing" },
              { name: "Dyspraxia", description: "Motor coordination and planning" },
              { name: "Sensory Processing", description: "Sensory sensitivity and integration" },
              { name: "Executive Function", description: "Planning, organization, and cognitive flexibility" },
            ].map((domain) => (
              <Card key={domain.name} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{domain.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{domain.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of individuals and families who have found clarity and support through NeuRafiki.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg">Start Your Free Assessment</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground space-y-2">
          <p>&copy; 2025 NeuRafiki. Part of the African Neurodiversity Alliance ecosystem.</p>
          <p className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/faq" className="hover:underline">
              FAQ
            </Link>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
