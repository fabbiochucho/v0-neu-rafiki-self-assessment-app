import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database'

/**
 * Analytics Events Service
 * Tracks all user interactions, funnel events, and engagement metrics
 */

export interface EventData {
  eventType: string // e.g., 'page_view', 'assessment_started', 'assessment_completed'
  eventCategory: 'funnel' | 'engagement' | 'error' | 'performance'
  eventValue?: number
  eventProperties?: Record<string, any>
  sessionId: string
  userCountry?: string
  userLanguage?: string
  pageUrl?: string
  referrerUrl?: string
}

export class AnalyticsEventsService {
  private supabase = createClient()

  /**
   * Track an event
   */
  async trackEvent(data: EventData): Promise<string> {
    const {
      eventType,
      eventCategory,
      eventValue,
      eventProperties,
      sessionId,
      userCountry,
      userLanguage,
      pageUrl,
      referrerUrl,
    } = data

    const { data: result, error } = await this.supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        event_category: eventCategory,
        event_value: eventValue,
        event_properties: eventProperties,
        session_id: sessionId,
        user_country: userCountry,
        user_language: userLanguage,
        page_url: pageUrl,
        referrer_url: referrerUrl,
        timestamp: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) throw error
    return result.id
  }

  /**
   * Track page view
   */
  async trackPageView(
    pagePath: string,
    sessionId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.trackEvent({
      eventType: 'page_view',
      eventCategory: 'engagement',
      eventProperties: { page_path: pagePath, ...metadata },
      sessionId,
      pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
    })
  }

  /**
   * Track assessment started (Funnel: Step 2)
   */
  async trackAssessmentStarted(
    assessmentType: string,
    sessionId: string
  ): Promise<void> {
    await this.trackEvent({
      eventType: 'assessment_started',
      eventCategory: 'funnel',
      eventProperties: { assessment_type: assessmentType },
      sessionId,
    })
  }

  /**
   * Track assessment question answered
   */
  async trackQuestionAnswered(
    questionId: string,
    assessmentType: string,
    responseTime: number, // seconds
    sessionId: string
  ): Promise<void> {
    await this.trackEvent({
      eventType: 'question_answered',
      eventCategory: 'engagement',
      eventValue: responseTime,
      eventProperties: {
        question_id: questionId,
        assessment_type: assessmentType,
      },
      sessionId,
    })
  }

  /**
   * Track assessment completed (Funnel: Step 3)
   */
  async trackAssessmentCompleted(
    assessmentType: string,
    totalTime: number, // milliseconds
    questionsAnswered: number,
    sessionId: string
  ): Promise<void> {
    await this.trackEvent({
      eventType: 'assessment_completed',
      eventCategory: 'funnel',
      eventValue: totalTime / 1000, // Convert to seconds
      eventProperties: {
        assessment_type: assessmentType,
        questions_answered: questionsAnswered,
        completion_time_ms: totalTime,
      },
      sessionId,
    })
  }

  /**
   * Track results viewed (Funnel: Step 4)
   */
  async trackResultsViewed(
    assessmentType: string,
    sessionId: string
  ): Promise<void> {
    await this.trackEvent({
      eventType: 'results_viewed',
      eventCategory: 'funnel',
      eventProperties: { assessment_type: assessmentType },
      sessionId,
    })
  }

  /**
   * Track action taken on results
   */
  async trackResultsAction(
    action: 'shared' | 'exported' | 'downloaded' | 'compared',
    assessmentType: string,
    sessionId: string
  ): Promise<void> {
    await this.trackEvent({
      eventType: `results_${action}`,
      eventCategory: 'engagement',
      eventProperties: { assessment_type: assessmentType },
      sessionId,
    })
  }

  /**
   * Track error event
   */
  async trackError(
    errorType: string,
    errorMessage: string,
    context: Record<string, any>,
    sessionId: string
  ): Promise<void> {
    await this.trackEvent({
      eventType: `error_${errorType}`,
      eventCategory: 'error',
      eventProperties: {
        error_message: errorMessage,
        ...context,
      },
      sessionId,
    })
  }

  /**
   * Track performance metric
   */
  async trackPerformance(
    metricName: string,
    value: number,
    sessionId: string
  ): Promise<void> {
    await this.trackEvent({
      eventType: `perf_${metricName}`,
      eventCategory: 'performance',
      eventValue: value,
      sessionId,
    })
  }

  /**
   * Get conversion funnel data
   */
  async getConversionFunnel(
    days: number = 30
  ): Promise<{
    signup: number
    assessmentStarted: number
    assessmentCompleted: number
    resultsViewed: number
    conversionRate: number // signup to completion rate
  }> {
    const { data, error } = await this.supabase
      .from('conversion_funnel')
      .select('*')
      .gte('event_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

    if (error) throw error

    const funnel = {
      signup: 0,
      assessmentStarted: 0,
      assessmentCompleted: 0,
      resultsViewed: 0,
    }

    data?.forEach((row: any) => {
      if (row.event_type === 'signup_completed') funnel.signup = row.unique_users
      if (row.event_type === 'assessment_started')
        funnel.assessmentStarted = row.unique_users
      if (row.event_type === 'assessment_completed')
        funnel.assessmentCompleted = row.unique_users
      if (row.event_type === 'results_viewed') funnel.resultsViewed = row.unique_users
    })

    const conversionRate =
      funnel.signup > 0
        ? Math.round((funnel.assessmentCompleted / funnel.signup) * 100)
        : 0

    return {
      ...funnel,
      conversionRate,
    }
  }

  /**
   * Get cohort analysis by country
   */
  async getCohortAnalysisByCountry(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('cohort_analysis_country')
      .select('*')

    if (error) throw error
    return data || []
  }

  /**
   * Get engagement heatmap (by day/hour)
   */
  async getEngagementHeatmap(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('engagement_heatmap')
      .select('*')

    if (error) throw error
    return data || []
  }

  /**
   * Get user journey summary
   */
  async getUserJourney(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('user_journey_summary')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data || []
  }

  /**
   * Get question-level analytics
   */
  async getQuestionAnalytics(questionId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('question_analytics')
      .select('*')
      .eq('question_id', questionId)
      .single()

    if (error && error.code === 'PGRST116') {
      return null // Not found
    }
    if (error) throw error
    return data
  }

  /**
   * Get assessment quality metrics
   */
  async getAssessmentQuality(assessmentId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('assessment_quality_metrics')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single()

    if (error && error.code === 'PGRST116') {
      return null
    }
    if (error) throw error
    return data
  }

  /**
   * Record assessment quality feedback
   */
  async recordQualityFeedback(
    assessmentId: string,
    data: {
      completionRate: number
      userDifficulty: 'easy' | 'moderate' | 'hard'
      confidenceScore: number // 1-5
      clarityRating: number // 1-5
      wouldRecommend: boolean
    }
  ): Promise<void> {
    const { error } = await this.supabase
      .from('assessment_quality_metrics')
      .insert({
        assessment_id: assessmentId,
        completion_rate: data.completionRate,
        user_reported_difficulty: data.userDifficulty,
        confidence_score: data.confidenceScore,
        result_clarity_rating: data.clarityRating,
        would_recommend: data.wouldRecommend,
      })

    if (error) throw error
  }

  /**
   * Get conversion rate between two events
   */
  async getConversionRate(
    fromEvent: string,
    toEvent: string,
    days: number = 30
  ): Promise<{
    fromCount: number
    toCount: number
    conversionRate: number
  }> {
    const { data, error } = await this.supabase.rpc('get_conversion_rate', {
      p_from_event: fromEvent,
      p_to_event: toEvent,
      p_days: days,
    })

    if (error) throw error

    return {
      fromCount: data?.[0]?.from_count || 0,
      toCount: data?.[0]?.to_count || 0,
      conversionRate: data?.[0]?.conversion_rate || 0,
    }
  }

  /**
   * Get daily active users
   */
  async getDailyActiveUsers(days: number = 30): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('analytics_events')
      .select('user_id, timestamp')
      .gte(
        'timestamp',
        new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      )

    if (error) throw error

    // Group by date and count unique users
    const grouped: Record<string, Set<string>> = {}
    data?.forEach((row: any) => {
      const date = new Date(row.timestamp).toISOString().split('T')[0]
      if (!grouped[date]) grouped[date] = new Set()
      if (row.user_id) grouped[date].add(row.user_id)
    })

    return Object.entries(grouped).map(([date, users]) => ({
      date,
      activeUsers: users.size,
    }))
  }

  /**
   * Clean up old events (older than 90 days)
   */
  async cleanupOldEvents(olderThanDays: number = 90): Promise<number> {
    const { data, error } = await this.supabase
      .from('analytics_events')
      .delete()
      .lt('timestamp', new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString())
      .select()

    if (error) throw error
    return data?.length || 0
  }
}

export const analyticsEventsService = new AnalyticsEventsService()
