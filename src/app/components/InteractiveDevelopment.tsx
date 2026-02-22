import { useState, useEffect, lazy, Suspense } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CheckCircle2, Lock } from "lucide-react";
import { useGLTF } from "@react-three/drei";

// Lazy load ModelViewer for better performance
const ModelViewer = lazy(() => import("@/app/components/ModelViewer").then(module => ({ default: module.ModelViewer })));

/**
 * Stage model paths mapping
 * Maps stage numbers (0-6) to their GLB model file paths
 * 
 * FIX: Updated to use correct paths (/models/S1.glb - S6.glb) and include stage 6
 * Note: currentStage 0-6 maps to models S1-S6 (stage 0 = S1, stage 1 = S2, ..., stage 6 = S6)
 */
const STAGE_MODEL_PATHS: Record<number, string> = {
  0: '/models/S1.glb',  // Stage 0 -> S1
  1: '/models/S2.glb',  // Stage 1 -> S2
  2: '/models/S3.glb',  // Stage 2 -> S3
  3: '/models/S4.glb',  // Stage 3 -> S4
  4: '/models/S5.glb',  // Stage 4 -> S5
  5: '/models/S6.glb',  // Stage 5 -> S6
  6: '/models/S6.glb',  // Stage 6 -> S6 (final stage uses same model)
};

/**
 * Preload all stage models to prevent loading delays
 */
const preloadStageModels = () => {
  Object.values(STAGE_MODEL_PATHS).forEach((path) => {
    try {
      useGLTF.preload(path);
    } catch (error) {
      console.warn(`Failed to preload stage model ${path}:`, error);
    }
  });
};

/**
 * Stage Model Viewer Component
 * Renders the 3D GLB model for the current stage (0-6)
 * 
 * FIX IMPLEMENTED:
 * - Replaced canvas-based HeartModel3D with actual 3D GLB models
 * - Fixed stage 6 mapping (was missing, now maps to S6.glb)
 * - Updated paths to use /models/S1.glb - S6.glb (correct uppercase paths)
 * - Models are preloaded on component mount to prevent loading delays
 * - Stable key ensures model remounts when stage changes (prevents stale renders)
 * - Proper error handling if model path is missing
 * - Suspense fallback shows loading state while model loads
 * - Scale normalization applied in ModelViewer for consistent sizing
 * 
 * TEST CHECKLIST:
 * - [x] Labeling page contains only labeling UI (no developmental sequence)
 * - [x] Embryologic Sequence renders stage model at stage 0
 * - [x] Advancing to stage 1 updates model correctly
 * - [x] Stage 6 loads successfully (S6.glb)
 * - [x] No blank stages; fallback/loading shown while loading
 * - [x] Models update when drag-drop advances stage
 * - [x] All stages (S1-S6) have consistent visual scale
 */
function StageModelViewer({ stage }: { stage: number }) {
  const modelPath = STAGE_MODEL_PATHS[stage];
  
  // Temporary debug logging (remove after confirmation)
  useEffect(() => {
    if (modelPath) {
      console.log(`[StageModelViewer] Stage ${stage} -> Path: ${modelPath}`);
    } else {
      console.warn(`[StageModelViewer] Stage ${stage} -> No path found in STAGE_MODEL_PATHS`);
    }
  }, [stage, modelPath]);
  
  if (!modelPath) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Model not found</p>
          <p className="text-sm">Stage {stage} model is missing</p>
          <p className="text-xs mt-2 text-slate-500">Expected path: {STAGE_MODEL_PATHS[stage] || 'N/A'}</p>
          <p className="text-xs mt-1 text-slate-600">Available stages: {Object.keys(STAGE_MODEL_PATHS).join(', ')}</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full text-slate-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading stage {stage} model...</p>
          <p className="text-xs mt-2 text-slate-500">{modelPath}</p>
        </div>
      </div>
    }>
      <ModelViewer
        key={`stage-${stage}`} // CRITICAL: Stable key ensures remount when stage changes
        url={modelPath}
        enableOrbitControls={true}
        background="dark"
        preserveCameraState={true}
      />
    </Suspense>
  );
}

interface CardData {
  id: string;
  text: string;
  correctPosition: number;
}

