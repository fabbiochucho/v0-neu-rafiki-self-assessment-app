import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

/**
 * @react-pdf/renderer renders this to a PDF buffer server-side (no DOM/canvas
 * involved), so it's safe to call from an API route handler. Keep this in
 * sync with the on-screen summary in app/assessment/[id]/results/page.tsx --
 * it intentionally mirrors the same risk colors/copy so the download matches
 * what the user already saw.
 */

export interface ReportDomainResult {
  domain_name: string
  total_score: number
  max_possible_score: number
  percentage_score: number
  risk_level: "low" | "moderate" | "high" | string
}

export interface ReportData {
  respondentName: string
  assessmentType: string
  respondentType: string
  completedDate: string
  results: ReportDomainResult[]
  overallRiskLevel: "low" | "moderate" | "high" | string
}

const riskColors: Record<string, string> = {
  high: "#dc2626",
  moderate: "#b45309",
  low: "#15803d",
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#1f2937" },
  header: { marginBottom: 20, borderBottom: "2 solid #e5e7eb", paddingBottom: 12 },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#6b7280" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  metaLabel: { fontSize: 9, color: "#6b7280" },
  metaValue: { fontSize: 11, fontWeight: 700 },
  sectionTitle: { fontSize: 14, fontWeight: 700, marginTop: 16, marginBottom: 8 },
  domainCard: { border: "1 solid #e5e7eb", borderRadius: 4, padding: 10, marginBottom: 10 },
  domainHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  domainName: { fontSize: 12, fontWeight: 700 },
  riskBadge: { fontSize: 9, fontWeight: 700, padding: "3 6", borderRadius: 3 },
  scoreLine: { fontSize: 10, color: "#4b5563", marginTop: 4 },
  summaryBox: { marginTop: 16, padding: 12, borderRadius: 4, border: "1 solid #e5e7eb" },
  disclaimer: { marginTop: 20, padding: 10, backgroundColor: "#fffbeb", border: "1 solid #fde68a", borderRadius: 4 },
  disclaimerText: { fontSize: 9, color: "#92400e", lineHeight: 1.4 },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, fontSize: 8, color: "#9ca3af", textAlign: "center" },
})

function riskColor(riskLevel: string) {
  return riskColors[riskLevel] || "#4b5563"
}

const overallSummaryText: Record<string, string> = {
  high: "This assessment indicates HIGH indicators across one or more domains. We strongly recommend scheduling a consultation with qualified healthcare professionals for comprehensive evaluation and personalized support planning.",
  moderate: "This assessment indicates MODERATE indicators that warrant attention. Consider follow-up evaluations and implementing targeted support strategies while monitoring for changes.",
  low: "This assessment indicates LOW indicators of concern. Continue with current support approaches and maintain regular monitoring.",
}

export function ResultsReportDocument({ data }: { data: ReportData }) {
  return (
    <Document
      title={`NeuRafiki Assessment Results - ${data.respondentName}`}
      author="NeuRafiki"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>NeuRafiki Assessment Results</Text>
          <Text style={styles.subtitle}>Screening summary for {data.respondentName}</Text>
          <View style={styles.metaRow}>
            <View>
              <Text style={styles.metaLabel}>Assessment Type</Text>
              <Text style={styles.metaValue}>{data.assessmentType}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Respondent</Text>
              <Text style={styles.metaValue}>{data.respondentType}</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Completed</Text>
              <Text style={styles.metaValue}>{data.completedDate}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Domain Results</Text>
        {data.results.map((result, i) => (
          <View key={i} style={styles.domainCard} wrap={false}>
            <View style={styles.domainHeaderRow}>
              <Text style={styles.domainName}>{result.domain_name}</Text>
              <Text style={{ ...styles.riskBadge, color: riskColor(result.risk_level), border: `1 solid ${riskColor(result.risk_level)}` }}>
                {result.risk_level.toUpperCase()} INDICATION
              </Text>
            </View>
            <Text style={styles.scoreLine}>
              Score: {result.total_score} / {result.max_possible_score} ({result.percentage_score.toFixed(1)}%)
            </Text>
          </View>
        ))}

        <View style={{ ...styles.summaryBox, borderColor: riskColor(data.overallRiskLevel) }}>
          <Text style={{ fontSize: 12, fontWeight: 700, color: riskColor(data.overallRiskLevel), marginBottom: 6 }}>
            Overall Assessment Summary
          </Text>
          <Text style={{ fontSize: 10, lineHeight: 1.4 }}>
            {overallSummaryText[data.overallRiskLevel] || overallSummaryText.low}
          </Text>
        </View>

        <View style={styles.disclaimer}>
          <Text style={{ fontSize: 10, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>Important Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            These results are for screening purposes only and do not constitute a medical diagnosis. The assessment
            is designed to identify areas that may benefit from further professional evaluation. Please consult with
            qualified healthcare professionals, psychologists, or educational specialists for comprehensive
            assessment and diagnosis. Cultural factors and individual circumstances should always be considered when
            interpreting these results.
          </Text>
        </View>

        <Text style={styles.footer} fixed>
          Generated by NeuRafiki on {new Date().toLocaleDateString()} -- confidential, for the recipient&apos;s use only.
        </Text>
      </Page>
    </Document>
  )
}
