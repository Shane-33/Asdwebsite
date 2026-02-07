import { ArrowRight, Heart, TrendingUp, TrendingDown } from "lucide-react";

interface HemodynamicValue {
  parameter: string;
  normal: string;
  asd: string;
  unit: string;
  change: 'up' | 'down' | 'neutral';
}

const hemodynamicData: HemodynamicValue[] = [
  {
    parameter: "RA Pressure",
    normal: "2-8",
    asd: "8-15",
    unit: "mmHg",
    change: 'up'
  },
  {
    parameter: "LA Pressure",
    normal: "8-12",
    asd: "8-12",
    unit: "mmHg",
    change: 'neutral'
  },
  {
    parameter: "RV Pressure",
    normal: "15-30 / 2-8",
    asd: "25-40 / 5-12",
    unit: "mmHg",
    change: 'up'
  },
  {
    parameter: "Pulmonary Flow (Qp)",
    normal: "1.0",
    asd: "1.5-3.0+",
    unit: "relative",
    change: 'up'
  },
  {
    parameter: "Systemic Flow (Qs)",
    normal: "1.0",
    asd: "1.0",
    unit: "relative",
    change: 'neutral'
  },
  {
    parameter: "Qp:Qs Ratio",
    normal: "1.0",
    asd: "1.5-3.0+",
    unit: "ratio",
    change: 'up'
  }
];

const oxygenData = [
  {
    location: "Right Atrium",
    normal: "75%",
    asd: "80-85%",
    explanation: "Mixed venous saturation increases due to shunted oxygenated blood from LA"
  },
  {
    location: "Right Ventricle",
    normal: "75%",
    asd: "80-85%",
    explanation: "Reflects the increased RA saturation"
  },
  {
    location: "Pulmonary Artery",
    normal: "75%",
    asd: "80-85%",
    explanation: "Step-up in oxygen saturation is diagnostic of left-to-right shunt"
  },
  {
    location: "Left Atrium",
    normal: "95-100%",
    asd: "95-100%",
    explanation: "Pulmonary venous return remains fully saturated"
  },
  {
    location: "Systemic Arterial",
    normal: "95-100%",
    asd: "95-100%",
    explanation: "No cyanosis in uncomplicated ASD (pre-Eisenmenger)"
  }
];

export function HemodynamicsComparison() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Hemodynamic Changes in ASD
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Understanding the pressure and oxygen saturation differences between normal hearts and those with atrial septal defects.
          </p>
        </div>

        {/* Pressure Comparison */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-[#005EB8] to-[#0077CC] px-8 py-6">
              <h3 className="text-2xl font-bold text-white">Intracardiac Pressures & Flow</h3>
            </div>

            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-4 px-4 font-semibold text-slate-900">Parameter</th>
                      <th className="text-center py-4 px-4 font-semibold text-slate-900">Normal</th>
                      <th className="text-center py-4 px-4 font-semibold text-slate-900">
                        <div className="flex items-center justify-center gap-2">
                          <Heart className="w-5 h-5 text-red-500" />
                          <span>With ASD</span>
                        </div>
                      </th>
                      <th className="text-center py-4 px-4 font-semibold text-slate-900">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hemodynamicData.map((item, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-medium text-slate-900">{item.parameter}</td>
                        <td className="text-center py-4 px-4 text-slate-700">
                          <span className="inline-block bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                            {item.normal} <span className="text-xs text-slate-500">{item.unit}</span>
                          </span>
                        </td>
                        <td className="text-center py-4 px-4 text-slate-700">
                          <span className="inline-block bg-red-50 px-3 py-1 rounded-lg border border-red-200">
                            {item.asd} <span className="text-xs text-slate-500">{item.unit}</span>
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">
                          {item.change === 'up' && (
                            <div className="flex items-center justify-center gap-1 text-red-600">
                              <TrendingUp className="w-5 h-5" />
                              <span className="font-semibold text-sm">Increased</span>
                            </div>
                          )}
                          {item.change === 'down' && (
                            <div className="flex items-center justify-center gap-1 text-blue-600">
                              <TrendingDown className="w-5 h-5" />
                              <span className="font-semibold text-sm">Decreased</span>
                            </div>
                          )}
                          {item.change === 'neutral' && (
                            <div className="flex items-center justify-center gap-1 text-slate-500">
                              <span className="font-semibold text-sm">Unchanged</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Key concept box */}
              <div className="mt-6 bg-blue-50 rounded-xl p-6 border-l-4 border-[#005EB8]">
                <h4 className="font-semibold text-slate-900 mb-2">Clinical Significance</h4>
                <p className="text-slate-700 leading-relaxed">
                  The left-to-right shunt increases right heart volume load and pulmonary blood flow (Qp). A Qp:Qs ratio {'>'} 1.5:1 typically indicates a hemodynamically significant ASD requiring intervention. Chronic volume overload can lead to right ventricular dilation and eventual pulmonary hypertension.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Oxygen Saturation Comparison */}
        <div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-red-600 to-blue-600 px-8 py-6">
              <h3 className="text-2xl font-bold text-white">Oxygen Saturation Profile</h3>
            </div>

            <div className="p-8">
              {/* Visual flow diagram */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Normal */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-4 text-center">Normal Heart</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg text-sm font-semibold">
                        SVC/IVC: 75%
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                      <div className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg text-sm font-semibold">
                        RA: 75%
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg text-sm font-semibold">
                        RV: 75%
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                      <div className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg text-sm font-semibold">
                        PA: 75%
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-xs text-slate-600">No saturation step-up detected</p>
                  </div>
                </div>

                {/* ASD */}
                <div className="bg-red-50 rounded-xl p-6 border-2 border-red-300">
                  <h4 className="font-semibold text-slate-900 mb-4 text-center">Heart with ASD</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg text-sm font-semibold">
                        SVC/IVC: 75%
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                      <div className="flex-1 bg-purple-500 text-white text-center py-2 rounded-lg text-sm font-semibold relative">
                        RA: 82%
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
                      <div className="text-xs text-red-600 font-semibold bg-red-100 px-2 py-1 rounded">
                        + LA Blood
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-purple-500 text-white text-center py-2 rounded-lg text-sm font-semibold">
                        RV: 82%
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                      <div className="flex-1 bg-purple-500 text-white text-center py-2 rounded-lg text-sm font-semibold">
                        PA: 82%
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-xs text-red-700 font-semibold">⚠️ Saturation step-up diagnostic!</p>
                  </div>
                </div>
              </div>

              {/* Detailed table */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-4">Location-Specific Analysis</h4>
                <div className="space-y-4">
                  {oxygenData.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-slate-900">{item.location}</h5>
                        <div className="flex gap-3">
                          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            Normal: {item.normal}
                          </span>
                          <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                            ASD: {item.asd}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostic Pearl */}
              <div className="mt-6 bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
                <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Diagnostic Pearl
                </h4>
                <p className="text-amber-800 leading-relaxed">
                  <span className="font-semibold">Oxygen saturation step-up</span> at the right atrium level (RA saturation {'>'}7-10% higher than SVC) is pathognomonic for a left-to-right shunt at the atrial level. This is detected during cardiac catheterization or can be estimated with echocardiographic contrast studies. <span className="font-semibold">No cyanosis occurs</span> in simple ASD because the shunt is left-to-right—systemic arterial saturation remains normal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
