import type { eng } from '../engine'

export type Eng = typeof eng & Record<string, any>
export type Vals = Record<string, any>

export interface PageProps {
  e: Eng
  v: Vals
}
