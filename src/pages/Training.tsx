import { css } from '../lib/css'
import type { PageProps } from './types'
import { ManualList } from '../components/ManualList'

// Real, persistent training plan — no mock.
export function Training({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  return (
    <div style={css('max-width:1340px;margin:0 auto')}>
      <ManualList
        v={v}
        collection="training"
        title={L('برنامه‌ی تمرینی', 'Training plan')}
        hint={L('جلسات را وارد کن — ذخیره می‌ماند', 'enter sessions — persists')}
        fields={[
          { key: 'date', ph: L('تاریخ', 'Date'), type: 'date', width: '150px' },
          { key: 'focus', ph: L('تمرکز (مثلاً فاز دفاعی)', 'Focus (e.g. defending)') },
          { key: 'drill', ph: L('تمرین', 'Drill') },
          { key: 'load', ph: L('بار', 'Load'), type: 'select', width: '120px', options: [['low', L('کم', 'Low')], ['med', L('متوسط', 'Medium')], ['high', L('زیاد', 'High')]] },
        ]}
      />
    </div>
  )
}
