import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PlannerForm from './components/PlannerForm'
import VendorGrid from './components/VendorGrid'
import PlanSummary from './components/PlanSummary'
import AssistantChat from './components/AssistantChat'
import AuthModal from './components/AuthModal'

function App() {
  const [planData, setPlanData] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState(null)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    // Seed vendors once at start (idempotent)
    fetch(`${backend}/api/seed/vendors`, { method: 'POST' }).catch(() => {})
    // Try restore session
    const token = localStorage.getItem('token')
    if (token) {
      fetch(`${backend}/auth/me`, { headers: { Authorization: `Bearer ${token}` }})
        .then(r => r.ok ? r.json() : null)
        .then(u => { if (u) setUser(u) })
        .catch(()=>{})
    }
  }, [])

  const savePlan = async () => {
    if (!user) { setAuthOpen(true); return }
    const token = localStorage.getItem('token')
    if (!token || !planData) return
    const res = await fetch(`${backend}/api/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: planData?.plan?.region + ' plan', data: planData })
    })
    if (res.ok) {
      alert('Plan saved to your account!')
    } else {
      const err = await res.json().catch(()=>({detail:'Failed'}))
      alert(err.detail || 'Failed to save')
    }
  }

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
              <div className="mt-4 flex gap-3">
                <button onClick={savePlan} className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 text-white font-semibold shadow-lg">Save Plan</button>
                {user ? (
                  <span className="text-slate-600 text-sm self-center">Signed in as {user.email}</span>
                ) : (
                  <button onClick={()=>setAuthOpen(true)} className="text-rose-600 font-medium">Sign in</button>
                )}
              </div>
            </div>
            <div>
              <PlanSummary data={planData} />
            </div>
          </div>
        </section>

        <VendorGrid vendors={planData?.vendors} />
        <AssistantChat />

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
      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} onAuthed={({token})=>{
        fetch(`${backend}/auth/me`, { headers: { Authorization: `Bearer ${token}` }})
          .then(r=>r.json()).then(setUser).catch(()=>{})
      }} />
    </div>
  )
}

export default App
