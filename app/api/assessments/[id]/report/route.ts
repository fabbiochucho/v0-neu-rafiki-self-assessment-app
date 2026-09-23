import { NextResponse, type NextRequest } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { createClient } from "@/lib/supabase/server"
import { getOwnedAssessment } from "@/lib/assessment/authorize"
import { ResultsReportDocument, type ReportDomainResult } from "@/lib/pdf/results-report"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET: streams a PDF version of an assessment's results. Reuses the same
 * ownership check as the results page (getOwnedAssessment) -- assessment_results
 * rows are plaintext (unlike assessment_responses), so this can read them
 * through the normal RLS-scoped client rather than the service-role client.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const assessment = await getOwnedAssessment(supabase, id, user.id)
  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
  }

  if (assessment.status !== "completed") {
    return NextResponse.json({ error: "Assessment is not yet completed" }, { status: 409 })
  }

  const { data: results, error: resultsError } = await supabase
    .from("assessment_results")
    .select("domain_name, total_score, max_possible_score, percentage_score, risk_level")
    .eq("assessment_id", id)

  if (resultsError) {
    return NextResponse.json({ error: "Failed to load results" }, { status: 500 })
  }

  const domainResults = (results || []) as ReportDomainResult[]
  const overallRiskLevel = domainResults.some((r) => r.risk_level === "high")
    ? "high"
    : domainResults.some((r) => r.risk_level === "moderate")
      ? "moderate"
      : "low"

  const profile = assessment.user_profiles as { full_name?: string; preferred_name?: string } | null
  const respondentName = profile?.preferred_name || profile?.full_name || "this profile"

  const pdfBuffer = await renderToBuffer(
    ResultsReportDocument({
      data: {
        respondentName,
        assessmentType: String(assessment.assessment_type).replace("_", " "),
        respondentType: String(assessment.respondent_type).replace("_", " "),
        completedDate: assessment.completed_at ? new Date(assessment.completed_at).toLocaleDateString() : "N/A",
        results: domainResults,
        overallRiskLevel,
      },
    }),
  )

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="neurafiki-assessment-report-${id}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  })
}
