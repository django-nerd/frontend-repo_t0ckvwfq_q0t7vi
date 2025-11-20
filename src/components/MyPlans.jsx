import { useEffect, useState } from 'react'

export default function MyPlans({ open, onClose, onOpenPlan, backendBase }) {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const backend = backendBase || import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const loadPlans = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/plans`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setPlans(data)
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) loadPlans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const startRename = (plan) => {
    setEditingId(plan.id)
    setEditTitle(plan.title)
  }

  const saveRename = async (plan) => {
    if (!token) return
    const res = await fetch(`${backend}/api/plans/${plan.id}` , {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: editTitle, data: plan.data })
    })
    if (res.ok) {
      setEditingId(null)
      await loadPlans()
    }
  }

  const deletePlan = async (plan) => {
    if (!token) return
    if (!confirm('Delete this plan?')) return
    const res = await fetch(`${backend}/api/plans/${plan.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      setPlans(plans.filter(p => p.id !== plan.id))
    }
  }

  const openPlan = async (plan) => {
    if (onOpenPlan) onOpenPlan(plan)
    if (onClose) onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[92vw] max-w-3xl max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">My Plans</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
        <div className="p-5 overflow-auto max-h-[70vh]">
          {loading ? (
            <div className="text-slate-600">Loading...</div>
          ) : plans.length === 0 ? (
            <div className="text-slate-600">No saved plans yet.</div>
          ) : (
            <ul className="space-y-3">
              {plans.map((plan) => (
                <li key={plan.id} className="border rounded-xl p-4 bg-slate-50/60">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      {editingId === plan.id ? (
                        <input
                          className="w-full sm:w-64 border rounded-lg px-3 py-2"
                          value={editTitle}
                          onChange={(e)=>setEditTitle(e.target.value)}
                        />
                      ) : (
                        <div className="font-semibold text-slate-900 truncate">{plan.title || 'Untitled plan'}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {editingId === plan.id ? (
                        <>
                          <button onClick={()=>saveRename(plan)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm">Save</button>
                          <button onClick={()=>setEditingId(null)} className="px-3 py-2 rounded-lg border text-sm">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>openPlan(plan.data)} className="px-3 py-2 rounded-lg bg-rose-600 text-white text-sm">Open</button>
                          <button onClick={()=>startRename(plan)} className="px-3 py-2 rounded-lg border text-sm">Rename</button>
                          <button onClick={()=>deletePlan(plan)} className="px-3 py-2 rounded-lg border border-rose-200 text-rose-600 text-sm">Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                </li)
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