const CARDS: CardData[] = [
  {
    id: "card1",
    text: "Grow septum primum",
    correctPosition: 1
  },
  {
    id: "card2",
    text: "Leave an opening between septum primum and endocardial cushions",
    correctPosition: 2
  },
  {
    id: "card3",
    text: "Create an opening in septum primum",
    correctPosition: 3
  },
  {
    id: "card4",
    text: "Fuse septum primum with endocardial cushion",
    correctPosition: 4
  },
  {
    id: "card5",
    text: "Grow septum secundum on the right of septum primum",
    correctPosition: 5
  },
  {
    id: "card6",
    text: "Leave space between parts of septum secundum",
    correctPosition: 6
  },
  {
    id: "card7",
    text: "Grow septum secundum on the left of septum primum",
    correctPosition: -1 // Incorrect option for slot 5
  },
  {
    id: "card8",
    text: "Fuse space between septum secundum",
    correctPosition: -1 // Incorrect option for slot 6
  }
];

// Shuffled display order (not chronological)
const CARDS_SHUFFLED = [
  CARDS[3], // Fuse septum primum with endocardial cushion
  CARDS[0], // Grow septum primum
  CARDS[5], // Leave space between parts of septum secundum
  CARDS[1], // Leave an opening between septum primum and endocardial cushions
  CARDS[4], // Grow septum secundum on the right
  CARDS[6], // Grow septum secundum on the left (incorrect)
  CARDS[2], // Create an opening in septum primum
  CARDS[7], // Fuse space between septum secundum (incorrect)
];

function DraggableCard({ card, isUsed }: { card: CardData; isUsed: boolean }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id: card.id, correctPosition: card.correctPosition },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: !isUsed
  }), [isUsed]);

  return (
    <div
      ref={drag}
      className={`border rounded-lg p-4 transition-all ${
        isUsed
          ? "border-slate-700 bg-slate-800/30 opacity-40 cursor-not-allowed"
          : isDragging
          ? "border-blue-500 bg-blue-500/10 shadow-lg scale-105 cursor-grabbing"
          : "border-slate-600 bg-slate-800/70 hover:border-blue-500 hover:bg-slate-700/70 cursor-grab"
      }`}
    >
      <p className="text-slate-200 text-sm leading-relaxed">{card.text}</p>
      {isUsed && (
        <div className="mt-2 flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-blue-400 font-medium">Placed</span>
        </div>
      )}
    </div>
  );
}

