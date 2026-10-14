// Safety checks around the AI companion. Both run on the server.
//
// 1. Crisis pre-check: runs BEFORE any model call. A match skips the model
//    entirely and returns a fixed message pointing to human help.
//    ponytail: keyword/regex screen, so it will miss oblique phrasing and
//    can over-trigger. It errs toward routing to help. Pair with clinical
//    review of the patterns and the message.
// 2. Output guard: replaces a reply that states a diagnosis ("you are
//    autistic", "you have ADHD") with careful wording.

const CRISIS_PATTERNS: RegExp[] = [
  /\b(kill|hurt|harm|cut)\s+(myself|herself|himself|themselves|my ?self)\b/i,
  /\bsuicid(e|al)\b/i,
  /\b(end|take)\s+(my|his|her|their)\s+(own\s+)?life\b/i,
  /\bwant(s|ed)?\s+to\s+die\b/i,
  /\bdon'?t\s+want\s+to\s+(be\s+alive|live|exist)\b/i,
  /\bself[-\s]?harm/i,
  /\boverdose\b/i,
  /\bno\s+reason\s+to\s+live\b/i,
  /\bbetter\s+off\s+dead\b/i,
  /\b(being|is|am|was)\s+(abused|hit|beaten)\b/i,
]

export function isCrisisMessage(text: string): boolean {
  return CRISIS_PATTERNS.some((p) => p.test(text))
}

export const CRISIS_REPLY =
  "It sounds like things may be really hard right now, and you deserve support from a person. " +
  "If you or someone else is in immediate danger, please contact your local emergency services now. " +
  "You can find free, confidential helplines in your country at https://findahelpline.com. " +
  "If you can, reach out to someone you trust and let them know how you're feeling."

const DIAGNOSTIC_CLAIM =
  /\b(you|they|he|she|your child)\s+(are|is|has|have)\s+(definitely\s+|clearly\s+|probably\s+)?(autistic|dyslexic|dyspraxic|adhd|autism|dyslexia|dyspraxia)\b/i

export function containsDiagnosticClaim(text: string): boolean {
  return DIAGNOSTIC_CLAIM.test(text)
}

export const DIAGNOSTIC_FALLBACK =
  "I can't say whether anyone has a particular condition. This screening does not establish a diagnosis. " +
  "Your responses can indicate elevated traits in areas commonly associated with some conditions, and a " +
  "qualified professional can help you understand what they mean for you."
