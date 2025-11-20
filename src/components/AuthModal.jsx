import { useEffect, useState } from 'react'

export default function AuthModal({ open, onClose, onAuthed }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(()=>{ if(!open){ setError(''); setLoading(false);} },[open])

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        const r = await fetch(`${backend}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, password: form.password, full_name: form.full_name }) })
        if (!r.ok) throw new Error((await r.json()).detail || 'Failed to register')
      }
      const res = await fetch(`${backend}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, password: form.password }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      localStorage.setItem('token', data.access_token)
      onAuthed && onAuthed({ token: data.access_token })
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden" onClick={(e)=>e.stopPropagation()}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">{mode === 'login' ? 'Sign In' : 'Create Account'}</h3>
            <button onClick={onClose} className="text-slate-500">✕</button>
          </div>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input value={form.full_name} onChange={(e)=>setForm(v=>({ ...v, full_name: e.target.value }))} className="mt-1 w-full rounded-lg border-slate-300" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={form.email} onChange={(e)=>setForm(v=>({ ...v, email: e.target.value }))} className="mt-1 w-full rounded-lg border-slate-300" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" value={form.password} onChange={(e)=>setForm(v=>({ ...v, password: e.target.value }))} className="mt-1 w-full rounded-lg border-slate-300" required />
          </div>
          {error && <p className="text-rose-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 text-white font-semibold disabled:opacity-60">{loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}</button>
          <p className="text-sm text-slate-600 text-center">
            {mode === 'login' ? (
              <>Don’t have an account? <button type="button" onClick={()=>setMode('register')} className="text-rose-600">Sign up</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={()=>setMode('login')} className="text-rose-600">Sign in</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}
