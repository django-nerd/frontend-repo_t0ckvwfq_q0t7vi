import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PlannerForm from './components/PlannerForm'
import VendorGrid from './components/VendorGrid'
import PlanSummary from './components/PlanSummary'

function App() {
  const [planData, setPlanData] = useState(null)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    // Seed vendors once at start (idempotent)
    fetch(`${backend}/api/seed/vendors`, { method: 'POST' }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-fuchsia-50 to-rose-100">
      <Navbar />
      <main>
        <Hero onStart={() => {
          const el = document.getElementById('planner')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }} />

        <section id="planner" className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Tell us about your dream wedding</h2>
              <p className="text-slate-700 mb-6">We’ll tailor a regional plan with an Arabic timeline, budget split and curated vendors.</p>
              <PlannerForm onPlan={(data) => setPlanData(data)} />
            </div>
            <div>
              <PlanSummary data={planData} />
            </div>
          </div>
        </section>

        <VendorGrid vendors={planData?.vendors} />

        <section id="contact" className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">White‑glove concierge</h3>
                <p className="text-slate-700">Our team can negotiate packages with top venues and vendors across Lebanon, GCC and Egypt.</p>
              </div>
              <a href="/test" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 text-white font-semibold shadow-lg text-center">Check Backend Status</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
