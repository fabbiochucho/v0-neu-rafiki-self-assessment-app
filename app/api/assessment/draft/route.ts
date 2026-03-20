import { NextRequest, NextResponse } from 'next/server'
import { assessmentDraftService } from '@/lib/services/assessment-draft'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/assessment/draft
 * List all drafts for the current user
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

    const drafts = await assessmentDraftService.listDrafts(user.id)

    return NextResponse.json({
      success: true,
      data: drafts,
      count: drafts.length,
    })
  } catch (error) {
    console.error('[Assessment Draft GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/assessment/draft
 * Save or update a draft
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
    const {
      assessmentType,
      responses,
      currentQuestionIndex,
      profileMetadata,
    } = body

    if (!assessmentType || currentQuestionIndex === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const draft = await assessmentDraftService.saveDraft({
      userId: user.id,
      assessmentType,
      responses: responses || {},
      currentQuestionIndex,
      startedAt: body.startedAt || new Date().toISOString(),
      lastSavedAt: new Date().toISOString(),
      profileMetadata,
    })

    return NextResponse.json({
      success: true,
      data: draft,
      message: 'Draft saved successfully',
    })
  } catch (error) {
    console.error('[Assessment Draft POST]', error)
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/assessment/draft?type=adhd
 * Delete a draft
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
    const assessmentType = searchParams.get('type')

    if (!assessmentType) {
      return NextResponse.json(
        { error: 'Assessment type required' },
        { status: 400 }
      )
    }

    await assessmentDraftService.deleteDraft(user.id, assessmentType)

    return NextResponse.json({
      success: true,
      message: 'Draft deleted successfully',
    })
  } catch (error) {
    console.error('[Assessment Draft DELETE]', error)
    return NextResponse.json(
      { error: 'Failed to delete draft' },
      { status: 500 }
    )
  }
}
