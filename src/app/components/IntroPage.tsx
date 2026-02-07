import { Button } from "@/app/components/ui/button";
import { Heart, Microscope, BookOpen, ArrowRight, Activity, Brain } from "lucide-react";

interface IntroPageProps {
  onBeginClick?: () => void;
}

export function IntroPage({ onBeginClick }: IntroPageProps) {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-slate-800/60 backdrop-blur-sm px-6 py-3 rounded-full mb-8 shadow-lg border border-slate-700/50">
            <Heart className="w-6 h-6 text-blue-400" />
            <span className="text-slate-300 font-medium">Educational Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl mb-6 tracking-tight font-bold">
            <span className="block text-slate-100">EAST</span>
            <span className="block text-slate-400 text-3xl md:text-4xl mt-2 font-normal">
              Embryology Across Space and Time
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            An interactive journey through atrial septal defect embryology, hemodynamics, and clinical presentation for medical students.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300">
            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 border border-slate-600/50">
              <Heart className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl text-slate-100 mb-3 font-semibold">Interactive 3D Development</h3>
            <p className="text-slate-400 leading-relaxed">
              Explore cardiac embryology through interactive 3D models, sequencing the developmental steps to understand atrial septation.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300">
            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 border border-slate-600/50">
              <Activity className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl text-slate-100 mb-3 font-semibold">Hemodynamic Analysis</h3>
            <p className="text-slate-400 leading-relaxed">
              Master cardiac catheterization data and understand pressure/oxygen changes in ASD pathophysiology.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300">
            <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 border border-slate-600/50">
              <Brain className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl text-slate-100 mb-3 font-semibold">Clinical Integration</h3>
            <p className="text-slate-400 leading-relaxed">
              Apply knowledge through clinical vignettes on paradoxical embolism and Eisenmenger syndrome.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-7 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-500/50" onClick={onBeginClick}>
            Begin Learning Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}