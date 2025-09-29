export interface AssessmentDomain {
  id: string
  name: string
  code: string
  age_group: "toddler" | "child_adolescent" | "adult"
  age_min: number
  age_max: number
  question_count: number
  description: string
  cultural_adaptations: Record<string, any>
  created_at: string
}

export interface AssessmentQuestion {
  id: string
  domain_id: string
  question_text: string
  question_type: "likert" | "yes_no" | "multiple_choice" | "scale"
  response_options: {
    options: Array<{
      value: number
      label: string
    }>
  }
  age_group: "toddler" | "child_adolescent" | "adult"
  respondent_type: "self" | "parent" | "teacher" | "caregiver"
  cultural_context: Record<string, any>
  scoring_weight: number
  order_index: number
  is_follow_up: boolean
  baseline_question_id?: string
  created_at: string
}

export interface Organization {
  id: string
  name: string
  domain?: string
  admin_user_id: string
  subscription_tier: "free" | "premium"
  max_profiles: number
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: "admin" | "teacher" | "hr_staff" | "member"
  permissions: Record<string, any>
  created_at: string
}

export interface FollowUpAssessment {
  id: string
  baseline_assessment_id: string
  profile_id: string
  follow_up_type: "weekly" | "monthly" | "quarterly" | "biannual"
  scheduled_date: string
  completed_date?: string
  status: "scheduled" | "in_progress" | "completed" | "skipped"
  progress_notes?: string
  created_at: string
}

export interface FollowUpResponse {
  id: string
  follow_up_assessment_id: string
  question_id: string
  response_value: number
  baseline_response_value?: number
  change_score?: number
  notes?: string
  created_at: string
}

export interface BulkEnrollment {
  id: string
  organization_id: string
  uploaded_by: string
  file_name: string
  total_records: number
  processed_records: number
  failed_records: number
  status: "processing" | "completed" | "failed"
  error_log: Array<any>
  created_at: string
}

type Profile = {}

export interface ExtendedProfile extends Profile {
  organization_id?: string
  assigned_to?: string
  class_group?: string
  department?: string
}

type Assessment = {}

export interface ExtendedAssessment extends Assessment {
  organization_id?: string
}

export const QUESTION_BREAKDOWN = {
  toddler: {
    autism_spectrum: 20,
    adhd: 25,
    sensory_processing: 60,
    motor_coordination: 15,
    total: 120,
  },
  child_adolescent: {
    autism_spectrum: 65,
    adhd: 55,
    learning_differences: 60,
    motor_coordination: 20,
    sensory_processing: 86,
    executive_function: 86,
    total: 372,
  },
  adult: {
    autism_spectrum: 50,
    adhd: 45,
    learning_differences: 25,
    motor_coordination: 20,
    sensory_processing: 60,
    executive_function: 86,
    total: 286,
  },
  grand_total: 778, // Note: This will be ~838 with complete implementation
} as const

export const FOLLOW_UP_STRUCTURE = {
  questions_per_domain_age_group: 100,
  total_follow_up_questions: 1800, // ~100 per domain/age group combination
  follow_up_types: ["weekly", "monthly", "quarterly", "biannual"] as const,
  progress_tracking_areas: [
    "behavioral_changes",
    "cognitive_progress",
    "sensory_motor_improvements",
    "social_emotional_skills",
    "adaptive_functional_outcomes",
  ] as const,
} as const
