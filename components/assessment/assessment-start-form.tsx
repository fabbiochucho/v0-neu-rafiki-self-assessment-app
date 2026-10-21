"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { offeredScreeningLanguages, type ScreeningLanguage } from "@/lib/assessment/screening-i18n"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { INFORMANTS, ageBandForAge, estimateMinutes, profileAge as getProfileAge } from "@/lib/assessment/journey"

const ASSESSMENT_CONSENT_VERSION = "1.0"

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
  /** "age_group|respondent_type|domain_id|is_follow_up" -> question count, from the live question bank. */
  questionCounts: Record<string, number>
}

export function AssessmentStartForm({ userProfiles, domains, questionCounts }: AssessmentStartFormProps) {
  const [selectedProfile, setSelectedProfile] = useState<string>("")
  const [assessmentType, setAssessmentType] = useState<string>("baseline")
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [informant, setInformant] = useState<string>("")
  const [assessmentSubject, setAssessmentSubject] = useState<"self" | "child">("self")
  const [childConsent, setChildConsent] = useState(false)
  const [guardianRelationship, setGuardianRelationship] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState<ScreeningLanguage>("en")
  const languages = offeredScreeningLanguages()

  const router = useRouter()
  const supabase = createClient()

  const selectedProfileData = userProfiles.find((p) => p.id === selectedProfile)
  const profileAge = getProfileAge(selectedProfileData ?? null)
  const ageBand = ageBandForAge(profileAge)
  const ageGroup = ageBand.dbAgeGroup
  const respondentType = INFORMANTS.find((i) => i.key === informant)?.respondentType ?? ""

  // Data-driven: only offer informants and areas that actually have
  // questions in the bank for this age group.
  const countFor = (rt: string, domainId: string) => questionCounts[`${ageGroup}|${rt}|${domainId}|${assessmentType === "follow_up"}`] || 0
  const availableInformants = INFORMANTS.filter((i) => domains.some((d) => countFor(i.respondentType, d.id) > 0))
  const availableDomains = domains.filter(
    (domain) => domain.age_groups.includes(ageGroup) && (!respondentType || countFor(respondentType, domain.id) > 0),
  )
  const selectedQuestionCount = respondentType
    ? selectedDomains.reduce((sum, id) => sum + countFor(respondentType, id), 0)
    : 0

  // Default the consent-step subject based on the selected profile's age, so
  // a profile for a minor doesn't silently default to "myself".
  useEffect(() => {
    if (selectedProfileData) {
      setAssessmentSubject(profileAge > 0 && profileAge < 18 ? "child" : "self")
      setChildConsent(false)
      setInformant("")
      setSelectedDomains([])
    }
  }, [selectedProfile]) // eslint-disable-line react-hooks/exhaustive-deps

  // Drop any selected areas that have no questions for a newly chosen informant.
  useEffect(() => {
    setSelectedDomains((prev) => prev.filter((id) => availableDomains.some((d) => d.id === id)))
  }, [informant, assessmentType]) // eslint-disable-line react-hooks/exhaustive-deps

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

    if (assessmentSubject === "child" && !childConsent) {
      setError("Please confirm consent to store this child's assessment responses before continuing")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be signed in to start an assessment")
      }

      // Create assessment record
      const { data: assessment, error: assessmentError } = await supabase
        .from("assessments")
        .insert({
          profile_id: selectedProfile,
          assessment_type: assessmentType,
          domains: domains.filter((d) => selectedDomains.includes(d.id)).map((d) => d.name),
          respondent_type: respondentType,
          // Only sent when not English, so this works before migration 026 is applied.
          ...(language !== "en" && { language }),
          status: "in_progress",
        })
        .select()
        .single()

      if (assessmentError) throw assessmentError

      // Record explicit per-profile consent to store this assessment's data.
      // For a child profile this is the parent/guardian consenting on the
      // child's behalf; the server-side /complete API re-verifies this row
      // (non-revoked) before it will persist final results.
      const { error: consentError } = await supabase.from("consents").insert({
        user_id: user.id,
        profile_id: selectedProfile,
        consent_type: "assessment_data",
        version: ASSESSMENT_CONSENT_VERSION,
        granted_at: new Date().toISOString(),
        is_for_minor: assessmentSubject === "child",
        guardian_relationship: assessmentSubject === "child" ? guardianRelationship.trim() || null : null,
      })

      if (consentError) throw consentError

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
        <CardTitle>Set up the screening</CardTitle>
        <CardDescription>
          A few choices so we show the right questions. You can pause at any point and pick up where you left off.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Selection */}
        <div className="space-y-2">
          <Label htmlFor="profile">Who are you assessing? *</Label>
          <Select value={selectedProfile} onValueChange={setSelectedProfile}>
            <SelectTrigger id="profile">
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

        {/* Language of the questions: only reviewed languages are offered (lib/assessment/screening-i18n.ts). */}
        {languages.length > 1 && (
          <div className="space-y-2">
            <Label htmlFor="screening-language">Language of the questions</Label>
            <Select value={language} onValueChange={(v) => setLanguage(v as ScreeningLanguage)}>
              <SelectTrigger id="screening-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l.code} value={l.code} lang={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Answers are scored the same way in every language. Questions not yet translated are shown in English.
            </p>
          </div>
        )}

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

        {/* Informant */}
        {selectedProfile && (
          <div className="space-y-2">
            <Label htmlFor="respondent">Who is answering the questions? *</Label>
            <Select value={informant} onValueChange={setInformant}>
              <SelectTrigger id="respondent">
                <SelectValue placeholder="Select who is answering" />
              </SelectTrigger>
              <SelectContent>
                {availableInformants.map((i) => (
                  <SelectItem key={i.key} value={i.key}>
                    {i.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Different people see the person in different settings. Only people with a question set for{" "}
              {ageBand.label.toLowerCase()} are listed.
            </p>
          </div>
        )}

        {/* Domain Selection */}
        {selectedProfile && respondentType && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Areas to explore * ({ageBand.label})</Label>
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

        {/* Consent Step */}
        {selectedProfile && (
          <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
            <Label>This assessment is about *</Label>
            <RadioGroup
              value={assessmentSubject}
              onValueChange={(value) => setAssessmentSubject(value as "self" | "child")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self" id="subject-self" />
                <Label htmlFor="subject-self">Myself</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="child" id="subject-child" />
                <Label htmlFor="subject-child">My child (I am completing this as their parent/guardian)</Label>
              </div>
            </RadioGroup>

            {assessmentSubject === "child" && (
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="guardianRelationship">Your relationship to the child (optional)</Label>
                  <Input
                    id="guardianRelationship"
                    placeholder="e.g., parent, legal guardian"
                    value={guardianRelationship}
                    onChange={(e) => setGuardianRelationship(e.target.value)}
                  />
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="childConsent"
                    checked={childConsent}
                    onCheckedChange={(checked) => setChildConsent(checked === true)}
                  />
                  <Label htmlFor="childConsent" className="text-sm font-normal leading-snug">
                    I consent, as this child&apos;s parent/guardian, to NeuRafiki collecting and storing their
                    assessment responses as described in the{" "}
                    <Link href="/privacy" target="_blank" className="text-primary underline underline-offset-2">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms" target="_blank" className="text-primary underline underline-offset-2">
                      Terms
                    </Link>
                    .
                  </Label>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedQuestionCount > 0 && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {selectedQuestionCount} questions in total, about {estimateMinutes(selectedQuestionCount)} minutes. Answers save
            as you go.
          </p>
        )}

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        <div className="pt-4">
          <Button
            onClick={handleStartAssessment}
            disabled={
              isLoading ||
              !selectedProfile ||
              !respondentType ||
              selectedDomains.length === 0 ||
              (assessmentSubject === "child" && !childConsent)
            }
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Starting…
              </>
            ) : (
              "Begin screening"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
