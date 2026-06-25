// Bottom install bar for the PWA. Shows a native "Install" button when the
// browser fires `beforeinstallprompt` (Android/desktop Chrome), or iOS Safari
// "Add to Home Screen" instructions otherwise. Hidden when already installed
// or recently dismissed.
import { useEffect, useState } from 'react'
import { css } from '../lib/css'

const DISMISS_KEY = 'nx_pwa_dismissed'
const DISMISS_DAYS = 7

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}
function recentlyDismissed() {
  const t = Number(localStorage.getItem(DISMISS_KEY) || 0)
  return t && Date.now() - t < DISMISS_DAYS * 864e5
}
function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function InstallBar({ v }: { v: Record<string, any> }) {
  const fa = v.lang === 'fa'
  const L = (f: string, e: string) => (fa ? f : e)

  const [deferred, setDeferred] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [iosHelp, setIosHelp] = useState(false)

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return

    const onPrompt = (e: any) => {
      e.preventDefault()
      setDeferred(e)
      setShow(true)
    }
    const onInstalled = () => {
      setShow(false)
      setDeferred(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    // iOS Safari never fires beforeinstallprompt → show the manual hint.
    if (isIos()) setShow(true)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!show) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setShow(false)
  }
  async function install() {
    if (deferred) {
      deferred.prompt()
      try {
        await deferred.userChoice
      } catch {
        /* ignore */
      }
      setDeferred(null)
      setShow(false)
    } else if (isIos()) {
      setIosHelp((s) => !s)
    }
  }

  return (
    <div
      style={css(
        'position:fixed;inset-inline:0;bottom:0;z-index:55;display:flex;justify-content:center;padding:10px 12px;padding-bottom:calc(10px + env(safe-area-inset-bottom))',
      )}
    >
      <div
        style={css(
          'width:100%;max-width:560px;background:var(--card2);border:1px solid var(--bd2);border-radius:14px;box-shadow:0 14px 40px rgba(0,0,0,.5);padding:12px 14px',
        )}
      >
        <div style={css('display:flex;align-items:center;gap:12px')}>
          <div
            style={css(
              'width:40px;height:40px;border-radius:11px;background:var(--ac);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 14px rgba(163,230,53,.25)',
            )}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2 4 6v6c0 4.4 3.4 8.5 8 10 4.6-1.5 8-5.6 8-10V6l-8-4Z" fill="#0d0f12" />
              <path d="M12 7v10M7.5 9.5l9 5M16.5 9.5l-9 5" stroke="#a3e635" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <div style={css('flex:1;min-width:0')}>
            <div style={css('font-size:13.5px;font-weight:800')}>
              {L('نکسا متریکا را نصب کن', 'Install Nexa Metrica')}
            </div>
            <div style={css('font-size:11.5px;color:var(--sub);line-height:1.5')}>
              {L('مثل یک اپ، روی صفحه‌ی اصلی گوشی‌ات', 'Like an app, on your home screen')}
            </div>
          </div>
          <button
            onClick={install}
            style={css(
              'height:38px;padding:0 18px;background:var(--ac);border:none;border-radius:10px;color:#0d0f12;font-family:inherit;font-size:13px;font-weight:800;cursor:pointer;flex-shrink:0',
            )}
          >
            {L('نصب', 'Install')}
          </button>
          <button
            onClick={dismiss}
            aria-label="close"
            style={css(
              'width:32px;height:32px;border-radius:8px;background:var(--card);border:1px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--sub);flex-shrink:0',
            )}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* iOS manual instructions */}
        {(iosHelp || (isIos() && !deferred)) && isIos() ? (
          <div
            style={css(
              'margin-top:10px;padding:10px 12px;background:var(--bg2);border:1px solid var(--bd);border-radius:10px;font-size:11.5px;color:var(--sub);line-height:1.8',
            )}
          >
            {L('در Safari: دکمه‌ی ', 'In Safari: tap the ')}
            <span style={css('color:var(--ai);font-weight:700')}>{L('اشتراک‌گذاری', 'Share')}</span>
            {L(' (مربع با فلش رو به بالا) را بزن، بعد «', ' button (square with up arrow), then choose “')}
            <span style={css('color:var(--tx);font-weight:700')}>
              {L('افزودن به صفحه اصلی', 'Add to Home Screen')}
            </span>
            {L('» را انتخاب کن.', '”.')}
          </div>
        ) : null}
      </div>
    </div>
  )
}
