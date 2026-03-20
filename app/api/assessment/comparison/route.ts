import { NextRequest, NextResponse } from 'next/server'
import { assessmentComparisonService } from '@/lib/services/assessment-comparison'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/assessment/comparison
 * List all comparisons for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const comparisons = await assessmentComparisonService.listComparisons(
      user.id
    )

    return NextResponse.json({
      success: true,
      data: comparisons,
      count: comparisons.length,
    })
  } catch (error) {
    console.error('[Assessment Comparison GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch comparisons' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/assessment/comparison
 * Create a new comparison between two assessments
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstAssessmentId, secondAssessmentId, notes } = body

    if (!firstAssessmentId || !secondAssessmentId) {
      return NextResponse.json(
        { error: 'Both assessment IDs are required' },
        { status: 400 }
      )
    }

    if (firstAssessmentId === secondAssessmentId) {
      return NextResponse.json(
        { error: 'Cannot compare the same assessment' },
        { status: 400 }
      )
    }

    const comparison = await assessmentComparisonService.createComparison({
      userId: user.id,
      firstAssessmentId,
      secondAssessmentId,
      notes,
    })

    return NextResponse.json({
      success: true,
      data: comparison,
      message: 'Comparison created successfully',
    })
  } catch (error) {
    console.error('[Assessment Comparison POST]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create comparison' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/assessment/comparison/[id]
 * Delete a comparison
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const comparisonId = searchParams.get('id')

    if (!comparisonId) {
      return NextResponse.json(
        { error: 'Comparison ID required' },
        { status: 400 }
      )
    }

    await assessmentComparisonService.deleteComparison(comparisonId, user.id)

    return NextResponse.json({
      success: true,
      message: 'Comparison deleted successfully',
    })
  } catch (error) {
    console.error('[Assessment Comparison DELETE]', error)
    return NextResponse.json(
      { error: 'Failed to delete comparison' },
      { status: 500 }
    )
  }
}
