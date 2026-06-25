import { useEffect, useState } from 'react'

// True on phone-sized viewports. Drives the off-canvas sidebar / condensed topbar.
export function useIsMobile(breakpoint = 820) {
  const [m, setM] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [breakpoint])
  return m
}
