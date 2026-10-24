import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns a copy of the object containing only the keys that have a defined value. */
export function omitUndefined<T extends object>(value: T | undefined): Partial<T> {
  return Object.fromEntries(
    Object.entries(value ?? {}).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>
}

export function dicebearUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
}

export function getInitials(name?: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("")
  return initials || "?"
}

const AVATAR_PALETTE = [
  { bg: "bg-vivid-blue/15", text: "text-vivid-blue" },
  { bg: "bg-vivid-green/15", text: "text-vivid-green" },
  { bg: "bg-vivid-yellow/15", text: "text-vivid-yellow" },
  { bg: "bg-vivid-red/15", text: "text-vivid-red" },
]

export function getAvatarPalette(seed?: string) {
  const key = seed || "?"
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
}

export function formatRelativeTime(input: unknown): string {
  if (!input) return ""
  const date = new Date(input as string | number | Date)
  if (Number.isNaN(date.getTime())) return ""

  const diffSec = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  if (diffSec < 60) return "now"

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m`

  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h`

  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay}d`

  const diffWeek = Math.floor(diffDay / 7)
  if (diffDay < 30) return `${diffWeek}w`

  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return `${diffMonth}mo`

  return `${Math.floor(diffDay / 365)}y`
}

const COMPACT_UNITS = [
  { threshold: 1e12, suffix: "t" },
  { threshold: 1e9, suffix: "b" },
  { threshold: 1e6, suffix: "m" },
  { threshold: 1e3, suffix: "k" },
]

export interface FormatCountOptions {
  /** Caps the rendered value: anything above `max` renders as "<max>+". */
  max?: number
}

function toCountNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[\s,_]/g, ""))
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

/**
 * Formats a count compactly: 1234 -> "1.2k", 1500000 -> "1.5m", 999 -> "999".
 * Values under 1000 are shown as-is, one decimal is used below ten units
 * ("1.2k") and none from ten units up ("12k").
 */
export function formatCount(value: unknown, options: FormatCountOptions = {}): string {
  const count = toCountNumber(value)
  if (count === null) return "0"

  const { max } = options
  if (max !== undefined && count > max) return `${max}+`

  const sign = count < 0 ? "-" : ""
  const abs = Math.abs(count)

  if (abs < 1000) return `${sign}${Math.round(abs)}`

  for (let i = COMPACT_UNITS.length - 1; i >= 0; i--) {
    const { threshold, suffix } = COMPACT_UNITS[i]
    const scaled = abs / threshold
    const rounded = Number(scaled.toFixed(scaled < 10 ? 1 : 0))
    // Rounding can overflow into the next unit (999_999 -> 1000k -> 1m).
    if (rounded < 1000) return `${sign}${rounded}${suffix}`
  }

  return `${sign}${Math.round(abs)}`
}
