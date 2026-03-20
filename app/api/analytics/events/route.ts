import { NextRequest, NextResponse } from 'next/server'
import { analyticsEventsService } from '@/lib/services/analytics-events'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/analytics/events
 * Track an analytics event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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
    } = body

    if (!eventType || !eventCategory || !sessionId) {
      return NextResponse.json(
        {
          error: 'Missing required fields: eventType, eventCategory, sessionId',
        },
        { status: 400 }
      )
    }

    const eventId = await analyticsEventsService.trackEvent({
      eventType,
      eventCategory: eventCategory as 'funnel' | 'engagement' | 'error' | 'performance',
      eventValue,
      eventProperties,
      sessionId,
      userCountry,
      userLanguage,
      pageUrl,
      referrerUrl,
    })

    return NextResponse.json({
      success: true,
      eventId,
    })
  } catch (error) {
    console.error('[Analytics Event POST]', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/analytics/events/funnel
 * Get conversion funnel data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint')
    const days = parseInt(searchParams.get('days') || '30')

    // Verify admin/analyst role
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or analyst
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin' && profile?.role !== 'analyst') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let result

    switch (endpoint) {
      case 'funnel':
        result = await analyticsEventsService.getConversionFunnel(days)
        break

      case 'cohort':
        result = await analyticsEventsService.getCohortAnalysisByCountry()
        break

      case 'heatmap':
        result = await analyticsEventsService.getEngagementHeatmap()
        break

      case 'daily-active-users':
        result = await analyticsEventsService.getDailyActiveUsers(days)
        break

      default:
        return NextResponse.json(
          { error: 'Unknown endpoint' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('[Analytics GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
