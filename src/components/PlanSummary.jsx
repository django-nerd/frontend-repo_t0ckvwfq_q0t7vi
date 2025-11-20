import { useEffect, useMemo, useState } from 'react'
import CurrencySwitcher from './CurrencySwitcher'

export default function PlanSummary({ data }) {
  const [currency, setCurrency] = useState(data?.plan?.currency || 'USD')
  useEffect(()=>{ setCurrency(data?.plan?.currency || 'USD') }, [data])
  if (!data) return null
  const { plan, budget } = data

  const converted = useMemo(()=>{
    const fx = plan?.fx?.rates || {}
    const from = plan?.currency || 'USD'
    const out = (budget||[]).map((b)=>{
      // incoming budget amounts already in plan currency; re-convert using fx
      const usd = from === 'USD' ? b.amount : (b.amount / (fx[from]||1))
      const val = currency === 'USD' ? usd : (usd * (fx[currency]||1))
      return { ...b, amount: Math.round(val*100)/100 }
    })
    const totalUsd = from === 'USD' ? (plan?.total_budget||0) : ((plan?.total_budget||0) / (fx[from]||1))
    const totalOut = currency === 'USD' ? totalUsd : (totalUsd * (fx[currency]||1))
    return { items: out, total: Math.round(totalOut*100)/100 }
  }, [budget, plan, currency])

  return (
    <section id="plan" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-900">Budget & Timeline</h3>
          <CurrencySwitcher planData={data} onCurrency={setCurrency} />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Smart Timeline (Arabic)</h4>
            <ol className="space-y-2 list-decimal list-inside text-slate-700">
              {(plan?.timeline || []).map((t, i) => (
                <li key={i} className="">
                  <span className="font-medium">{t.label}</span>
                  <span className="text-slate-500"> • قبل {t.due_months_before} أشهر</span>
                  {t.optional && <span className="ml-2 text-xs text-rose-600">اختياري</span>}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Budget Breakdown</h4>
            <div className="space-y-2">
              {converted.items.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-slate-700">
                  <span className="capitalize">{b.category}</span>
                  <span className="font-semibold">{b.amount.toLocaleString(undefined, { style: 'currency', currency })}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex items-center justify-between font-bold">
                <span>Total</span>
                <span>{converted.total.toLocaleString(undefined, { style: 'currency', currency })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
