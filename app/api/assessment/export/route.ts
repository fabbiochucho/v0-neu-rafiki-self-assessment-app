import { NextRequest, NextResponse } from 'next/server'
import { assessmentExportService } from '@/lib/services/assessment-export'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/assessment/export
 * List all exports for the current user
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

    const exports = await assessmentExportService.listExports(user.id)

    return NextResponse.json({
      success: true,
      data: exports,
      count: exports.length,
    })
  } catch (error) {
    console.error('[Assessment Export GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch exports' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/assessment/export
 * Create an export of an assessment
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
      assessmentId,
      format = 'pdf',
      includeInterpretation = true,
      shareableLink = false,
      expiresIn = 30,
    } = body

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      )
    }

    if (!['pdf', 'json'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be pdf or json' },
        { status: 400 }
      )
    }

    // Verify assessment ownership
    const { data: assessment } = await supabase
      .from('assessment_results')
      .select('id')
      .eq('id', assessmentId)
      .eq('user_id', user.id)
      .single()

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      )
    }

    const exportRecord = await assessmentExportService.createExport({
      userId: user.id,
      assessmentId,
      format: format as 'pdf' | 'json',
      includeInterpretation,
      shareableLink,
      expiresIn,
    })

    return NextResponse.json({
      success: true,
      data: exportRecord,
      message: 'Export created successfully',
      downloadUrl: `/api/assessment/export/${exportRecord.id}/download`,
    })
  } catch (error) {
    console.error('[Assessment Export POST]', error)
    return NextResponse.json(
      { error: 'Failed to create export' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/assessment/export?id=export_id
 * Revoke export sharing
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
    const exportId = searchParams.get('id')

    if (!exportId) {
      return NextResponse.json(
        { error: 'Export ID required' },
        { status: 400 }
      )
    }

    await assessmentExportService.revokeExport(exportId, user.id)

    return NextResponse.json({
      success: true,
      message: 'Export revoked successfully',
    })
  } catch (error) {
    console.error('[Assessment Export DELETE]', error)
    return NextResponse.json(
      { error: 'Failed to revoke export' },
      { status: 500 }
    )
  }
}
