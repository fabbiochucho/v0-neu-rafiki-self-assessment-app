"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface UserProfile {
  id: string
  full_name: string
  preferred_name: string | null
  age: number | null
  date_of_birth: string | null
}

interface AssessmentDomain {
  id: string
  name: string
  description: string | null
  age_groups: string[]
}

interface AssessmentStartFormProps {
  userProfiles: UserProfile[]
  domains: AssessmentDomain[]
}

export function AssessmentStartForm({ userProfiles, domains }: AssessmentStartFormProps) {
  const [selectedProfile, setSelectedProfile] = useState<string>("")
  const [assessmentType, setAssessmentType] = useState<string>("baseline")
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [respondentType, setRespondentType] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const selectedProfileData = userProfiles.find((p) => p.id === selectedProfile)
  const profileAge = selectedProfileData?.age || 0

  // Determine age group for filtering domains
  const getAgeGroup = (age: number) => {
    if (age <= 5) return "Toddlers (2-5)"
    if (age <= 18) return "Children/Adolescents (6-18)"
    return "Adults (18+)"
  }

  const ageGroup = getAgeGroup(profileAge)
  const availableDomains = domains.filter((domain) => domain.age_groups.includes(ageGroup))

  const handleDomainToggle = (domainId: string) => {
    setSelectedDomains((prev) => (prev.includes(domainId) ? prev.filter((id) => id !== domainId) : [...prev, domainId]))
  }

  const handleSelectAllDomains = () => {
    if (selectedDomains.length === availableDomains.length) {
      setSelectedDomains([])
    } else {
      setSelectedDomains(availableDomains.map((d) => d.id))
    }
  }

  const handleStartAssessment = async () => {
    if (!selectedProfile || !respondentType || selectedDomains.length === 0) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create assessment record
      const { data: assessment, error: assessmentError } = await supabase
        .from("assessments")
        .insert({
          profile_id: selectedProfile,
          assessment_type: assessmentType,
          domains: domains.filter((d) => selectedDomains.includes(d.id)).map((d) => d.name),
          respondent_type: respondentType,
          status: "in_progress",
        })
        .select()
        .single()

      if (assessmentError) throw assessmentError

      // Redirect to assessment questions
      router.push(`/assessment/${assessment.id}/questions`)
    } catch (error) {
      console.error("Error starting assessment:", error)
      setError(error instanceof Error ? error.message : "Failed to start assessment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Configuration</CardTitle>
        <CardDescription>Configure your assessment settings before beginning.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Selection */}
        <div className="space-y-2">
          <Label htmlFor="profile">Who are you assessing? *</Label>
          <Select value={selectedProfile} onValueChange={setSelectedProfile}>
            <SelectTrigger>
              <SelectValue placeholder="Select a profile" />
            </SelectTrigger>
            <SelectContent>
              {userProfiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.preferred_name || profile.full_name}
                  {profile.age && ` (Age: ${profile.age})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assessment Type */}
        <div className="space-y-3">
          <Label>Assessment Type *</Label>
          <RadioGroup value={assessmentType} onValueChange={setAssessmentType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="baseline" id="baseline" />
              <Label htmlFor="baseline">Baseline Assessment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="follow_up" id="follow_up" />
              <Label htmlFor="follow_up">Follow-up Assessment</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Respondent Type */}
        {selectedProfile && (
          <div className="space-y-2">
            <Label htmlFor="respondent">Who is completing this assessment? *</Label>
            <Select value={respondentType} onValueChange={setRespondentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select respondent type" />
              </SelectTrigger>
              <SelectContent>
                {profileAge >= 18 && <SelectItem value="self">Self-report</SelectItem>}
                <SelectItem value="parent_caregiver">Parent/Caregiver</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="therapist">Therapist/Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Domain Selection */}
        {selectedProfile && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Assessment Domains * (Age group: {ageGroup})</Label>
              <Button variant="outline" size="sm" onClick={handleSelectAllDomains} type="button">
                {selectedDomains.length === availableDomains.length ? "Deselect All" : "Select All"}
              </Button>
            </div>

            <div className="grid gap-3">
              {availableDomains.map((domain) => (
                <div key={domain.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={domain.id}
                    checked={selectedDomains.includes(domain.id)}
                    onCheckedChange={() => handleDomainToggle(domain.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={domain.id} className="font-medium cursor-pointer">
                      {domain.name}
                    </Label>
                    {domain.description && <p className="text-sm text-muted-foreground mt-1">{domain.description}</p>}
                  </div>
                </div>
              ))}
            </div>

            {selectedDomains.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedDomains.map((domainId) => {
                  const domain = domains.find((d) => d.id === domainId)
                  return domain ? (
                    <Badge key={domainId} variant="secondary">
                      {domain.name}
                    </Badge>
                  ) : null
                })}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        <div className="pt-4">
          <Button
            onClick={handleStartAssessment}
            disabled={isLoading || !selectedProfile || !respondentType || selectedDomains.length === 0}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Starting Assessment...
              </>
            ) : (
              "Start Assessment"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
