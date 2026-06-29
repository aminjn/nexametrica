import { css } from '../lib/css'
import { VideoJobs } from '../components/VideoJobs'
import type { PageProps } from './types'

// The video library is the real job list: upload + title + persistent analysis +
// delete/reprocess. The old prototype mock (fake counts, demo grid) was removed.
export function Library({ v }: PageProps) {
  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <VideoJobs v={v} />
    </div>
  )
}
