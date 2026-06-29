import { css } from '../lib/css'
import type { PageProps } from './types'
import { ManualList } from '../components/ManualList'

// Real, persistent scouting shortlist — no mock.
export function Scouting({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <ManualList
        v={v}
        collection="scouting"
        title={L('لیستِ زیرِنظر (اسکاوتینگ)', 'Scouting shortlist')}
        hint={L('بازیکنانِ زیرِنظر را وارد کن — ذخیره می‌ماند', 'enter players you track — persists')}
        fields={[
          { key: 'player', ph: L('نامِ بازیکن', 'Player name') },
          { key: 'club', ph: L('باشگاه', 'Club'), width: '170px' },
          { key: 'rating', ph: L('امتیاز', 'Rating'), type: 'select', width: '110px', options: [['A', 'A'], ['B', 'B'], ['C', 'C']] },
          { key: 'note', ph: L('یادداشت', 'Note') },
        ]}
      />
    </div>
  )
}
