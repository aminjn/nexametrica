// Connects the assistant UI to the real LLM backend by overriding the engine's
// canned askAi(). Keeps everything else (renderVals, sendAi, quick questions)
// untouched. If the backend/LLM is unavailable, it falls back to the engine's
// built-in answer so the live site never breaks.
import { eng } from './engine'
import { assistantChat } from './api'

const e = eng as unknown as {
  state: any
  setState: (u: any, cb?: () => void) => void
  aiAnswer: (q: string) => string
  askAi: (q: string) => void
}

function replaceLastAi(text: string) {
  e.setState((s: any) => {
    const thread = [...s.thread]
    for (let i = thread.length - 1; i >= 0; i--) {
      if (thread[i].role === 'ai') {
        thread[i] = { role: 'ai', text }
        break
      }
    }
    return { thread }
  })
}

e.askAi = (q: string) => {
  const lang = e.state.lang
  const persona = e.state.persona
  const history = (e.state.thread || []).slice(-8)
  // optimistic: show the question + a typing placeholder, open the panel
  e.setState((s: any) => ({
    thread: [...s.thread, { role: 'user', text: q }, { role: 'ai', text: '…' }],
    aiInput: '',
    ai: true,
  }))
  assistantChat(q, history, persona, lang)
    .then((text) => replaceLastAi(text))
    .catch(() => replaceLastAi(e.aiAnswer(q)))
}
