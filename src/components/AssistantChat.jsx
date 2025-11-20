import { useState } from 'react'

export default function AssistantChat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'مرحباً! أخبريني بالمنطقة والميزانية والأسلوب لنقترح خطة أدق ✨' }
  ])
  const [loading, setLoading] = useState(false)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const send = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const msg = { role: 'user', content: input }
    setMessages((m) => [...m, msg])
    setInput('')
    setLoading(true)
    try {
      const payload = parseContext(input)
      const res = await fetch(`${backend}/api/assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || '...' }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'عذراً، حدث خطأ. حاولي مرة أخرى.' }])
    } finally {
      setLoading(false)
    }
  }

  function parseContext(text) {
    // Lightweight extraction of region/budget/guests/style
    const lower = text.toLowerCase()
    const region = ['lebanon','gcc','egypt'].find(r => lower.includes(r))
    const styleMatch = text.match(/style\s*:\s*([\w-]+)/i)
    const guestsMatch = text.match(/(\d+)\s*(guest|guests|ضيوف|ضيوفاً)/i)
    const budgetMatch = text.match(/(\d+[\d,\.]*)\s*(usd|aed|sar|egp|lbp)?/i)
    let budget = undefined
    let currency = 'USD'
    if (budgetMatch) {
      budget = Number(String(budgetMatch[1]).replace(/[,]/g, ''))
      if (budgetMatch[2]) currency = budgetMatch[2].toUpperCase()
    }
    return {
      message: text,
      region, style: styleMatch?.[1],
      guest_count: guestsMatch ? Number(guestsMatch[1]) : undefined,
      budget, currency
    }
  }

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow">
          <h3 className="text-xl font-bold text-slate-900 mb-4">AI Co‑Planner</h3>
          <div className="h-56 overflow-y-auto space-y-3 pr-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'assistant' ? 'text-slate-800' : 'text-slate-700 text-right'}>
                <div className={m.role === 'assistant' ? 'inline-block bg-rose-50 border border-rose-100 rounded-xl px-3 py-2' : 'inline-block bg-white border border-slate-200 rounded-xl px-3 py-2'}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="mt-4 flex gap-2">
            <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="اكتبي سؤالك... مثال: ميزانيتي 80,000 USD في دبي، ستايل كلاسيك" className="flex-1 rounded-xl border-slate-300" />
            <button disabled={loading} className="rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-5 py-2 text-white font-semibold disabled:opacity-60">{loading ? '...' : 'Send'}</button>
          </form>
        </div>
      </div>
    </section>
  )
}
