import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which structure forms first during atrial septation?",
    options: [
      "Septum Secundum",
      "Septum Primum",
      "Foramen Ovale",
      "Fossa Ovalis"
    ],
    correctAnswer: 1,
    explanation: "Septum Primum is the first structure to form, growing down from the roof of the primitive atrium toward the endocardial cushions around week 4-5."
  },
  {
    id: 2,
    question: "What mechanism creates Ostium Secundum in Septum Primum?",
    options: [
      "Mechanical perforation",
      "Programmed cell death (apoptosis)",
      "Muscular contraction",
      "Endocardial cushion fusion"
    ],
    correctAnswer: 1,
    explanation: "Apoptosis (programmed cell death) creates multiple perforations in the superior portion of Septum Primum, which coalesce to form Ostium Secundum."
  },
  {
    id: 3,
    question: "A patient with an uncomplicated ASD undergoes cardiac catheterization. Where would you expect to see an oxygen saturation step-up?",
    options: [
      "Left atrium",
      "Right atrium",
      "Left ventricle",
      "Aorta"
    ],
    correctAnswer: 1,
    explanation: "A saturation step-up in the right atrium (typically >7-10% higher than SVC) is diagnostic of a left-to-right shunt at the atrial level. Oxygenated blood from the LA mixes with deoxygenated blood in the RA."
  },
  {
    id: 4,
    question: "A 45-year-old woman with a known large ASD develops cyanosis and clubbing. Her pulmonary artery pressure is severely elevated. What complication has occurred?",
    options: [
      "Acute myocardial infarction",
      "Eisenmenger syndrome",
      "Pulmonary embolism",
      "Infective endocarditis"
    ],
    correctAnswer: 1,
    explanation: "Eisenmenger syndrome occurs when chronic left-to-right shunt causes severe pulmonary vascular remodeling and elevated pulmonary vascular resistance. This reverses the shunt to right-to-left, causing cyanosis. Surgical repair is contraindicated at this stage."
  },
  {
    id: 5,
    question: "What is the most dangerous consequence of paradoxical embolism in a patient with Eisenmenger syndrome?",
    options: [
      "Pulmonary embolism",
      "Systemic arterial embolization (stroke/MI)",
      "Right ventricular infarction",
      "Peripheral edema"
    ],
    correctAnswer: 1,
    explanation: "In Eisenmenger syndrome with right-to-left shunt, venous emboli bypass the pulmonary circulation (which normally filters clots) and enter systemic arterial circulation directly. This can cause stroke, myocardial infarction, or peripheral arterial occlusion—a paradoxical embolism."
  },
  {
    id: 6,
    question: "What causes functional closure of the foramen ovale at birth?",
    options: [
      "Decreased right atrial pressure",
      "Increased left atrial pressure",
      "Umbilical cord clamping only",
      "First breath only"
    ],
    correctAnswer: 1,
    explanation: "At birth, increased pulmonary blood flow raises left atrial pressure above right atrial pressure, pushing Septum Primum against Septum Secundum and functionally closing the foramen ovale."
  },
  {
    id: 7,
    question: "Which type of ASD is most common?",
    options: [
      "Sinus venosus ASD",
      "Primum ASD",
      "Secundum ASD",
      "Coronary sinus ASD"
    ],
    correctAnswer: 2,
    explanation: "Secundum ASD is the most common type (70% of all ASDs), resulting from excessive resorption of Septum Primum or inadequate development of Septum Secundum."
  },
  {
    id: 8,
    question: "In a patient with Eisenmenger syndrome from an ASD, what direction does the shunt flow?",
    options: [
      "Left-to-right only",
      "Right-to-left (reversed)",
      "Bidirectional equally",
      "No shunt flow occurs"
    ],
    correctAnswer: 1,
    explanation: "Eisenmenger syndrome represents a reversal of shunt direction from left-to-right to right-to-left due to severely elevated pulmonary vascular resistance. RA pressure exceeds LA pressure, causing deoxygenated blood to shunt into systemic circulation."
  }
];

export function ClinicalQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [showExplanation, setShowExplanation] = useState<boolean[]>(new Array(quizQuestions.length).fill(false));

  const question = quizQuestions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== null;
  const isCorrect = selectedAnswers[currentQuestion] === question.correctAnswer;
  const score = selectedAnswers.filter((answer, idx) => answer === quizQuestions[idx].correctAnswer).length;

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    const newExplanations = [...showExplanation];
    newExplanations[currentQuestion] = true;
    setShowExplanation(newExplanations);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quizQuestions.length).fill(null));
    setShowExplanation(new Array(quizQuestions.length).fill(false));
  };

  const allQuestionsAnswered = selectedAnswers.every(answer => answer !== null);
  const percentCorrect = allQuestionsAnswered ? Math.round((score / quizQuestions.length) * 100) : 0;

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-slate-100 mb-4">
            Clinical Knowledge Quiz
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Test your understanding of ASD embryology, hemodynamics, and clinical presentation.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            {allQuestionsAnswered && (
              <span className="text-sm font-semibold text-emerald-400">
                Score: {score}/{quizQuestions.length} ({percentCorrect}%)
              </span>
            )}
          </div>
          <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-2 bg-slate-700" />
        </div>

        {/* Question Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 mb-6">
          {/* Question Header */}
          <div className="bg-slate-800/80 px-8 py-6 border-b border-slate-700/50">
            <h3 className="text-xl text-slate-100 leading-relaxed">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="p-8 space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const isCorrectOption = index === question.correctAnswer;
              const showCorrect = showExplanation[currentQuestion] && isCorrectOption;
              const showIncorrect = showExplanation[currentQuestion] && isSelected && !isCorrectOption;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                    showCorrect
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : showIncorrect
                      ? 'border-red-500 bg-red-500/10'
                      : isSelected
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600 hover:bg-slate-700/30'
                  } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
                    {showCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    {showIncorrect && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
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
              <h4 className={`font-bold mb-3 flex items-center gap-2 text-xl ${
                isCorrect ? 'text-emerald-300' : 'text-amber-300'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    🎉 Correct! Excellent!
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6" />
                    💡 Learning Opportunity!
                  </>
                )}
              </h4>
              <p className={`leading-relaxed ${isCorrect ? 'text-emerald-200' : 'text-amber-200'}`}>
                {question.explanation}
              </p>
            </div>
          )}
        </div>

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

          <div className="flex gap-2">
            {quizQuestions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedAnswers[idx] !== null
                    ? selectedAnswers[idx] === quizQuestions[idx].correctAnswer
                      ? 'bg-emerald-500'
                      : 'bg-red-500'
                    : idx === currentQuestion
                    ? 'bg-blue-500'
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>

          {currentQuestion < quizQuestions.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50"
            >
              Next
            </Button>
          ) : (
            allQuestionsAnswered && (
              <Button
                onClick={handleReset}
                className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50"
              >
                Retry Quiz
              </Button>
            )
          )}
        </div>
      </div>
    </section>
  );
}