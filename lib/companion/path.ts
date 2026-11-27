import type { CompanionMode } from "@/lib/companion/prompts"

/** legacy = today's companion (ai.ask off); clarify = wording help only; verified = approved answers first. */
export function companionPath(mode: CompanionMode, askOn: boolean): "legacy" | "clarify" | "verified" {
  if (!askOn) return "legacy"
  return mode === "during" ? "clarify" : "verified"
}
