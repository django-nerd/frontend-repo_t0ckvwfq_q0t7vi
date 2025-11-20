import { useEffect, useState } from 'react'

export default function VendorProfile({ vendorId, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!vendorId) return
    setLoading(true)
    fetch(`${backend}/api/vendors/${vendorId}`)
      .then(r => r.json())
      .then(setData)
      .finally(()=>setLoading(false))
  }, [vendorId])

  if (!vendorId) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden" onClick={(e)=>e.stopPropagation()}>
        {loading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <div>
            <div className="relative">
              <img src={data?.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200'} alt={data?.name} className="w-full h-56 object-cover" />
              <button onClick={onClose} className="absolute top-3 right-3 bg-white/90 border rounded-full px-3 py-1 text-sm">Close</button>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-slate-900">{data?.name}</h3>
              <p className="text-slate-600">{data?.city || data?.region} • {data?.price_tier}</p>
              <p className="mt-3 text-slate-700">{data?.description}</p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {(data?.price_converted ? Object.entries(data.price_converted) : []).map(([c, v]) => (
                  <div key={c} className="bg-rose-50 rounded-lg px-3 py-2 text-sm text-rose-700 flex items-center justify-between">
                    <span>{c}</span>
                    <span className="font-semibold">{Number(v).toLocaleString(undefined, { style: 'currency', currency: c })}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <a href="#contact" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 text-white font-semibold shadow-lg">Inquire</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
