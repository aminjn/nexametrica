import { css } from '../lib/css'
import { VideoJobs } from '../components/VideoJobs'
import type { PageProps } from './types'

// Real video library: upload + GPU-worker jobs + results + field calibration.
export function Library({ v }: PageProps) {
  return (
    <div style={css('max-width:1320px;margin:0 auto')}>
      <VideoJobs v={v} />
    </div>
  )
}
