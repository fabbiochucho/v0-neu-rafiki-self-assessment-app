import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Mail, Globe, Search, Users, BookOpen } from "lucide-react"
import { isFederationEnabled, getSiblingAppUrl } from "@/lib/federation/config"

interface Resource {
  id: string
  name: string
  description: string
  category: string
  country: string
  serviceType: string
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  serviceArea: string[]
}

// Static fallback -- always available regardless of whether this deployment
// is connected to the Alliance app. Used when federation isn't configured
// (NEXT_PUBLIC_ALLIANCE_APP_URL unset), or if the live fetch below fails for
// any reason (sibling unreachable, bad response, etc).
const staticResources: Resource[] = [
  {
    id: "1",
    name: "Kenya Autism Society",
    description: "Provides support, advocacy, and resources for individuals with autism in Kenya",
    category: "Autism",
    country: "Kenya",
    serviceType: "NGO",
    contact: {
      phone: "+254-123-456789",
      email: "info@kenyaautism.org",
      website: "www.kenyaautism.org",
    },
    serviceArea: ["Nairobi", "Mombasa", "Kisumu"],
  },
  {
    id: "2",
    name: "ADHD Support Nigeria",
    description: "Comprehensive ADHD screening, assessment, and treatment services",
    category: "ADHD",
    country: "Nigeria",
    serviceType: "Clinic",
    contact: {
      phone: "+234-803-456789",
      email: "support@adhd-ng.org",
      website: "www.adhd-ng.org",
    },
    serviceArea: ["Lagos", "Abuja", "Port Harcourt"],
  },
  {
    id: "3",
    name: "South African Dyslexia Association",
    description: "Educational assessment and learning disability support",
    category: "Learning Disabilities",
    country: "South Africa",
    serviceType: "Association",
    contact: {
      phone: "+27-21-789012",
      email: "info@dyslexia-sa.org",
      website: "www.dyslexia-sa.org",
    },
    serviceArea: ["Cape Town", "Johannesburg", "Durban"],
  },
  {
    id: "4",
    name: "Ghana Occupational Therapy Center",
    description: "Sensory integration and motor development support",
    category: "Sensory Processing",
    country: "Ghana",
    serviceType: "Clinic",
    contact: {
      phone: "+233-24-123456",
      email: "contact@ot-ghana.org",
      website: "www.ot-ghana.org",
    },
    serviceArea: ["Accra", "Kumasi", "Takoradi"],
  },
  {
    id: "5",
    name: "Ethiopia Behavioral Health Institute",
    description: "Mental health and behavioral support services",
    category: "Behavioral Health",
    country: "Ethiopia",
    serviceType: "Hospital",
    contact: {
      phone: "+251-911-123456",
      email: "info@ebhi.org",
      website: "www.ebhi.org",
    },
    serviceArea: ["Addis Ababa", "Dire Dawa"],
  },
]

// Shape returned by Alliance's public GET /api/resources (see that repo's
// scripts/009_create_resources_table.sql + app/api/resources/route.ts).
interface AllianceResource {
  id: string
  name: string
  description: string | null
  category: string
  country: string | null
  location: string | null
  url: string | null
  contact_info: { phone?: string; email?: string; website?: string } | null
  specialties: string[] | null
}

function mapAllianceResource(r: AllianceResource): Resource {
  return {
    id: r.id,
    name: r.name,
    description: r.description || "",
    category: r.category,
    country: r.country || "Unknown",
    serviceType: "Alliance directory",
    contact: {
      phone: r.contact_info?.phone,
      email: r.contact_info?.email,
      website: r.contact_info?.website || r.url || undefined,
    },
    serviceArea: r.location ? [r.location] : [],
  }
}

// Fetches Alliance's public resource directory when this deployment is
// federation-enabled, falling back to the static list above on any failure
// (unset env var, network error, bad response shape) so this page always
// renders something rather than a broken/empty state.
async function loadResources(): Promise<Resource[]> {
  if (!isFederationEnabled()) return staticResources

  const siblingUrl = getSiblingAppUrl()
  if (!siblingUrl) return staticResources

  try {
    const res = await fetch(`${siblingUrl}/api/resources`, { next: { revalidate: 3600 } })
    if (!res.ok) return staticResources

    const body = await res.json()
    if (!Array.isArray(body?.resources)) return staticResources

    const mapped = (body.resources as AllianceResource[]).map(mapAllianceResource)
    return mapped.length > 0 ? mapped : staticResources
  } catch {
    return staticResources
  }
}

export default async function ResourcesPage() {
  const resources = await loadResources()
  const categories = Array.from(new Set(resources.map((r) => r.category)))
  const countries = Array.from(new Set(resources.map((r) => r.country)))
  const serviceTypes = Array.from(new Set(resources.map((r) => r.serviceType)))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-2">Support & Resources</h1>
            <p className="text-lg text-muted-foreground">
              Find professional support services, therapists, and resources across Africa
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by service name, condition, or location..."
                  className="pl-10"
                />
              </div>

              <Tabs defaultValue="category" className="w-full">
                <TabsList>
                  <TabsTrigger value="category">By Category</TabsTrigger>
                  <TabsTrigger value="country">By Country</TabsTrigger>
                  <TabsTrigger value="type">By Service Type</TabsTrigger>
                </TabsList>

                <TabsContent value="category" className="flex flex-wrap gap-2 mt-4">
                  {categories.map((cat) => (
                    <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {cat}
                    </Badge>
                  ))}
                </TabsContent>

                <TabsContent value="country" className="flex flex-wrap gap-2 mt-4">
                  {countries.map((country) => (
                    <Badge key={country} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {country}
                    </Badge>
                  ))}
                </TabsContent>

                <TabsContent value="type" className="flex flex-wrap gap-2 mt-4">
                  {serviceTypes.map((type) => (
                    <Badge key={type} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {type}
                    </Badge>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid gap-6">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{resource.name}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Badge>{resource.category}</Badge>
                    <Badge variant="secondary">{resource.serviceType}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Service Areas */}
                {resource.serviceArea.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">Service Areas</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resource.serviceArea.map((area) => (
                        <Badge key={area} variant="outline">{area}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  {resource.contact.phone && (
                    <a href={`tel:${resource.contact.phone}`}>
                      <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{resource.contact.phone}</span>
                      </div>
                    </a>
                  )}

                  {resource.contact.email && (
                    <a href={`mailto:${resource.contact.email}`}>
                      <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{resource.contact.email}</span>
                      </div>
                    </a>
                  )}

                  {resource.contact.website && (
                    <a href={`https://${resource.contact.website.replace(/^https?:\/\//, "")}`} target="_blank" rel="noopener noreferrer">
                      <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{resource.contact.website}</span>
                      </div>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  Educational Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access guides, handbooks, and educational materials about neurodivergence
                </p>
                <Button variant="outline" className="w-full bg-transparent">Learn More</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  Community Support Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect with other families and individuals in support groups
                </p>
                <Button variant="outline" className="w-full bg-transparent">Join Community</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
