"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Trash2 } from "lucide-react"

interface UserProfile {
  id?: string
  full_name: string
  preferred_name: string | null
  sex_gender: string | null
  date_of_birth: string | null
  age: number | null
  country: string | null
  ethnicity: string | null
  language: string | null
  religion: string | null
  education_stage: string | null
  school_or_workplace: string | null
  primary_caregiver_contact: string | null
  is_primary: boolean
}

interface ProfileFormProps {
  userId: string
  existingProfile?: UserProfile
}

export function ProfileForm({ userId, existingProfile }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>({
    full_name: existingProfile?.full_name || "",
    preferred_name: existingProfile?.preferred_name || "",
    sex_gender: existingProfile?.sex_gender || "",
    date_of_birth: existingProfile?.date_of_birth || "",
    age: existingProfile?.age || null,
    country: existingProfile?.country || "",
    ethnicity: existingProfile?.ethnicity || "",
    language: existingProfile?.language || "English",
    religion: existingProfile?.religion || "",
    education_stage: existingProfile?.education_stage || "",
    school_or_workplace: existingProfile?.school_or_workplace || "",
    primary_caregiver_contact: existingProfile?.primary_caregiver_contact || "",
    is_primary: existingProfile?.is_primary || false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!existingProfile

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleInputChange = (field: keyof UserProfile, value: string | boolean | number | null) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-calculate age when date of birth changes
      if (field === "date_of_birth" && typeof value === "string" && value) {
        updated.age = calculateAge(value)
      }

      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.full_name.trim()) {
      setError("Full name is required")
      setIsLoading(false)
      return
    }

    try {
      const profileData = {
        ...formData,
        user_id: userId,
        full_name: formData.full_name.trim(),
        preferred_name: formData.preferred_name?.trim() || null,
      }

      if (isEditing && existingProfile?.id) {
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update(profileData)
          .eq("id", existingProfile.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("user_profiles").insert(profileData)

        if (insertError) throw insertError
      }

      router.push("/dashboard/profiles")
    } catch (error) {
      console.error("Error saving profile:", error)
      setError(error instanceof Error ? error.message : "Failed to save profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingProfile?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase.from("user_profiles").delete().eq("id", existingProfile.id)

      if (deleteError) throw deleteError

      router.push("/dashboard/profiles")
    } catch (error) {
      console.error("Error deleting profile:", error)
      setError(error instanceof Error ? error.message : "Failed to delete profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Profile" : "Create New Profile"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the profile information below."
            : "Fill in the details to create a new profile for assessment."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_name">Preferred Name</Label>
                <Input
                  id="preferred_name"
                  value={formData.preferred_name || ""}
                  onChange={(e) => handleInputChange("preferred_name", e.target.value)}
                  placeholder="Nickname or preferred name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth || ""}
                  onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value) || null)}
                  placeholder="Age in years"
                  min="0"
                  max="120"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex_gender">Sex/Gender</Label>
              <Select
                value={formData.sex_gender || ""}
                onValueChange={(value) => handleInputChange("sex_gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sex/gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cultural Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cultural Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country || ""} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nigeria">Nigeria</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="south-africa">South Africa</SelectItem>
                    <SelectItem value="ghana">Ghana</SelectItem>
                    <SelectItem value="uganda">Uganda</SelectItem>
                    <SelectItem value="tanzania">Tanzania</SelectItem>
                    <SelectItem value="ethiopia">Ethiopia</SelectItem>
                    <SelectItem value="morocco">Morocco</SelectItem>
                    <SelectItem value="egypt">Egypt</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Primary Language</Label>
                <Select value={formData.language || ""} onValueChange={(value) => handleInputChange("language", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="Swahili">Swahili</SelectItem>
                    <SelectItem value="Portuguese">Portuguese</SelectItem>
                    <SelectItem value="Hausa">Hausa</SelectItem>
                    <SelectItem value="Yoruba">Yoruba</SelectItem>
                    <SelectItem value="Igbo">Igbo</SelectItem>
                    <SelectItem value="Amharic">Amharic</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ethnicity">Ethnicity (Optional)</Label>
                <Input
                  id="ethnicity"
                  value={formData.ethnicity || ""}
                  onChange={(e) => handleInputChange("ethnicity", e.target.value)}
                  placeholder="e.g., Yoruba, Kikuyu, Zulu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="religion">Religion (Optional)</Label>
                <Input
                  id="religion"
                  value={formData.religion || ""}
                  onChange={(e) => handleInputChange("religion", e.target.value)}
                  placeholder="e.g., Christianity, Islam, Traditional"
                />
              </div>
            </div>
          </div>

          {/* Educational Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Educational Information</h3>

            <div className="space-y-2">
              <Label htmlFor="education_stage">Education Stage</Label>
              <Select
                value={formData.education_stage || ""}
                onValueChange={(value) => handleInputChange("education_stage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-school">Pre-school</SelectItem>
                  <SelectItem value="primary">Primary School</SelectItem>
                  <SelectItem value="secondary">Secondary School</SelectItem>
                  <SelectItem value="tertiary">Tertiary/University</SelectItem>
                  <SelectItem value="adult-education">Adult Education</SelectItem>
                  <SelectItem value="not-in-school">Not in School</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="school_or_workplace">School/Workplace (Optional)</Label>
              <Input
                id="school_or_workplace"
                value={formData.school_or_workplace || ""}
                onChange={(e) => handleInputChange("school_or_workplace", e.target.value)}
                placeholder="Name of school or workplace"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>

            <div className="space-y-2">
              <Label htmlFor="primary_caregiver_contact">Primary Caregiver Contact (Optional)</Label>
              <Textarea
                id="primary_caregiver_contact"
                value={formData.primary_caregiver_contact || ""}
                onChange={(e) => handleInputChange("primary_caregiver_contact", e.target.value)}
                placeholder="Contact information for primary caregiver (for minors)"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_primary"
                checked={formData.is_primary}
                onCheckedChange={(checked) => handleInputChange("is_primary", checked as boolean)}
              />
              <Label htmlFor="is_primary" className="text-sm">
                This is my primary profile (for self-assessment)
              </Label>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Profile
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/profiles")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Update Profile" : "Create Profile"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Delete Profile</CardTitle>
                <CardDescription>
                  Are you sure you want to delete this profile? This action cannot be undone and will also delete all
                  associated assessments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
