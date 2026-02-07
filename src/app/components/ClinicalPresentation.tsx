import { Heart, Stethoscope, Activity } from "lucide-react";

export function ClinicalPresentation() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-slate-100 mb-4">
            Clinical Presentation of ASD
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Understanding the signs, symptoms, and physical examination findings in atrial septal defects.
          </p>
        </div>

        {/* Symptoms & Signs */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Symptoms */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                <Heart className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl text-slate-100">Symptoms</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-blue-500">
                <h4 className="font-semibold text-slate-100 mb-2">Childhood</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold mt-1">•</span>
                    <span>Often <strong>asymptomatic</strong> - discovered incidentally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold mt-1">•</span>
                    <span>Frequent respiratory infections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold mt-1">•</span>
                    <span>Failure to thrive (large defects)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-amber-500">
                <h4 className="font-semibold text-slate-100 mb-2">Adulthood (3rd-4th decade)</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold mt-1">•</span>
                    <span>Dyspnea on exertion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold mt-1">•</span>
                    <span>Exercise intolerance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold mt-1">•</span>
                    <span>Palpitations (atrial arrhythmias)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold mt-1">•</span>
                    <span>Fatigue</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-500/10 rounded-lg p-4 border-l-4 border-red-500">
                <h4 className="font-semibold text-red-300 mb-2">Late Complications</h4>
                <ul className="space-y-2 text-sm text-red-200">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold mt-1">•</span>
                    <span>Pulmonary hypertension</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold mt-1">•</span>
                    <span>Right heart failure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold mt-1">•</span>
                    <span>Eisenmenger syndrome (irreversible)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Physical Exam */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                <Stethoscope className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl text-slate-100">Physical Exam</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-300 mb-2">Inspection</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• No cyanosis (until Eisenmenger develops)</li>
                  <li>• Prominent RV impulse (left parasternal heave)</li>
                </ul>
              </div>

              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-300 mb-2">Palpation</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• Palpable P2 (pulmonary hypertension)</li>
                  <li>• RV heave at left sternal border</li>
                </ul>
              </div>

              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-300 mb-2">Auscultation</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• <strong>Fixed split S2</strong> (pathognomonic)</li>
                  <li>• Systolic ejection murmur (pulmonic flow)</li>
                  <li>• Mid-diastolic rumble at tricuspid area</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Split S2 Explanation */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border-2 border-[#005EB8] mb-12">
          <div className="bg-gradient-to-r from-[#005EB8] to-[#0077CC] px-8 py-6">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold text-white">Why Does ASD Cause a Fixed Split S2?</h3>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Normal S2 */}
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <h4 className="font-bold text-slate-900 mb-4 text-center">Normal S2 Splitting</h4>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-bold text-slate-900 mb-2 text-sm">During Inspiration:</h5>
                    <ul className="text-xs text-slate-800 space-y-1">
                      <li>→ ↑ Venous return to right heart</li>
                      <li>→ ↑ RV stroke volume</li>
                      <li>→ RV ejection takes longer</li>
                      <li>→ Pulmonic valve (P2) closes <strong>LATER</strong></li>
                    </ul>
                    <div className="mt-3 bg-green-100 rounded px-3 py-2 text-center">
                      <span className="font-mono text-sm font-bold text-slate-900">A2 — — P2</span>
                      <p className="text-xs text-green-800 mt-1 font-semibold">Split widens</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-bold text-slate-900 mb-2 text-sm">During Expiration:</h5>
                    <ul className="text-xs text-slate-800 space-y-1">
                      <li>→ ↓ Venous return to right heart</li>
                      <li>→ Normal RV ejection time</li>
                      <li>→ A2 and P2 close together</li>
                    </ul>
                    <div className="mt-3 bg-green-100 rounded px-3 py-2 text-center">
                      <span className="font-mono text-sm font-bold text-slate-900">A2-P2</span>
                      <p className="text-xs text-green-800 mt-1 font-semibold">Split narrows or single</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ASD Fixed Split */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-[#005EB8]">
                <h4 className="font-bold text-slate-900 mb-4 text-center">ASD Fixed Split S2</h4>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-bold text-slate-900 mb-2 text-sm">During Inspiration:</h5>
                    <ul className="text-xs text-slate-800 space-y-1">
                      <li>→ ↑ Venous return to RA</li>
                      <li>→ BUT: ↑ LA→RA shunt flow compensates</li>
                      <li>→ Net RV volume stays <strong>constant</strong></li>
                      <li>→ RV ejection time unchanged</li>
                    </ul>
                    <div className="mt-3 bg-blue-100 rounded px-3 py-2 text-center">
                      <span className="font-mono text-sm font-bold text-slate-900">A2 — P2</span>
                      <p className="text-xs text-blue-800 mt-1 font-semibold">Fixed split</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-bold text-slate-900 mb-2 text-sm">During Expiration:</h5>
                    <ul className="text-xs text-slate-800 space-y-1">
                      <li>→ ↓ Venous return to RA</li>
                      <li>→ BUT: ↓ LA→RA shunt flow compensates</li>
                      <li>→ Net RV volume stays <strong>constant</strong></li>
                      <li>→ RV ejection time unchanged</li>
                    </ul>
                    <div className="mt-3 bg-blue-100 rounded px-3 py-2 text-center">
                      <span className="font-mono text-sm font-bold text-slate-900">A2 — P2</span>
                      <p className="text-xs text-blue-800 mt-1 font-semibold">Fixed split</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key mechanism */}
            <div className="bg-[#005EB8] rounded-xl p-6 text-white">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Physiologic Mechanism
              </h4>
              <p className="leading-relaxed">
                The ASD acts as a <strong>pressure equalizer</strong> between the atria. During inspiration, when systemic venous return increases, 
                the shunt flow from LA to RA <em>decreases</em> proportionally. This keeps total RV filling constant across the respiratory cycle. 
                Since RV stroke volume doesn't change, the timing of pulmonic valve closure (P2) remains fixed relative to aortic valve closure (A2), 
                creating the pathognomonic <strong>fixed split S2</strong>—wide and unchanging with respiration.
              </p>
            </div>
          </div>
        </div>

        {/* Background Clinical Questions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700/50">
          <h3 className="text-2xl font-bold text-slate-100 mb-6">Clinical Pearls & Quick Review</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-lg p-5 border-l-4 border-[#005EB8]">
              <h4 className="font-bold text-slate-900 mb-2">Most Common ASD Type?</h4>
              <p className="text-slate-700 text-sm"><strong>Secundum ASD</strong> (70% of cases) - failure of septum primum/secundum development</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border-l-4 border-purple-500">
              <h4 className="font-bold text-slate-900 mb-2">When to Close an ASD?</h4>
              <p className="text-slate-700 text-sm">Qp:Qs ratio <strong>{'>'}1.5:1</strong> with evidence of RV volume overload</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border-l-4 border-green-500">
              <h4 className="font-bold text-slate-900 mb-2">Primum vs Secundum ASD?</h4>
              <p className="text-slate-700 text-sm"><strong>Primum ASD:</strong> Lower in septum, associated with AV valve abnormalities (endocardial cushion defect). <strong>Secundum:</strong> Central, most common</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border-l-4 border-amber-500">
              <h4 className="font-bold text-slate-900 mb-2">Why No Cyanosis Initially?</h4>
              <p className="text-slate-700 text-sm">Shunt is <strong>left-to-right</strong> because LA pressure {'>'} RA pressure. Fully oxygenated blood enters systemic circulation.</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border-l-4 border-red-500">
              <h4 className="font-bold text-slate-900 mb-2">Association with Stroke?</h4>
              <p className="text-slate-700 text-sm"><strong>Paradoxical embolism:</strong> Venous clots bypass lungs through ASD, causing arterial emboli (especially with Valsalva maneuvers)</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border-l-4 border-blue-500">
              <h4 className="font-bold text-slate-900 mb-2">CXR Findings?</h4>
              <p className="text-slate-700 text-sm">↑ Pulmonary vascular markings, enlarged RA and RV, prominent pulmonary arteries</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border-l-4 border-teal-500">
              <h4 className="font-bold text-slate-900 mb-2">Risk Factors & Associations?</h4>
              <p className="text-slate-700 text-sm"><strong>Trisomy 21 (Down syndrome)</strong> and <strong>fetal alcohol syndrome</strong> are associated with increased incidence of ASDs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}