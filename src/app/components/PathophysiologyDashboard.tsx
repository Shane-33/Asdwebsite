import { ArrowRight, AlertTriangle, Activity } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

export function PathophysiologyDashboard() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Pathophysiology Dashboard
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Understanding the progression from normal physiology to Eisenmenger Syndrome
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Normal Physiology Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-slate-200">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <h3 className="text-2xl font-bold text-white">Normal Physiology</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Pressure readings */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <span className="font-semibold text-slate-900">LA Pressure</span>
                  <span className="text-xl font-bold text-green-600">10 mmHg</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-semibold text-slate-900">RA Pressure</span>
                  <span className="text-xl font-bold text-blue-600">5 mmHg</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-900">PVR</span>
                  <span className="text-xl font-bold text-slate-600">Normal</span>
                </div>
              </div>

              {/* Blood flow description */}
              <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-green-500">
                <h4 className="font-semibold text-slate-900 mb-2">Blood Flow Pattern</h4>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 rounded-full bg-red-600"></div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-slate-600">Left-to-Right Shunt</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Oxygenated blood from the left atrium shunts to the right atrium due to higher LA pressure. This increases pulmonary blood flow but doesn't cause cyanosis.
                </p>
              </div>

              {/* Clinical manifestations */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Clinical Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <Activity className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
                    <span>Normal oxygen saturation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <Activity className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
                    <span>Increased pulmonary blood flow</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <Activity className="w-4 h-4 mt-1 text-green-600 flex-shrink-0" />
                    <span>Right heart volume overload</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Eisenmenger Syndrome Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-red-500">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
              <h3 className="text-2xl font-bold text-white">Eisenmenger Syndrome</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Pressure readings */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <span className="font-semibold text-slate-900">LA Pressure</span>
                  <span className="text-xl font-bold text-red-600">10 mmHg</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <span className="font-semibold text-slate-900">RA Pressure</span>
                  <span className="text-xl font-bold text-red-600">15 mmHg</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg border border-red-300">
                  <span className="font-semibold text-slate-900">PVR</span>
                  <span className="text-xl font-bold text-red-700">Severely ↑</span>
                </div>
              </div>

              {/* Blood flow description */}
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
                <h4 className="font-semibold text-slate-900 mb-2">Blood Flow Pattern</h4>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                  <div className="w-4 h-4 rounded-full bg-red-600"></div>
                  <span className="text-sm font-semibold text-red-700">Right-to-Left Shunt (REVERSED)</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Chronic left-to-right shunt causes pulmonary vascular remodeling, raising PVR. Eventually, RA pressure exceeds LA pressure, reversing the shunt direction.
                </p>
              </div>

              {/* Clinical manifestations */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Clinical Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <AlertTriangle className="w-4 h-4 mt-1 text-red-600 flex-shrink-0" />
                    <span>Central cyanosis (blue discoloration)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <AlertTriangle className="w-4 h-4 mt-1 text-red-600 flex-shrink-0" />
                    <span>Digital clubbing</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600">
                    <AlertTriangle className="w-4 h-4 mt-1 text-red-600 flex-shrink-0" />
                    <span>Exercise intolerance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Alert Box */}
        <Alert className="border-2 border-amber-500 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-900 font-bold text-lg">
            Critical Risk: Paradoxical Embolism
          </AlertTitle>
          <AlertDescription className="text-amber-800 mt-2 leading-relaxed">
            <p className="mb-3">
              In Eisenmenger syndrome, the reversed (right-to-left) shunt creates a dangerous pathway for emboli to bypass the pulmonary circulation and enter systemic arterial circulation directly.
            </p>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-2">Clinical Implications:</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Venous thrombi can cause stroke or systemic arterial occlusion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Air bubbles during IV procedures pose significant risk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Surgical repair is contraindicated once Eisenmenger develops</span>
                </li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}