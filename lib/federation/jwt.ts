// Cross-app federation JWTs, signed/verified with EdDSA (Ed25519) via `jose`.
//
// Two kinds of tokens:
//
//   1. Link tokens (5 min expiry) -- the one-time "prove who I am, here's
//      what I'm requesting" handshake used when a user clicks "Connect
//      account" in either app. The issuing app signs one with its own
//      private key; the receiving app verifies it with the issuer's public
//      key before showing a consent screen.
//
//   2. Request tokens (2 min expiry) -- used when Alliance wants to *pull*
//      data from Neu Rafiki on behalf of an already-linked account. Only
//      Alliance mints these (Neu Rafiki never pulls data from Alliance in
//      this phase), so this repo only implements verification.
//
// This module (lib/federation/jwt.ts) is server-only.

import { SignJWT, jwtVerify } from "jose"
import { getOwnPrivateKey, getSiblingPublicKey } from "@/lib/federation/keys"
import { SIBLING_APP_ID } from "@/lib/federation/config"

export interface LinkTokenPayload {
  iss: "alliance" | "neurafiki"
  sub: string // issuing app's local user id (uuid)
  email: string // issuing user's email -- shown on the consent screen so the user can confirm it's them
  scopes: string[] // e.g. ["assessment_sync", "directory_read"]
}

/** Signs a link token as THIS app (Neu Rafiki), for the sibling app to verify. */
export async function signLinkToken(payload: LinkTokenPayload): Promise<string> {
  const key = await getOwnPrivateKey()
  return new SignJWT({ email: payload.email, scopes: payload.scopes })
    .setProtectedHeader({ alg: "EdDSA" })
    .setIssuer(payload.iss)
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(key)
}

/**
 * Verifies a link token that THE SIBLING issued (i.e. this function is called
 * by the app RECEIVING a /connect?token=... redirect, to verify the other
 * app's signature using the sibling's public key).
 */
export async function verifySiblingLinkToken(token: string): Promise<LinkTokenPayload> {
  const key = await getSiblingPublicKey()
  const { payload } = await jwtVerify(token, key, { issuer: SIBLING_APP_ID })
  return {
    iss: payload.iss as "alliance" | "neurafiki",
    sub: payload.sub as string,
    email: payload.email as string,
    scopes: payload.scopes as string[],
  }
}

export interface RequestTokenPayload {
  iss: "alliance"
  requesting_user_id: string // Alliance's local user id making the request
  target_remote_user_id: string // Neu Rafiki's local user id whose data is being requested (from Alliance's linked_accounts row)
  scope: string // single scope this request needs, e.g. "assessment_sync"
}

/**
 * Signs a request token as THIS app, for calls Neu Rafiki makes to ANDA
 * (POST check-in-summary, GET entitlements). Same claims and 2-minute expiry
 * as ANDA's own signRequestToken, with iss "neurafiki"; ANDA verifies it with
 * Neu Rafiki's public key.
 */
export async function signRequestToken(payload: {
  requesting_user_id: string // Neu Rafiki user id
  target_remote_user_id: string // ANDA user id from linked_accounts.remote_user_id
  scope: string
}): Promise<string> {
  const key = await getOwnPrivateKey()
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "EdDSA" })
    .setIssuer("neurafiki")
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(key)
}

/** Verifies a request token that Alliance issued, using Alliance's public key. */
export async function verifyAllianceRequestToken(token: string): Promise<RequestTokenPayload> {
  const key = await getSiblingPublicKey() // Alliance's public key
  const { payload } = await jwtVerify(token, key, { issuer: "alliance" })
  return {
    iss: "alliance",
    requesting_user_id: payload.requesting_user_id as string,
    target_remote_user_id: payload.target_remote_user_id as string,
    scope: payload.scope as string,
  }
}
