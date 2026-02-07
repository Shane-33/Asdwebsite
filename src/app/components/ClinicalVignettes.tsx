import { useState } from "react";
import { AlertTriangle, Brain, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface VignetteQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const paradoxicalEmbolismVignette = {
  title: "Case 1: Paradoxical Embolism",
  icon: Brain,
  iconColor: "text-purple-600",
  bgColor: "bg-purple-50",
  borderColor: "border-purple-500",
  titleColor: "text-slate-900",
  presentation: `A 32-year-old woman presents to the emergency department with sudden onset of right-sided weakness and 
  aphasia that began 2 hours ago. She has a history of a known but previously asymptomatic atrial septal defect. 
  Three days prior to presentation, she had a 14-hour international flight. On examination, she has right hemiparesis 
  and expressive aphasia. Cardiac exam reveals a fixed split S2. Lower extremity examination shows mild swelling of 
  the left calf with tenderness.`,
  questions: [
    {
      id: 1,
      question: "What is the most likely diagnosis?",
      options: [
        "Hemorrhagic stroke from hypertension",
        "Cardioembolic stroke from atrial fibrillation",
        "Paradoxical embolism causing ischemic stroke",
        "Carotid artery dissection"
      ],
      correctAnswer: 2,
      explanation: "The combination of ASD, recent prolonged immobility (flight), DVT symptoms, and stroke suggests a paradoxical embolism. A venous thrombus from the leg DVT crossed through the ASD into systemic circulation, causing a stroke."
    },
    {
      id: 2,
      question: "Which mechanism best explains how the embolus reached the cerebral circulation?",
      options: [
        "Pulmonary veins filtered the clot which then embolized",
        "Right-to-left shunt through ASD bypassing pulmonary filtration",
        "Left atrial thrombus formation",
        "Direct extension from carotid artery"
      ],
      correctAnswer: 1,
      explanation: "Venous emboli normally travel to the right heart and are filtered by pulmonary capillaries. In ASD with transient right-to-left shunting (e.g., during Valsalva, coughing, or if pulmonary pressures are elevated), the embolus bypasses the lungs and enters systemic arterial circulation—a paradoxical embolism."
    },
    {
      id: 3,
      question: "What condition would make paradoxical embolism MORE likely in this patient?",
      options: [
        "Eisenmenger syndrome with chronic right-to-left shunt",
        "Systemic hypertension",
        "Mitral stenosis",
        "Left ventricular hypertrophy"
      ],
      correctAnswer: 0,
      explanation: "Eisenmenger syndrome causes permanent shunt reversal (right-to-left) due to elevated pulmonary vascular resistance. This creates a continuous pathway for venous emboli to bypass the lungs. Even without Eisenmenger, transient RA pressure elevation (Valsalva, cough) can cause temporary right-to-left shunting."
    }
  ] as VignetteQuestion[]
};

const eisenmengerVignette = {
  title: "Case 2: Eisenmenger Syndrome",
  icon: Heart,
  iconColor: "text-red-600",
  bgColor: "bg-red-50",
  borderColor: "border-red-500",
  titleColor: "text-slate-900",
  presentation: `A 38-year-old man with a known large secundum ASD diagnosed in childhood (but never repaired) presents 
  with progressive dyspnea on exertion and fatigue over the past year. He reports blue discoloration of his lips 
  and fingernails, especially with activity. On examination, he is centrally cyanotic with digital clubbing. 
  Cardiac auscultation reveals a loud P2, no murmur at the left upper sternal border, and a right ventricular heave. 
  Oxygen saturation is 82% on room air. Echocardiography shows severe pulmonary hypertension with estimated RVSP of 95 mmHg 
  and bidirectional shunting across the ASD.`,
  questions: [
    {
      id: 1,
      question: "What is the diagnosis?",
      options: [
        "Simple ASD with left-to-right shunt",
        "Eisenmenger syndrome",
        "Primary pulmonary hypertension",
        "Tetralogy of Fallot"
      ],
      correctAnswer: 1,
      explanation: "This is classic Eisenmenger syndrome: chronic left-to-right shunt from a large ASD caused pulmonary vascular remodeling and severe pulmonary hypertension. The shunt has now reversed to right-to-left, causing cyanosis and clubbing."
    },
    {
      id: 2,
      question: "Why is the patient cyanotic?",
      options: [
        "Left ventricular failure",
        "Pulmonary edema",
        "Right-to-left shunt bypassing pulmonary oxygenation",
        "Severe anemia"
      ],
      correctAnswer: 2,
      explanation: "Cyanosis occurs because the shunt has reversed. Elevated pulmonary vascular resistance causes RA pressure to exceed LA pressure, shunting deoxygenated blood from the right atrium directly to the left atrium, bypassing the lungs. This deoxygenated blood enters systemic circulation."
    },
    {
      id: 3,
      question: "Why is surgical ASD closure now contraindicated?",
      options: [
        "Patient is too old for surgery",
        "Closing the ASD would eliminate the pressure relief valve for the RV, causing acute RV failure",
        "Surgery would worsen pulmonary hypertension",
        "The defect is too large to close"
      ],
      correctAnswer: 1,
      explanation: "Once Eisenmenger develops, the ASD acts as a 'pop-off' valve, allowing the RV to decompress by shunting blood to the LA. Closing the defect would force the failing RV to pump against severe pulmonary hypertension without relief, leading to acute RV failure and death. Eisenmenger is irreversible; only lung or heart-lung transplant can be curative."
    },
    {
      id: 4,
      question: "What is the pathophysiologic mechanism underlying Eisenmenger syndrome?",
      options: [
        "Genetic mutation causing primary PVR elevation",
        "Chronic pulmonary venous congestion",
        "Pulmonary vascular remodeling from chronic high flow and shear stress",
        "Recurrent pulmonary infections"
      ],
      correctAnswer: 2,
      explanation: "Chronic left-to-right shunt increases pulmonary blood flow (Qp) significantly. The pulmonary vasculature experiences chronic high flow and increased shear stress, triggering endothelial dysfunction, smooth muscle hypertrophy, and irreversible vascular remodeling. This raises pulmonary vascular resistance to suprasystemic levels, reversing the shunt."
    }
  ] as VignetteQuestion[]
};

interface VignetteComponentProps {
  vignette: typeof paradoxicalEmbolismVignette | typeof eisenmengerVignette;
}

function VignetteComponent({ vignette }: VignetteComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(vignette.questions.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState<boolean[]>(
    new Array(vignette.questions.length).fill(false)
  );
  const [showPresentation, setShowPresentation] = useState(true);

  const Icon = vignette.icon;
  const question = vignette.questions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    const newExplanations = [...showExplanation];
    newExplanations[currentQuestion] = true;
    setShowExplanation(newExplanations);
  };

  const handleNext = () => {
    if (currentQuestion < vignette.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isCorrect = selectedAnswers[currentQuestion] === question.correctAnswer;
  const hasAnswered = selectedAnswers[currentQuestion] !== null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-700/50">
      {/* Header */}
      <div className={`${vignette.bgColor} bg-opacity-20 border-b-2 ${vignette.borderColor} border-opacity-50 px-8 py-6`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-600">
            <Icon className={`w-8 h-8 ${vignette.iconColor}`} />
          </div>
          <h3 className="text-2xl font-bold text-slate-100">{vignette.title}</h3>
        </div>
      </div>

      {/* Clinical Presentation */}
      <div className="border-b border-slate-700/50">
        <button
          onClick={() => setShowPresentation(!showPresentation)}
          className="w-full px-8 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
        >
          <span className="font-semibold text-slate-100">Clinical Presentation</span>
          {showPresentation ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        {showPresentation && (
          <div className="px-8 pb-6">
            <p className="text-slate-300 leading-relaxed">{vignette.presentation}</p>
          </div>
        )}
      </div>

      {/* Question Progress */}
      <div className="px-8 py-4 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">
            Question {currentQuestion + 1} of {vignette.questions.length}
          </span>
          <div className="flex gap-2">
            {vignette.questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  selectedAnswers[idx] !== null
                    ? selectedAnswers[idx] === vignette.questions[idx].correctAnswer
                      ? 'bg-emerald-500'
                      : 'bg-red-500'
                    : idx === currentQuestion
                    ? 'bg-blue-500'
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="p-8">
        <h4 className="text-xl font-bold text-slate-100 mb-6">{question.question}</h4>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion] === index;
            const isCorrectOption = index === question.correctAnswer;
            const showCorrect = showExplanation[currentQuestion] && isCorrectOption;
            const showIncorrect = showExplanation[currentQuestion] && isSelected && !isCorrectOption;

            return (
              <button
                key={index}
                onClick={() => !hasAnswered && handleAnswer(index)}
                disabled={hasAnswered}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  showCorrect
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : showIncorrect
                    ? 'border-red-500 bg-red-500/10'
                    : isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 hover:border-slate-600 hover:bg-slate-700/30'
                } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    showCorrect
                      ? 'bg-emerald-500 text-white'
                      : showIncorrect
                      ? 'bg-red-500 text-white'
                      : isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 text-slate-200">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation[currentQuestion] && (
          <div className={`rounded-xl border-2 p-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
            isCorrect 
              ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
              : 'border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
          }`}>
            <h5 className={`font-bold mb-2 text-xl flex items-center gap-2 ${
              isCorrect ? 'text-emerald-300' : 'text-amber-300'
            }`}>
              {isCorrect ? '🎉 Correct! Nice work!' : '💡 Not quite, but let\'s learn!'}
            </h5>
            <p className={`leading-relaxed ${isCorrect ? 'text-emerald-200' : 'text-amber-200'}`}>
              {question.explanation}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 disabled:opacity-50"
          >
            Previous
          </Button>
          {currentQuestion < vignette.questions.length - 1 && (
            <Button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 border border-blue-500/50"
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ClinicalVignettes({ onComplete }: { onComplete?: () => void }) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full mb-4 border border-amber-500/30">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Clinical Case Studies</span>
          </div>
          <h2 className="text-4xl text-slate-100 mb-4">
            ASD Complications: Clinical Vignettes
          </h2>
        </div>

        <div className="space-y-8">
          <VignetteComponent vignette={paradoxicalEmbolismVignette} />
          <VignetteComponent vignette={eisenmengerVignette} />
        </div>
      </div>
    </section>
  );
}