import { css } from '../lib/css'
import type { PageProps } from './types'
import { ManualList } from '../components/ManualList'

// Real, persistent transfer targets — no mock.
export function Transfer({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <ManualList
        v={v}
        collection="transfer"
        title={L('اهدافِ نقل‌وانتقال', 'Transfer targets')}
        hint={L('بازیکنانِ هدف را وارد کن — ذخیره می‌ماند', 'enter targets — persists')}
        fields={[
          { key: 'player', ph: L('نامِ بازیکن', 'Player name') },
          { key: 'club', ph: L('باشگاه', 'Club'), width: '170px' },
          { key: 'value', ph: L('ارزش/قیمت', 'Value'), width: '130px' },
          { key: 'note', ph: L('وضعیت/یادداشت', 'Status / note') },
        ]}
      />
    </div>
  )
}
