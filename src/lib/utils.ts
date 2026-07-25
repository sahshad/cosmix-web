import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  if (diffWeek < 4) return `${diffWeek}w`

  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return `${diffMonth}mo`

  return `${Math.floor(diffDay / 365)}y`
}
