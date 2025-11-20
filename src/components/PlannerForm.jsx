import { useState } from 'react'

export default function PlannerForm({ onPlan }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    region: 'lebanon',
    city: '',
    wedding_date: '',
    guest_count: 150,
    style: 'luxury',
    budget: 50000,
    currency: 'USD',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'guest_count' || name === 'budget' ? Number(value) : value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to generate plan')
      const data = await res.json()
      onPlan(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Full Name</label>
          <input name="full_name" value={form.full_name} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Region</label>
          <select name="region" value={form.region} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300">
            <option value="lebanon">Lebanon</option>
            <option value="gcc">GCC</option>
            <option value="egypt">Egypt</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">City</label>
          <input name="city" value={form.city} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Wedding Date</label>
          <input name="wedding_date" value={form.wedding_date} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300" placeholder="YYYY-MM-DD" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Guests</label>
          <input type="number" name="guest_count" value={form.guest_count} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300" min={1} max={2000} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Style</label>
          <input name="style" value={form.style} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300" placeholder="classic / boho / luxury" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Budget (USD)</label>
          <input type="number" name="budget" value={form.budget} onChange={handleChange} className="mt-1 w-full rounded-lg border-slate-300" min={0} step={100} />
        </div>
      </div>
      {error && <p className="mt-3 text-rose-600 text-sm">{error}</p>}
      <div className="mt-6">
        <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 text-white font-semibold shadow-lg disabled:opacity-60">
          {loading ? 'Generating...' : 'Generate My Plan'}
        </button>
      </div>
    </form>
  )
}
