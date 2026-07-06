// Parses the Ed25519 keypair used to sign/verify cross-app federation JWTs
// out of their `\n`-escaped env var form (the standard pattern for storing
// PEM-formatted keys in a single-line env var) and imports them as `jose`
// KeyLike objects for the EdDSA algorithm.
//
// FEDERATION_PRIVATE_KEY belongs to THIS app (Neu Rafiki) and is used to sign
// tokens this app issues. FEDERATION_ALLIANCE_PUBLIC_KEY belongs to the
// sibling Alliance app and is used to verify tokens Alliance issued.
//
// Both are server-only -- never prefix with NEXT_PUBLIC_, never import this
// module from a Client Component.

import { importPKCS8, importSPKI } from "jose"

function unescapePem(value: string): string {
  return value.replace(/\\n/g, "\n")
}

export async function getOwnPrivateKey() {
  const raw = process.env.FEDERATION_PRIVATE_KEY
  if (!raw) throw new Error("FEDERATION_PRIVATE_KEY is not configured")
  return importPKCS8(unescapePem(raw), "EdDSA")
}

export async function getSiblingPublicKey() {
  const raw = process.env.FEDERATION_ALLIANCE_PUBLIC_KEY
  if (!raw) throw new Error("FEDERATION_ALLIANCE_PUBLIC_KEY is not configured")
  return importSPKI(unescapePem(raw), "EdDSA")
}
