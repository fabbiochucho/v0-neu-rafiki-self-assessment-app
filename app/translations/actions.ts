"use server"

import { revalidatePath } from "next/cache"
import { createServiceRoleClient } from "@/lib/supabase/service"
import { getTranslationReviewer } from "@/lib/auth/translation-reviewers"

// Save a reviewer's edit, and approve it when they press Approve. Drafts
// are invisible to people taking a screening; only reviewed rows are shown.
export async function saveTranslation(formData: FormData) {
  const reviewer = await getTranslationReviewer()
  if (!reviewer) return
  const questionId = String(formData.get("question_id") ?? "")
  const lang = String(formData.get("lang") ?? "")
  const text = String(formData.get("question_text") ?? "").trim()
  const approve = formData.get("intent") === "approve"
  if (!/^[0-9a-f-]{36}$/i.test(questionId) || !["fr", "pt"].includes(lang) || !text || text.length > 1000) return

  const db = createServiceRoleClient()
  const { data: existing } = await db
    .from("question_translations")
    .select("question_text, source")
    .eq("question_id", questionId)
    .eq("lang", lang)
    .maybeSingle()
  // Approving a draft unchanged keeps it marked as a machine translation.
  const source = existing && existing.question_text === text ? existing.source : "human"

  const { error } = await db
    .from("question_translations")
    .upsert(
      {
        question_id: questionId,
        lang,
        question_text: text,
        source,
        status: approve ? "reviewed" : "draft",
        reviewed_by: approve ? reviewer : null,
        reviewed_at: approve ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "question_id,lang" },
    )
  if (error) console.error("Saving translation failed:", error)
  revalidatePath("/translations")
}
