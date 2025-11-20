import { useState } from 'react'
import VendorProfile from './VendorProfile'

export default function VendorGrid({ vendors = {}, title = 'Recommended Vendors' }) {
  const keys = Object.keys(vendors)
  const [openId, setOpenId] = useState(null)
  return (
    <section id="vendors" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <a href="#contact" className="text-rose-600 font-medium">Contact Us</a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {keys.length === 0 && (
            <div className="col-span-full text-slate-600">No vendors yet. Generate a plan to see recommendations.</div>
          )}
          {keys.map((cat) => (
            <div key={cat} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-4 shadow">
              <h3 className="font-semibold text-rose-600 mb-3 capitalize">{cat}</h3>
              <div className="space-y-3">
                {(vendors[cat] || []).map((v) => (
                  <button key={v._id} onClick={()=>setOpenId(v._id)} className="flex gap-3 text-left w-full">
                    <img src={v.images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400'} alt={v.name} className="h-16 w-16 rounded-lg object-cover border" />
                    <div>
                      <p className="font-semibold text-slate-900">{v.name}</p>
                      <p className="text-sm text-slate-600">{v.city || v.region} • {v.price_tier}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <VendorProfile vendorId={openId} onClose={()=>setOpenId(null)} />
    </section>
  )
}
