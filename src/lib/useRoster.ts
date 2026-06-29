// Read the saved roster and expose a jersey-number → player-name map, so analysis
// pages can show real names next to detected shirt numbers.
import { useEffect, useState } from 'react'
import { getData } from '../api'

export type RosterPlayer = {
  id: string; number: string; name: string; position: string
  height?: string; weight?: string                 // cm / kg
  thigh?: string; calf?: string; chest?: string; arm?: string  // body measurements (cm)
}

export function useRoster(): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>({})
  useEffect(() => {
    getData<RosterPlayer[]>('roster')
      .then((r) => {
        if (Array.isArray(r)) {
          setMap(Object.fromEntries(
            r.filter((p) => p.number && p.name).map((p) => [String(p.number), p.name]),
          ))
        }
      })
      .catch(() => {})
  }, [])
  return map
}

// Compute body-mass index from height (cm) + weight (kg), or null if missing.
export function bmiOf(p?: { height?: string; weight?: string }): number | null {
  if (!p) return null
  const h = Number(p.height), w = Number(p.weight)
  if (!h || !w) return null
  return Math.round((w / (h / 100) ** 2) * 10) / 10
}
export function bmiColor(b: number): string {
  return b < 18.5 ? 'var(--ai)' : b < 25 ? 'var(--good)' : b < 30 ? 'var(--warn)' : 'var(--dng)'
}

// Full jersey-number → RosterPlayer map, so analysis pages can show the body
// profile (BMI / measurements) next to each detected shirt number.
export function useRosterFull(): Record<string, RosterPlayer> {
  const [map, setMap] = useState<Record<string, RosterPlayer>>({})
  useEffect(() => {
    getData<RosterPlayer[]>('roster')
      .then((r) => {
        if (Array.isArray(r)) {
          setMap(Object.fromEntries(
            r.filter((p) => p.number).map((p) => [String(p.number), p]),
          ))
        }
      })
      .catch(() => {})
  }, [])
  return map
}
