import { css } from '../lib/css'
import type { PageProps } from './types'
import { ManualList } from '../components/ManualList'

// Real, persistent nutrition plan — no mock.
export function Nutrition({ v }: PageProps) {
  const fa = v.lang === 'fa'
  const L = (f: string, en: string) => (fa ? f : en)
  return (
    <div style={css('max-width:1340px;margin:0 auto')}>
      <ManualList
        v={v}
        collection="nutrition"
        title={L('برنامه‌ی تغذیه', 'Nutrition plan')}
        hint={L('برای هر بازیکن (گرم)', 'per player (grams)')}
        fields={[
          { key: 'player', ph: L('بازیکن', 'Player') },
          { key: 'protein', ph: L('پروتئین (g)', 'Protein (g)'), digits: true, width: '120px' },
          { key: 'carbs', ph: L('کربوهیدرات (g)', 'Carbs (g)'), digits: true, width: '120px' },
          { key: 'fat', ph: L('چربی (g)', 'Fat (g)'), digits: true, width: '110px' },
        ]}
      />
    </div>
  )
}
