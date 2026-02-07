import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { CheckCircle2, XCircle, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface Chamber {
  id: string;
  name: string;
  fullName: string;
  normalPressure: string;
  normalO2: string;
  asdPressure: string;
  asdO2: string;
  pressureChange: 'increased' | 'unchanged' | 'decreased';
  o2Change: 'increased' | 'unchanged' | 'decreased';
}

const chambers: Chamber[] = [
  {
    id: 'ra',
    name: 'RA',
    fullName: 'Right Atrium',
    normalPressure: '2-8 mmHg',
    normalO2: '75%',
    asdPressure: '8-15 mmHg',
    asdO2: '80-85%',
    pressureChange: 'increased',
    o2Change: 'increased'
  },
  {
    id: 'rv',
    name: 'RV',
    fullName: 'Right Ventricle',
    normalPressure: '25/5 mmHg',
    normalO2: '75%',
    asdPressure: '35/8 mmHg',
    asdO2: '80-85%',
    pressureChange: 'increased',
    o2Change: 'increased'
  },
  {
    id: 'pa',
    name: 'PA',
    fullName: 'Pulmonary Artery',
    normalPressure: '25/10 mmHg',
    normalO2: '75%',
    asdPressure: '30-40/15 mmHg',
    asdO2: '80-85%',
    pressureChange: 'increased',
    o2Change: 'increased'
  },
  {
    id: 'la',
    name: 'LA',
    fullName: 'Left Atrium',
    normalPressure: '8-12 mmHg',
    normalO2: '95-100%',
    asdPressure: '8-12 mmHg',
    asdO2: '95-100%',
    pressureChange: 'unchanged',
    o2Change: 'unchanged'
  },
  {
    id: 'lv',
    name: 'LV',
    fullName: 'Left Ventricle',
    normalPressure: '120/10 mmHg',
    normalO2: '95-100%',
    asdPressure: '120/10 mmHg',
    asdO2: '95-100%',
    pressureChange: 'unchanged',
    o2Change: 'unchanged'
  },
  {
    id: 'aorta',
    name: 'Aorta',
    fullName: 'Aorta',
    normalPressure: '120/80 mmHg',
    normalO2: '95-100%',
    asdPressure: '120/80 mmHg',
    asdO2: '95-100%',
    pressureChange: 'unchanged',
    o2Change: 'unchanged'
  }
];

export function InteractiveHemodynamics({ onComplete }: { onComplete?: () => void }) {
  const [currentChamberIndex, setCurrentChamberIndex] = useState(0);
  const [selectedPressure, setSelectedPressure] = useState<string | null>(null);
  const [selectedO2, setSelectedO2] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedChambers, setCompletedChambers] = useState<string[]>([]);

  const currentChamber = chambers[currentChamberIndex];
  const isComplete = completedChambers.length === chambers.length;

  const handleSubmit = () => {
    if (!selectedPressure || !selectedO2) return;
    
    setShowFeedback(true);
    
    if (selectedPressure === currentChamber.pressureChange && selectedO2 === currentChamber.o2Change) {
      setTimeout(() => {
        setCompletedChambers([...completedChambers, currentChamber.id]);
        if (currentChamberIndex < chambers.length - 1) {
          setCurrentChamberIndex(currentChamberIndex + 1);
          setSelectedPressure(null);
          setSelectedO2(null);
          setShowFeedback(false);
        }
      }, 5000);
    }
  };

  const handleNextChamber = () => {
    if (!completedChambers.includes(currentChamber.id)) {
      setCompletedChambers([...completedChambers, currentChamber.id]);
    }
    if (currentChamberIndex < chambers.length - 1) {
      setCurrentChamberIndex(currentChamberIndex + 1);
      setSelectedPressure(null);
      setSelectedO2(null);
      setShowFeedback(false);
    }
  };

  const handleReset = () => {
    setCurrentChamberIndex(0);
    setSelectedPressure(null);
    setSelectedO2(null);
    setShowFeedback(false);
    setCompletedChambers([]);
  };

  const isCorrect = selectedPressure === currentChamber.pressureChange && selectedO2 === currentChamber.o2Change;

  if (isComplete) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    return (
      <section className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-20 px-6 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-12 border-2 border-green-500 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Hemodynamic Analysis Complete!
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              You've successfully analyzed all cardiac chambers. You now understand how ASD creates characteristic hemodynamic changes.
            </p>
            <div className="bg-blue-50 rounded-xl p-6 mb-8 border-l-4 border-[#005EB8] text-left">
              <h3 className="font-semibold text-slate-900 mb-3">Key Findings Summary</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#005EB8] font-bold mt-1">•</span>
                  <span><strong>Right-sided changes:</strong> Increased pressures and O₂ saturation in RA, RV, and PA due to left-to-right shunt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#005EB8] font-bold mt-1">•</span>
                  <span><strong>Left-sided chambers:</strong> Normal pressures and saturations (no cyanosis)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#005EB8] font-bold mt-1">•</span>
                  <span><strong>Diagnostic step-up:</strong> RA saturation 7-10% higher than SVC is pathognomonic</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={handleReset}
              className="bg-[#005EB8] hover:bg-[#004A93] text-white px-8 py-6 rounded-lg"
            >
              Review Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-slate-100 mb-4">
            Interactive Cardiac Catheterization
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Predict how pressure and oxygen saturation change in each cardiac chamber when comparing a normal heart to one with an ASD.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {chambers.map((chamber, idx) => (
            <div key={chamber.id} className="flex items-center">
              <div className={`px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-lg ${
                completedChambers.includes(chamber.id)
                  ? 'bg-emerald-500 text-white shadow-emerald-500/50'
                  : idx === currentChamberIndex
                  ? 'bg-blue-500 text-white shadow-blue-500/50'
                  : 'bg-slate-700 text-slate-400 border border-slate-600'
              }`}>
                {chamber.name}
              </div>
              {idx < chambers.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  completedChambers.includes(chamber.id) ? 'bg-emerald-500/50' : 'bg-slate-700'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Catheterization Diagram */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">
                Normal Heart Cath Values
              </h3>
              
              {/* Heart diagram with values */}
              <div className="relative bg-slate-50 rounded-xl p-8 min-h-[500px] border border-slate-200">
                <div className="text-center mb-4">
                  <Heart className="w-16 h-16 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Cardiac Catheterization Reference</p>
                </div>

                {/* Positioned chamber values */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Right side */}
                  <div className="space-y-6">
                    <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-300">
                      <h4 className="font-semibold text-blue-900 mb-2">RA</h4>
                      <p className="text-sm text-blue-800">P: 2-8 mmHg</p>
                      <p className="text-sm text-blue-800">O₂: 75%</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-300">
                      <h4 className="font-semibold text-blue-900 mb-2">RV</h4>
                      <p className="text-sm text-blue-800">P: 25/5 mmHg</p>
                      <p className="text-sm text-blue-800">O₂: 75%</p>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-300">
                      <h4 className="font-semibold text-blue-900 mb-2">PA</h4>
                      <p className="text-sm text-blue-800">P: 25/10 mmHg</p>
                      <p className="text-sm text-blue-800">O₂: 75%</p>
                    </div>
                  </div>

                  {/* Left side */}
                  <div className="space-y-6">
                    <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300">
                      <h4 className="font-semibold text-red-900 mb-2">LA</h4>
                      <p className="text-sm text-red-800">P: 8-12 mmHg</p>
                      <p className="text-sm text-red-800">O₂: 95-100%</p>
                    </div>
                    <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300">
                      <h4 className="font-semibold text-red-900 mb-2">LV</h4>
                      <p className="text-sm text-red-800">P: 120/10 mmHg</p>
                      <p className="text-sm text-red-800">O₂: 95-100%</p>
                    </div>
                    <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300">
                      <h4 className="font-semibold text-red-900 mb-2">Aorta</h4>
                      <p className="text-sm text-red-800">P: 120/80 mmHg</p>
                      <p className="text-sm text-red-800">O₂: 95-100%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Questions */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[#005EB8]">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {currentChamber.fullName}
                  </h3>
                  <span className="bg-[#005EB8] text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {currentChamberIndex + 1} of {chambers.length}
                  </span>
                </div>
                <p className="text-slate-600">
                  In a patient with an ASD compared to a normal heart, how do the following change?
                </p>
              </div>

              {/* Pressure Selection */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Pressure</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['increased', 'unchanged', 'decreased'].map((option) => (
                    <button
                      key={option}
                      onClick={() => !showFeedback && setSelectedPressure(option)}
                      disabled={showFeedback}
                      className={`p-4 rounded-lg border-2 font-medium transition-all ${
                        selectedPressure === option
                          ? 'border-[#005EB8] bg-blue-50 text-[#005EB8]'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      } ${showFeedback ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* O2 Saturation Selection */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">O₂ Saturation</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['increased', 'unchanged', 'decreased'].map((option) => (
                    <button
                      key={option}
                      onClick={() => !showFeedback && setSelectedO2(option)}
                      disabled={showFeedback}
                      className={`p-4 rounded-lg border-2 font-medium transition-all ${
                        selectedO2 === option
                          ? 'border-[#005EB8] bg-blue-50 text-[#005EB8]'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      } ${showFeedback ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              {!showFeedback && (
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedPressure || !selectedO2}
                  className="w-full bg-[#005EB8] hover:bg-[#004A93] text-white py-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </Button>
              )}

              {/* Feedback */}
              {showFeedback && (
                <div className={`mt-4 rounded-xl p-6 border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                  isCorrect 
                    ? 'bg-green-50 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                    : 'bg-red-50 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                }`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className={`font-bold mb-2 text-lg flex items-center gap-2 ${
                        isCorrect ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {isCorrect ? '🎉 Correct! Great job!' : '❌ Not quite, let\'s review!'}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-slate-900 mb-2">Correct Answer:</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Pressure: </span>
                        <span className="font-semibold text-slate-900">{currentChamber.pressureChange}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">O₂: </span>
                        <span className="font-semibold text-slate-900">{currentChamber.o2Change}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-600">Normal: {currentChamber.normalPressure}, {currentChamber.normalO2}</p>
                      <p className="text-xs text-slate-600">ASD: {currentChamber.asdPressure}, {currentChamber.asdO2}</p>
                    </div>
                  </div>

                  {isCorrect && currentChamberIndex < chambers.length - 1 && (
                    <p className="text-green-800 text-sm">
                      Moving to the next chamber...
                    </p>
                  )}

                  {/* Next Chamber Button - appears for incorrect answers */}
                  {!isCorrect && currentChamberIndex < chambers.length - 1 && (
                    <Button
                      onClick={handleNextChamber}
                      className="w-full bg-[#005EB8] hover:bg-[#004A93] text-white py-4 rounded-lg mt-2"
                    >
                      Next Chamber →
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}