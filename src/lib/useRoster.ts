// Read the saved roster and expose a jersey-number → player-name map, so analysis
// pages can show real names next to detected shirt numbers.
import { useEffect, useState } from 'react'
import { getData } from '../api'

export type RosterPlayer = { id: string; number: string; name: string; position: string }

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
