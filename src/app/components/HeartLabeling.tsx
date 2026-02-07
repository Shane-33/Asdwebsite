import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { CheckCircle2, XCircle, RotateCw, ZoomIn, RotateCcw, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import confetti from "canvas-confetti";

interface LabelPoint {
  id: string;
  name: string;
  x: number; // percentage position
  y: number; // percentage position
  placed: boolean;
}

const structureLabels: LabelPoint[] = [
  { id: "ra", name: "Right Atrium", x: 65, y: 35, placed: false },
  { id: "la", name: "Left Atrium", x: 35, y: 35, placed: false },
  { id: "rv", name: "Right Ventricle", x: 60, y: 65, placed: false },
  { id: "lv", name: "Left Ventricle", x: 40, y: 65, placed: false },
  { id: "ta", name: "Truncus Arteriosus", x: 50, y: 20, placed: false },
  { id: "bc", name: "Bulbus Cordis", x: 50, y: 45, placed: false },
];

const structureInfo: Record<string, { develops: string; description: string }> = {
  ta: {
    develops: "Aorta & Pulmonary Trunk",
    description: "The truncus arteriosus divides to form the ascending aorta and pulmonary trunk, establishing separate systemic and pulmonary circulations."
  },
  bc: {
    develops: "Right Ventricular Outflow Tract",
    description: "The bulbus cordis gives rise to the smooth outflow portions of both ventricles, including the infundibulum (conus arteriosus) of the right ventricle."
  }
};

interface HeartLabelingProps {
  onComplete?: () => void;
}

export function HeartLabeling({ onComplete }: HeartLabelingProps) {
  const [labels, setLabels] = useState<LabelPoint[]>(structureLabels);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleLabelClick = (id: string) => {
    setSelectedLabel(id);
  };

  const handleModelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedLabel) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setLabels(labels.map(label => 
      label.id === selectedLabel 
        ? { ...label, placed: true }
        : label
    ));
    setSelectedLabel(null);
  };

  const handleCheckLabels = () => {
    setShowResults(true);
    onComplete?.();
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#34D399', '#6EE7B7']
    });
  };

  const handleReset = () => {
    setLabels(structureLabels);
    setSelectedLabel(null);
    setShowResults(false);
  };

  const allLabelsPlaced = labels.every(label => label.placed);
  const placedLabels = labels.filter(label => label.placed);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <span className="text-emerald-300 font-medium">Week 5 Heart Structure</span>
          </div>
          <h2 className="text-4xl text-slate-100 mb-4">
            Label the Cardiac Structures
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Click on a structure name below, then click on the 3D model to place the label at the correct location.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="text-sm text-slate-400">
            Labels Placed: {placedLabels.length} / {labels.length}
          </div>
          <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${(placedLabels.length / labels.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: 3D Model Viewport */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
                {/* Viewport header */}
                <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-100">Week 5 Heart</h3>
                    <p className="text-sm text-slate-400">4-Chamber Configuration</p>
                  </div>
                  <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/30">
                    3D Model
                  </div>
                </div>

                {/* 3D Model - Interactive Labeling Area */}
                <div 
                  className="aspect-square bg-slate-950 relative cursor-crosshair"
                  onClick={handleModelClick}
                >
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1628771065518-0d82f1938462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFydCUyMGFuYXRvbXl8ZW58MHx8fHwxNzM4MzQ3NTM3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Week 5 Heart 3D Model"
                    className="w-full h-full object-cover opacity-30"
                  />

                  {/* Instruction overlay */}
                  {selectedLabel && (
                    <div className="absolute top-6 left-6 right-6 bg-blue-500/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-blue-400 animate-pulse">
                      <p className="text-sm text-white font-medium">
                        Click on the model to place: {labels.find(l => l.id === selectedLabel)?.name}
                      </p>
                    </div>
                  )}

                  {/* Placed Labels */}
                  {labels.filter(l => l.placed).map((label) => (
                    <div
                      key={label.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${label.x}%`, top: `${label.y}%` }}
                    >
                      <div className="relative">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-emerald-500/50 shadow-lg">
                          <p className="text-xs text-emerald-300 font-medium">{label.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 3D Controls */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 border border-slate-700/50 text-slate-300"
                      title="Rotate"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 border border-slate-700/50 text-slate-300"
                      title="Zoom"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 border border-slate-700/50 text-slate-300"
                      title="Reset View"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Info bar */}
                <div className="bg-emerald-500/10 px-6 py-3 border-t border-emerald-500/20">
                  <p className="text-sm text-emerald-300">
                    <span className="font-semibold">Note:</span> Your 3D Blender model of the Week 5 heart will be integrated here.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Label Selection & Results */}
          <div className="order-1 lg:order-2">
            {showResults && allLabelsPlaced ? (
              /* Success State */
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-2 border-emerald-500/50">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl text-slate-100 mb-4">
                    Excellent Work!
                  </h3>
                  <p className="text-lg text-slate-300 mb-6">
                    You've successfully labeled all the cardiac structures at Week 5 of development.
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-6 mb-6 border border-slate-600/50">
                  <h4 className="font-semibold text-slate-200 mb-3">Structures Labeled:</h4>
                  <div className="space-y-2">
                    {labels.map((label) => (
                      <div key={label.id} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300">{label.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Developmental Fate Information */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 rounded-xl p-5 border border-blue-500/30">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-400 font-bold text-xs">TA</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-blue-300 mb-1">Truncus Arteriosus</h5>
                        <p className="text-sm text-blue-200 mb-2">
                          <span className="font-semibold">Develops into:</span> {structureInfo.ta.develops}
                        </p>
                        <p className="text-xs text-blue-200/80 leading-relaxed">
                          {structureInfo.ta.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-xl p-5 border border-purple-500/30">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-400 font-bold text-xs">BC</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-purple-300 mb-1">Bulbus Cordis</h5>
                        <p className="text-sm text-purple-200 mb-2">
                          <span className="font-semibold">Develops into:</span> {structureInfo.bc.develops}
                        </p>
                        <p className="text-xs text-purple-200/80 leading-relaxed">
                          {structureInfo.bc.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/10 rounded-xl p-6 mb-6 border border-emerald-500/30">
                  <h4 className="font-semibold text-emerald-300 mb-2">Key Concept</h4>
                  <p className="text-sm text-emerald-200 leading-relaxed">
                    At Week 5, the heart has partitioned into four distinct chambers. Understanding these primitive structures and their developmental fates is crucial before examining how the atrial septum forms.
                  </p>
                </div>
              </div>
            ) : (
              /* Labeling Interface */
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700/50">
                <div className="mb-6">
                  <h3 className="text-2xl text-slate-100 mb-2">
                    Cardiac Structures
                  </h3>
                  <p className="text-slate-300">
                    Click on a structure to select it, then click on the 3D model to place the label.
                  </p>
                </div>

                {/* Label Buttons */}
                <div className="space-y-3 mb-6">
                  {labels.map((label) => (
                    <button
                      key={label.id}
                      onClick={() => handleLabelClick(label.id)}
                      disabled={label.placed}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                        label.placed
                          ? 'border-emerald-500 bg-emerald-500/10 cursor-not-allowed'
                          : selectedLabel === label.id
                          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                          : 'border-slate-700 hover:border-slate-600 hover:bg-slate-700/30 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            label.placed
                              ? 'bg-emerald-500 text-white'
                              : selectedLabel === label.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {label.placed ? <CheckCircle2 className="w-5 h-5" /> : label.id.toUpperCase().substring(0, 2)}
                          </div>
                          <span className="text-slate-200 font-medium">{label.name}</span>
                        </div>
                        {label.placed && (
                          <span className="text-xs text-emerald-400">Placed</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleCheckLabels}
                    disabled={!allLabelsPlaced}
                    className={`w-full py-4 rounded-xl font-medium transition-all ${
                      allLabelsPlaced
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600'
                    }`}
                  >
                    {allLabelsPlaced ? 'Check My Labels' : `Place ${labels.length - placedLabels.length} more label${labels.length - placedLabels.length !== 1 ? 's' : ''}`}
                  </Button>

                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-200 py-4 rounded-xl border border-slate-600"
                  >
                    Reset All Labels
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}