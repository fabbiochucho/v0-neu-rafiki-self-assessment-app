import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, BookOpen } from "lucide-react"

export const metadata = {
  title: "Blog - NeuRafiki",
}

/**
 * No CMS/database table backs blog posts yet -- this intentionally ships as
 * a real empty state rather than seeded placeholder articles. Publishing
 * fabricated health-related content under the NeuRafiki name would read as
 * real editorial/medical guidance, which is worse than an honest "nothing
 * here yet."
 */
export default function BlogPage() {
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

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Blog</h1>
          <p className="text-muted-foreground">Updates, research notes, and community stories from NeuRafiki.</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">
              We haven&apos;t published anything here yet. Check back soon, or reach out via our{" "}
              <Link href="/contact" className="underline">
                contact page
              </Link>{" "}
              with questions in the meantime.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
