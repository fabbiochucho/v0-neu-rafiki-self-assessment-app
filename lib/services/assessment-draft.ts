import { createClient } from '@/lib/supabase/server'
import type { AssessmentDraft, AssessmentResponse } from '@/lib/types/assessment'

/**
 * Assessment Draft Service
 * Handles saving, resuming, and managing assessment drafts
 */

export interface DraftData {
  userId: string
  assessmentType: string
  responses: Record<string, AssessmentResponse>
  currentQuestionIndex: number
  startedAt: string
  lastSavedAt: string
  profileMetadata?: Record<string, any>
}

export class AssessmentDraftService {
  private supabase = createClient()

  /**
   * Save assessment draft
   */
  async saveDraft(data: DraftData): Promise<AssessmentDraft> {
    const { data: draft, error } = await this.supabase
      .from('assessment_drafts')
      .upsert(
        {
          user_id: data.userId,
          assessment_type: data.assessmentType,
          responses: data.responses,
          current_question_index: data.currentQuestionIndex,
          started_at: data.startedAt,
          last_saved_at: new Date().toISOString(),
          profile_metadata: data.profileMetadata,
        },
        {
          onConflict: 'user_id,assessment_type',
        }
      )
      .select()
      .single()

    if (error) throw error
    return draft
  }

  /**
   * Get draft for assessment type
   */
  async getDraft(
    userId: string,
    assessmentType: string
  ): Promise<AssessmentDraft | null> {
    const { data, error } = await this.supabase
      .from('assessment_drafts')
      .select('*')
      .eq('user_id', userId)
      .eq('assessment_type', assessmentType)
      .single()

    if (error && error.code === 'PGRST116') {
      return null // No draft found
    }
    if (error) throw error
    return data
  }

  /**
   * List all drafts for user
   */
  async listDrafts(userId: string): Promise<AssessmentDraft[]> {
    const { data, error } = await this.supabase
      .from('assessment_drafts')
      .select('*')
      .eq('user_id', userId)
      .order('last_saved_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * Delete draft
   */
  async deleteDraft(userId: string, assessmentType: string): Promise<void> {
    const { error } = await this.supabase
      .from('assessment_drafts')
      .delete()
      .eq('user_id', userId)
      .eq('assessment_type', assessmentType)

    if (error) throw error
  }

  /**
   * Calculate progress percentage
   */
  getProgressPercentage(
    currentIndex: number,
    totalQuestions: number
  ): number {
    return Math.round((currentIndex / totalQuestions) * 100)
  }

  /**
   * Check if draft is stale (older than 30 days)
   */
  isDraftStale(lastSavedAt: string): boolean {
    const lastSaved = new Date(lastSavedAt)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return lastSaved < thirtyDaysAgo
  }
}

export const assessmentDraftService = new AssessmentDraftService()
