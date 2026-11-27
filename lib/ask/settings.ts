// Per-person settings for respond(): whether "Ask a clinician" is on, and the ANDA directory link.
import { isEnabled, type FeatureContext } from "@/lib/features"
import { getSiblingAppUrl } from "@/lib/federation/config"

export async function askSettings(ctx: FeatureContext): Promise<{ handoff: boolean; directoryUrl: string | null }> {
  const sibling = getSiblingAppUrl()
  return { handoff: await isEnabled("ai.ask.handoff", ctx), directoryUrl: sibling ? `${sibling}/directory` : null }
}
