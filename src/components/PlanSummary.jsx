export default function PlanSummary({ data }) {
  if (!data) return null
  const { plan, budget } = data
  const total = plan?.total_budget || 0

  return (
    <section id="plan" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Smart Timeline (Arabic)</h3>
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
            <h3 className="text-xl font-bold text-slate-900 mb-4">Budget Breakdown</h3>
            <div className="space-y-2">
              {budget?.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-slate-700">
                  <span className="capitalize">{b.category}</span>
                  <span className="font-semibold">{b.amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex items-center justify-between font-bold">
                <span>Total</span>
                <span>{total.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
