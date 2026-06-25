import { useEffect, useState } from 'react'
import { css } from './lib/css'
import { useVals } from './lib/useEng'
import { useIsMobile } from './lib/useIsMobile'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { AIPanel } from './components/AIPanel'
import { Modal } from './components/Modal'
import { PAGES, Placeholder } from './pages/registry'

export function App() {
  const { e, v } = useVals()
  const isMobile = useIsMobile()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dir = v.dir
    document.documentElement.lang = v.lang
  }, [v.dir, v.lang])

  // close the mobile drawer whenever the page changes or we leave mobile
  useEffect(() => {
    setNavOpen(false)
  }, [v.page, isMobile])

  const Page = PAGES[v.page] ?? Placeholder
  const props = { e, v }
  const ui = { isMobile, navOpen, setNavOpen }

  return (
    <div
      dir={v.dir}
      style={css('min-height:100vh;display:flex;font-size:14px;line-height:1.6;position:relative')}
    >
      <Sidebar {...props} ui={ui} />
      <div
        style={css('flex:1;min-width:0;display:flex;flex-direction:column;height:100vh;overflow:hidden')}
      >
        <Topbar {...props} ui={ui} />
        <main
          style={css(
            isMobile
              ? 'flex:1;overflow-y:auto;padding:16px 14px 64px'
              : 'flex:1;overflow-y:auto;padding:24px 26px 60px',
          )}
        >
          <Page {...props} />
        </main>
      </div>
      <AIPanel {...props} />
      <Modal {...props} />
    </div>
  )
}
