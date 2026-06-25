import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/vazirmatn'
import './theme.css'
import { App } from './App'
import { eng } from './engine'
import './aiWire'

// Dev-only: expose the engine for smoke tests / debugging. Tree-shaken in prod.
if (import.meta.env.DEV) {
  ;(window as unknown as { __eng: typeof eng }).__eng = eng
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