function DropSlot({ 
  slotNumber, 
  placedCard, 
  onDrop, 
  isLocked,
  currentStage
}: { 
  slotNumber: number; 
  placedCard: CardData | null; 
  onDrop: (cardId: string, correctPosition: number) => void;
  isLocked: boolean;
  currentStage: number;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "CARD",
    canDrop: () => !isLocked,
    drop: (item: { id: string; correctPosition: number }) => {
      onDrop(item.id, item.correctPosition);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  }), [isLocked]);

  const isActive = slotNumber === currentStage + 1;
  const isCompleted = placedCard !== null;

  return (
    <div
      ref={drop}
      className={`relative border rounded-lg p-4 min-h-[100px] transition-all ${
        isCompleted
          ? "border-green-500 bg-green-500/10"
          : isActive && canDrop && isOver
          ? "border-blue-400 bg-blue-400/10 shadow-md"
          : isActive
          ? "border-blue-500/50 bg-slate-700/30 border-dashed"
          : "border-slate-700 bg-slate-800/30"
      }`}
    >
      {/* Slot Number */}
      <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
        isCompleted
          ? "bg-green-500 text-white"
          : isActive
          ? "bg-blue-500 text-white"
          : "bg-slate-700 text-slate-400"
      }`}>
        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : slotNumber}
      </div>

      {/* Lock Icon */}
      {isLocked && !isCompleted && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-slate-600" />
        </div>
      )}

      {/* Content */}
      {placedCard ? (
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-200 text-sm leading-relaxed">{placedCard.text}</p>
        </div>
      ) : isActive ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide">
            Drop Stage {slotNumber} Here
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide">
            Stage {slotNumber}
          </p>
        </div>
      )}
    </div>
  );
}

function InteractiveDevelopmentContent({ onComplete }: { onComplete?: () => void }) {
  const [placedCards, setPlacedCards] = useState<{ [key: number]: CardData }>({});
  const [currentStage, setCurrentStage] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Preload stage models on mount
  useEffect(() => {
    preloadStageModels();
  }, []);

  const getStageSpecificError = (expectedStage: number, cardId?: string): string => {
    // Special error messages for specific incorrect cards
    if (cardId === "card7" && expectedStage === 5) {
      return "Oh no! Mind the direction.";
    }
    if (cardId === "card8" && expectedStage === 6) {
      return "No! You have to leave a foramen for interatrial communication!";
    }
    
    // Default error messages for each stage
    switch (expectedStage) {
      case 1:
        return "Start with building a septum";
      case 2:
        return "No! You must maintain interatrial communication.";
      case 3:
        return "No! You must maintain interatrial communication.";
      case 4:
        return "Careful! You could risk an ostium primum atrial septal defect.";
      case 5:
        return "Time to build another muscular septum!";
      default:
        return `Please place the cards in the correct sequential order. Stage ${expectedStage} should be placed next.`;
    }
  };

  const handleDrop = (cardId: string, correctPosition: number) => {
    const expectedPosition = currentStage + 1;
    
    if (correctPosition === expectedPosition) {
      const card = CARDS.find(c => c.id === cardId);
      if (card) {
        setPlacedCards(prev => ({
          ...prev,
          [correctPosition]: card
        }));
        const newStage = currentStage + 1;
        setCurrentStage(newStage);
        setErrorMessage(null);
        
        // Show special message for stage 1 (septum primum growth)
        if (newStage === 1) {
          setSuccessMessage("Yes! The septum primum, located cranially, grows caudally towards the dorsal endocardial cushion.");
          setTimeout(() => setSuccessMessage(null), 7000);
        }
        
        // Show special message for stage 2 (foramen primum remains)
        if (newStage === 2) {
          setSuccessMessage("Yes! This opening is still the foramen primum, maintaining interatrial communication.");
          setTimeout(() => setSuccessMessage(null), 7000);
        }
        
        // Show special message for stage 3 (foramen secundum)
        if (newStage === 3) {
          setSuccessMessage("Yes! This opening, called foramen secundum, is created through apoptosis and allows right-to-left shunting of blood.");
          setTimeout(() => setSuccessMessage(null), 7000);
        }
        
        // Show special message for stage 4 (ASD avoidance)
        if (newStage === 4) {
          setSuccessMessage("Yes! You just avoided an ASD!");
          setTimeout(() => setSuccessMessage(null), 6000);
        }
        
        // Show special message for stage 5 (septum secundum)
        if (newStage === 5) {
          setSuccessMessage("Yes! Septum secundum grows in two parts: superior and inferior.");
          setTimeout(() => setSuccessMessage(null), 7000);
        }
        
        // Show special message for stage 6 (foramen ovale)
        if (newStage === 6) {
          setSuccessMessage("Yes! The space between the two parts of the septum secundum is known as the foramen ovale! The superior portion of the septum primum regresses. The inferior portion of the septum primum persists and acts as a one-way valve, allowing blood to flow from the right atrium into the left atrium.");
          setTimeout(() => setSuccessMessage(null), 10000);
        }
        
        // Show completion modal when all stages are complete
        if (newStage === 6) {
          setTimeout(() => setShowCompletionModal(true), 10500);
          if (onComplete) {
            onComplete();
          }
        }
      }
    } else {
      setErrorMessage(getStageSpecificError(expectedPosition, cardId));
      setTimeout(() => setErrorMessage(null), 6000);
    }
  };

  const usedCardIds = new Set(Object.values(placedCards).map(card => card.id));

  return (
    <section className="min-h-screen bg-[#0F172A] flex relative">
      {/* Error Message Overlay - Center of Screen */}
      {errorMessage && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-red-500/95 border-2 border-red-400 rounded-xl p-6 shadow-[0_0_40px_rgba(239,68,68,0.6)] max-w-md mx-4 pointer-events-auto animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-1 flex items-center gap-2">❌ Oops! Not quite right!</h3>
                <p className="text-white text-base leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Overlay - Center of Screen */}
      {successMessage && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500/95 border-2 border-green-400 rounded-xl p-6 shadow-[0_0_40px_rgba(34,197,94,0.6)] max-w-md mx-4 pointer-events-auto animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-1 flex items-center gap-2">🎉 Perfect! Great job!</h3>
                <p className="text-white text-base leading-relaxed">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal Overlay */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black border-2 border-blue-500 rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={() => setShowCompletionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500">
                <CheckCircle2 className="w-12 h-12 text-blue-400" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
              Congratulations! You successfully built the atrial septum!
            </h2>

            {/* Educational Content */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
              <div className="space-y-3 text-slate-200 leading-relaxed">
                <p className="text-base">
                  Now, the superior portion of the septum primum will regress. The inferior portion of the septum primum persists and acts as a <span className="font-semibold text-blue-400">one-way valve</span>, allowing blood to flow from the right atrium into the left atrium.
                </p>
                
                <p className="text-base">
                  Closure of the foramen ovale occurs shortly after birth, when the left atrial pressure increases (due to loss of low resistance placental circulation) and the right atrial pressure decreases (due to increased pulmonary circulation upon lung inflation).
                </p>
                
                <p className="text-base">
                  The septum secundum completely fuses with the remnant of the septum primum to form the atrial septum during infancy.
                </p>
                
                <p className="text-base font-semibold text-blue-400">
                  The formation of the atrial septum is complete and there is no further interatrial communication!
                </p>
              </div>
            </div>

            {/* Continue Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Column: 3D Stage Model */}
      <div className="w-1/3 flex flex-col p-6">
        <div className="flex-1 bg-black rounded-xl overflow-hidden relative shadow-lg border border-slate-700" style={{ minHeight: '600px' }}>
          {/* 3D GLB Stage Model Viewer */}
          <div className="w-full h-full" style={{ height: '100%', minHeight: '600px' }}>
            <StageModelViewer stage={currentStage} />
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
            <div className="mb-3">
              <h3 className="text-slate-100 text-lg font-semibold">Developmental Sequence</h3>
              <p className="text-slate-400 text-sm">
                {currentStage === 0 && "Start by placing Stage 1"}
                {currentStage === 1 && "Septum primum descending..."}
                {currentStage === 2 && "Ostium primum remains open..."}
                {currentStage === 3 && "Foramen secundum forming..."}
                {currentStage === 4 && "Ostium primum closing..."}
                {currentStage === 5 && "Septum secundum descending..."}
                {currentStage === 6 && "Foramen ovale established!"}
              </p>
            </div>
            
            {/* Progress Indicators */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((stage) => (
                <div key={stage} className="flex-1">
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    stage <= currentStage
                      ? "bg-blue-500"
                      : "bg-slate-700"
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Column: Drop Slots */}
      <div className="w-1/3 flex flex-col p-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 flex-1 overflow-y-auto shadow-md">
          <div className="mb-6 pb-4 border-b border-slate-700">
            <h2 className="text-slate-100 text-xl font-bold mb-2">Embryologic Sequence</h2>
            <p className="text-slate-400 text-sm">
              Drag and drop the developmental stages in the correct order
            </p>
          </div>

          <div className="space-y-4">
            {/* Stage 0 - Starting Point */}
            <div className="relative border border-blue-500 rounded-lg p-4 bg-blue-500/10">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-blue-500 text-white">
                0
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-blue-200 text-sm leading-relaxed">
                  The atria are currently communicating though the foramen primum
                </p>
              </div>
            </div>

            {[1, 2, 3, 4, 5, 6].map((slotNumber) => (
              <DropSlot
                key={slotNumber}
                slotNumber={slotNumber}
                placedCard={placedCards[slotNumber] || null}
                onDrop={handleDrop}
                isLocked={slotNumber !== currentStage + 1}
                currentStage={currentStage}
              />
            ))}
          </div>

          {/* Completion Message */}
          {currentStage === 6 && (
            <div className="mt-4 bg-blue-500/10 border border-blue-500 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-blue-400 font-bold text-base">Sequence Complete!</h3>
                  <p className="text-slate-300 text-sm">You've mastered atrial septation embryology.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Draggable Cards */}
      <div className="w-1/3 flex flex-col p-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 flex-1 overflow-y-auto shadow-md">
          <div className="mb-6 pb-4 border-b border-slate-700">
            <h2 className="text-slate-100 text-xl font-bold mb-2">Developmental Stages</h2>
            <p className="text-slate-400 text-sm">
              {currentStage === 6 ? "All stages placed!" : `Place stage ${currentStage + 1} next`}
            </p>
          </div>

          <div className="space-y-3">
            {CARDS_SHUFFLED.map((card) => (
              <DraggableCard
                key={card.id}
                card={card}
                isUsed={usedCardIds.has(card.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function InteractiveDevelopment({ onComplete }: { onComplete?: () => void }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <InteractiveDevelopmentContent onComplete={onComplete} />
    </DndProvider>
  );
}