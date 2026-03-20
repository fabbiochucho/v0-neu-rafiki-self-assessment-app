import { createClient } from '@/lib/supabase/server'
import type { AssessmentComparison, AssessmentResult } from '@/lib/types/assessment'

/**
 * Assessment Comparison Service
 * Allows users to compare multiple assessment results over time
 */

export interface ComparisonData {
  userId: string
  firstAssessmentId: string
  secondAssessmentId: string
  notes?: string
}

export class AssessmentComparisonService {
  private supabase = createClient()

  /**
   * Create comparison between two assessments
   */
  async createComparison(data: ComparisonData): Promise<AssessmentComparison> {
    // Verify both assessments belong to user
    const { data: assessments, error: fetchError } = await this.supabase
      .from('assessment_results')
      .select('id, assessment_type, scores, created_at')
      .in('id', [data.firstAssessmentId, data.secondAssessmentId])
      .eq('user_id', data.userId)

    if (fetchError) throw fetchError
    if (assessments?.length !== 2) {
      throw new Error('Both assessments must belong to the user')
    }

    const { data: comparison, error } = await this.supabase
      .from('assessment_comparisons')
      .insert({
        user_id: data.userId,
        first_assessment_id: data.firstAssessmentId,
        second_assessment_id: data.secondAssessmentId,
        notes: data.notes,
      })
      .select()
      .single()

    if (error) throw error
    return comparison
  }

  /**
   * Get comparison with full assessment data
   */
  async getComparison(
    comparisonId: string,
    userId: string
  ): Promise<AssessmentComparison & { assessments: AssessmentResult[] }> {
    const { data: comparison, error: compError } = await this.supabase
      .from('assessment_comparisons')
      .select(
        `
        *,
        first_assessment:first_assessment_id(id, assessment_type, scores, created_at, interpretation),
        second_assessment:second_assessment_id(id, assessment_type, scores, created_at, interpretation)
      `
      )
      .eq('id', comparisonId)
      .eq('user_id', userId)
      .single()

    if (compError) throw compError

    return {
      ...comparison,
      assessments: [comparison.first_assessment, comparison.second_assessment],
    }
  }

  /**
   * List all comparisons for user
   */
  async listComparisons(userId: string): Promise<AssessmentComparison[]> {
    const { data, error } = await this.supabase
      .from('assessment_comparisons')
      .select(
        `
        id,
        created_at,
        notes,
        first_assessment:first_assessment_id(id, assessment_type, created_at),
        second_assessment:second_assessment_id(id, assessment_type, created_at)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * Calculate score changes between assessments
   */
  calculateScoreChanges(
    firstScores: Record<string, number>,
    secondScores: Record<string, number>
  ): Record<string, { before: number; after: number; change: number; percentChange: number }> {
    const changes: Record<string, any> = {}

    for (const [key, before] of Object.entries(firstScores)) {
      const after = secondScores[key] || 0
      const change = after - before
      const percentChange = before > 0 ? (change / before) * 100 : 0

      changes[key] = {
        before,
        after,
        change,
        percentChange: Math.round(percentChange),
      }
    }

    return changes
  }

  /**
   * Generate comparison summary
   */
  generateSummary(
    firstDate: string,
    secondDate: string,
    changes: Record<string, any>
  ): string {
    const firstDateObj = new Date(firstDate)
    const secondDateObj = new Date(secondDate)
    const daysBetween = Math.floor(
      (secondDateObj.getTime() - firstDateObj.getTime()) / (1000 * 60 * 60 * 24)
    )

    const improved = Object.entries(changes)
      .filter(([, data]) => data.change > 0)
      .map(([key]) => key)

    const declined = Object.entries(changes)
      .filter(([, data]) => data.change < 0)
      .map(([key]) => key)

    let summary = `Comparison between assessments taken ${daysBetween} days apart. `

    if (improved.length > 0) {
      summary += `Improvements in: ${improved.join(', ')}. `
    }

    if (declined.length > 0) {
      summary += `Areas needing attention: ${declined.join(', ')}.`
    }

    return summary
  }

  /**
   * Delete comparison
   */
  async deleteComparison(comparisonId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('assessment_comparisons')
      .delete()
      .eq('id', comparisonId)
      .eq('user_id', userId)

    if (error) throw error
  }
}

export const assessmentComparisonService = new AssessmentComparisonService()
