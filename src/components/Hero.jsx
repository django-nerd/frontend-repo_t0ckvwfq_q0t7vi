import { motion } from 'framer-motion'

export default function Hero({ onStart }) {
  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(90%_60%_at_20%_0%,rgba(244,63,94,0.25),transparent),radial-gradient(60%_60%_at_90%_10%,rgba(168,85,247,0.25),transparent)]" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900"
            >
              Your Luxury Wedding, Crafted for the Arab World
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-4 text-lg text-slate-700"
            >
              3ersi.ai blends local traditions with AI precision to plan unforgettable celebrations across Lebanon, GCC and Egypt.
            </motion.p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button onClick={onStart} className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-rose-500/30 transition">
                Get Your Free AI Plan
              </button>
              <a href="#vendors" className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-slate-300 text-slate-800 font-semibold hover:bg-white/60">
                Explore Vendors
              </a>
            </div>
            <p className="mt-4 text-slate-600 text-sm">Arabic, English and French friendly • Built for regional budgets and customs</p>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 h-40 w-40 bg-rose-200/60 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-fuchsia-200/60 blur-3xl rounded-full" />
            <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6">
              <div className="grid grid-cols-3 gap-3">
                {['Venue','Zaffe','Florals','Photography','DJ','Makeup'].map((t, i) => (
                  <div key={t} className="aspect-square rounded-2xl bg-gradient-to-br from-rose-50 to-fuchsia-50 border border-white/60 grid place-items-center text-sm font-semibold text-rose-700">
                    {t}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-slate-600 text-sm">Smart recommendations by region, style and budget</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
