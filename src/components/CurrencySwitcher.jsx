import { useEffect, useState } from 'react'

const SYMBOL = {
  USD: 'USD', AED: 'AED', SAR: 'SAR', EGP: 'EGP', LBP: 'LBP'
}

export default function CurrencySwitcher({ planData, onCurrency }) {
  const [currency, setCurrency] = useState(planData?.plan?.currency || 'USD')

  useEffect(() => {
    setCurrency(planData?.plan?.currency || 'USD')
  }, [planData])

  const fx = planData?.plan?.fx?.rates || {}

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-slate-600">Currency</label>
      <select value={currency} onChange={(e)=>onCurrency(e.target.value)} className="rounded-lg border-slate-300">
        {Object.keys(SYMBOL).map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      {currency && fx && (
        <span className="text-xs text-slate-500">1 USD ≈ {fx[currency]} {currency}</span>
      )}
    </div>
  )
}
