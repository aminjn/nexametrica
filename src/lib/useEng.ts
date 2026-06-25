import { useEffect, useReducer } from 'react'
import { eng } from '../engine'

// Subscribe a component to the Engine: any eng.setState() re-renders subscribers,
// mirroring how the dc-runtime re-rendered on logic state changes.
export function useEng() {
  const [, force] = useReducer((x: number) => x + 1, 0)
  useEffect(() => eng.subscribe(force as () => void), [])
  return eng
}

// Convenience: the engine instance and the computed render bindings together.
export function useVals() {
  const e = useEng()
  return { e, v: e.renderVals() as Record<string, any> }
}
