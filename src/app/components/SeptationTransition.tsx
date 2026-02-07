import { Scissors, Layers } from "lucide-react";

export function SeptationTransition() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Icon */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-32 h-32 mx-auto bg-slate-800/50 rounded-3xl border-2 border-blue-500/50 flex items-center justify-center shadow-2xl">
            <Scissors className="w-16 h-16 text-blue-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <Layers className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-medium">Next Step</span>
          </div>

          <h1 className="text-5xl text-slate-100 mb-6 leading-tight font-bold">
            Now We're Ready to<br />
            <span className="text-blue-400">
              Cross-Section the Heart
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            You've learned the external anatomy of the Week 5 heart. Now we'll examine the interior to understand how the atrial septum develops through six critical stages.
          </p>

          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-400">1-2</span>
              </div>
              <p className="text-sm text-slate-300 font-medium">Septum Primum & Ostium Primum</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-emerald-400">3-4</span>
              </div>
              <p className="text-sm text-slate-300 font-medium">Ostium Secundum & Closure</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-400">5-6</span>
              </div>
              <p className="text-sm text-slate-300 font-medium">Septum Secundum & Foramen Ovale</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
