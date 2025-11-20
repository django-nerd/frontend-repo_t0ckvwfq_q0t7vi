import { Menu, Sparkles } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/50 border-b border-white/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-500 to-fuchsia-600 grid place-items-center text-white shadow-lg">
            <Sparkles size={18} />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">3ersi.ai</p>
            <p className="text-xs text-slate-600">AI Wedding Planner</p>
          </div>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-700">
          <a href="#features" className="hover:text-rose-600 transition-colors">Features</a>
          <a href="#vendors" className="hover:text-rose-600 transition-colors">Vendors</a>
          <a href="#plan" className="hover:text-rose-600 transition-colors">Plan</a>
          <a href="#contact" className="hover:text-rose-600 transition-colors">Contact</a>
        </nav>
        <button className="sm:hidden p-2 rounded-lg hover:bg-white/60">
          <Menu />
        </button>
      </div>
    </header>
  )
}
