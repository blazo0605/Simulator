// Moderation module — checks user messages before they reach the AI.
//
// Architecture: every moderator implements the Moderator interface.
// To swap providers (e.g. add an AI-based or third-party moderator),
// change the single `activeModerator` export at the bottom of this file —
// nothing else in the codebase needs to change.

import type { Mode } from '@/types/database'

export interface ModerationResult {
  allowed: boolean
  reason?: string // shown to the user when blocked
}

// The Moderator contract — any implementation must satisfy this.
export interface Moderator {
  check(message: string, mode: Mode): Promise<ModerationResult>
}

// ── Basic rule-based moderator ────────────────────────────────
// Runs entirely in-process (no API call, zero latency).
// Covers obvious harmful requests. Replace or augment as the app grows.

const MAX_LENGTH = 2000

// Patterns that are never acceptable regardless of mode.
const BLOCKED_PATTERNS: RegExp[] = [
  /\b(?:how\s+to\s+(?:make|build|synthesize|create)\s+(?:a\s+)?(?:bomb|weapon|explosive|poison|nerve\s+agent))\b/i,
  /\b(?:child|minor|underage)\s+(?:sex|porn|nude|naked|explicit)\b/i,
  /\bhow\s+to\s+(?:kill|murder|assassinate)\s+(?:a\s+)?(?:real\s+)?(?:person|someone|people)\b/i,
]

const basicModerator: Moderator = {
  async check(message: string, _mode: Mode): Promise<ModerationResult> {
    // Guard against absurdly long inputs (spam / prompt injection attempts)
    if (message.length > MAX_LENGTH) {
      return {
        allowed: false,
        reason: `Message too long (${message.length} / ${MAX_LENGTH} characters). Please shorten it.`,
      }
    }

    // Block clearly harmful content
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(message)) {
        return {
          allowed: false,
          reason: 'That message was blocked by the content filter.',
        }
      }
    }

    return { allowed: true }
  },
}

// ── Active moderator ──────────────────────────────────────────
// Swap this line to change the moderation strategy:
//   export const activeModerator: Moderator = groqModerator
//   export const activeModerator: Moderator = openAIModerator
export const activeModerator: Moderator = basicModerator
