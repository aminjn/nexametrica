// Load + persist a manual-entry collection (roster, schedule, …). Returns the
// rows, a setter that also saves to the server, and load state.
import { useEffect, useRef, useState } from 'react'
import { getData, saveData } from '../api'

export function useCollection<T>(key: string, initial: T[]) {
  const [rows, setRows] = useState<T[]>(initial)
  const [loaded, setLoaded] = useState(false)
  const dirty = useRef(false)

  useEffect(() => {
    getData<T[]>(key)
      .then((v) => { if (Array.isArray(v)) setRows(v) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [key])

  function update(next: T[]) {
    setRows(next)
    dirty.current = true
    saveData(key, next).catch(() => {})
  }
  return { rows, update, loaded }
}
