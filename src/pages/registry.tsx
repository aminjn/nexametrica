import { css } from '../lib/css'
import type { PageProps } from './types'

import { Dashboard } from './Dashboard'
import { Library } from './Library'
import { GameCloud } from './GameCloud'
import { Model } from './Model'
import { Player } from './Player'
import { Coding } from './Coding'
import { Matrix } from './Matrix'
import { DataInt } from './DataInt'
import { Telestration } from './Telestration'
import { Tactical } from './Tactical'
import { Physical } from './Physical'
import { Profile } from './Profile'
import { Scouting } from './Scouting'
import { LeagueDB } from './LeagueDB'
import { Transfer } from './Transfer'
import { Schedule } from './Schedule'
import { Training } from './Training'
import { Nutrition } from './Nutrition'
import { Reports } from './Reports'
import { Clips } from './Clips'
import { Sharing } from './Sharing'
import { Assistant } from './Assistant'
import { Settings } from './Settings'
import { Sysadmin } from './Sysadmin'

export const PAGES: Record<string, (p: PageProps) => JSX.Element> = {
  dashboard: Dashboard,
  library: Library,
  gamecloud: GameCloud,
  model: Model,
  player: Player,
  coding: Coding,
  matrix: Matrix,
  dataint: DataInt,
  telestration: Telestration,
  tactical: Tactical,
  physical: Physical,
  profile: Profile,
  scouting: Scouting,
  leaguedb: LeagueDB,
  transfer: Transfer,
  schedule: Schedule,
  training: Training,
  nutrition: Nutrition,
  reports: Reports,
  clips: Clips,
  sharing: Sharing,
  assistant: Assistant,
  settings: Settings,
  sysadmin: Sysadmin,
}

export function Placeholder({ v }: PageProps) {
  return (
    <div style={css('max-width:1320px;margin:0 auto;padding-top:40px;text-align:center')}>
      <div style={css('font-size:18px;font-weight:800;margin-bottom:8px')}>{v.pageTitle}</div>
      <div style={css('font-size:13px;color:var(--mut)')}>{v.pageSub}</div>
    </div>
  )
}
