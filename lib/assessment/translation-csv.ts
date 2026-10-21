export interface CsvRow {
  key: string
  en: string
  fr: string
  fr_status: string
  pt: string
  pt_status: string
}

/** RFC 4180 CSV with a UTF-8 BOM so spreadsheets show accents correctly. */
export function translationsCsv(rows: CsvRow[]): string {
  const cell = (v: string) => `"${v.replace(/"/g, '""')}"`
  const header = ["key", "english", "french", "french_status", "portuguese", "portuguese_status", "french_corrected", "portuguese_corrected"]
  const lines = [header.join(",")]
  for (const r of rows) lines.push([r.key, r.en, r.fr, r.fr_status, r.pt, r.pt_status, "", ""].map(cell).join(","))
  return "﻿" + lines.join("\r\n") + "\r\n"
}
