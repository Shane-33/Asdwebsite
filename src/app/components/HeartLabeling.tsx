import React, { useState, useEffect, useRef, lazy } from "react";
import { Button } from "@/app/components/ui/button";
import { CheckCircle2, RotateCcw, Bug, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Slider } from "@/app/components/ui/slider";
import confetti from "canvas-confetti";
import { ModelViewerApi, Label3D } from "@/app/components/ModelViewer";
import { heartStructures, getStructureByMeshName, getStructureById, normalizeMeshName } from "@/data/heartStructures";
import { useGLTF } from "@react-three/drei";

// Lazy load ModelViewer to prevent blocking the entire app
const ModelViewer = lazy(() => import("@/app/components/ModelViewer").then(module => ({ default: module.ModelViewer })));

interface PlacedLabel {
  id: string;
  structureId: string;
  position: [number, number, number];
}

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

const stageDescriptions: Record<number, string> = {
  0: "The atria are currently communicating through the foramen primum.",
  1: "Septum primum grows caudally towards the dorsal endocardial cushion.",
  2: "The opening between septum primum and endocardial cushions remains open (foramen primum).",
  3: "An opening is created in septum primum (foramen secundum) through apoptosis.",
  4: "Septum primum fuses with the endocardial cushion, closing the foramen primum.",
  5: "Septum secundum grows on the right of septum primum in two parts: superior and inferior.",
  6: "The space between the two parts of septum secundum forms the foramen ovale. The superior portion of septum primum regresses, while the inferior portion persists as a one-way valve.",
};

interface HeartLabelingProps {
  onComplete?: () => void;
}

// Preload developmental models
const preloadDevelopmentalModels = () => {
  const urls = Array.from({ length: 6 }, (_, i) => `/models/week5/dev/s${i}.glb`);
  urls.forEach((url) => {
    try {
      useGLTF.preload(url);
    } catch (error) {
      console.warn(`Failed to preload ${url}:`, error);
    }
  });
};

export function HeartLabeling({ onComplete }: HeartLabelingProps) {
  const [activeTab, setActiveTab] = useState<"structures" | "sequence">("structures");
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
  const [placedLabels, setPlacedLabels] = useState<PlacedLabel[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const viewerApiRef = useRef<ModelViewerApi | null>(null);
  const [devStage, setDevStage] = useState(0);
  const [isDevMode] = useState(() => {
    try {
      return import.meta.env.DEV || process.env.NODE_ENV === 'development';
    } catch {
      return false;
    }
  });

  // Preload models on mount
  useEffect(() => {
    // Preload 4-chamber model
    try {
      useGLTF.preload("/models/week5/heart_4chamber.glb");
    } catch (error) {
      console.warn('Failed to preload 4-chamber model:', error);
    }

    // Preload developmental models
    preloadDevelopmentalModels();
  }, []);

  // Show toast message
  const showToastMessage = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const modelUrl = activeTab === "structures" 
    ? "/models/week5/heart_4chamber.glb"
    : `/models/week5/dev/s${devStage}.glb`;

  // Get highlight mesh names for selected structure
  const highlightMeshNames = selectedStructureId 
    ? (() => {
        const structure = getStructureById(selectedStructureId);
        if (structure) {
          return Array.isArray(structure.meshName) ? structure.meshName : [structure.meshName];
        }
        return [];
      })()
    : [];

  // Convert placed labels to 3D format for rendering
  const labels3D: Label3D[] = placedLabels.map((label) => {
    const structure = getStructureById(label.structureId);
    return {
      id: label.id,
      text: structure?.displayName || label.structureId,
      color: structure?.color || "#10B981",
      position: label.position,
    };
  });

  const handleStructureClick = (structureId: string) => {
    // Check if already placed
    const isPlaced = placedLabels.some(label => label.structureId === structureId);
    if (!isPlaced) {
      setSelectedStructureId(structureId);
    }
  };

  const handleModelPick = (hit: { point: [number, number, number]; objectName: string }) => {
    if (activeTab !== "structures") return;

    if (!selectedStructureId) {
      showToastMessage("Select a structure first");
      return;
    }

    // Normalize mesh name and find matching structure
    const normalized = normalizeMeshName(hit.objectName);
    const clickedStructure = getStructureByMeshName(normalized);

    // Check if clicked structure matches selected structure
    if (clickedStructure && clickedStructure.id === selectedStructureId) {
      // Place the label
      const newLabel: PlacedLabel = {
        id: `label-${Date.now()}-${Math.random()}`,
        structureId: selectedStructureId,
        position: hit.point,
      };

      setPlacedLabels([...placedLabels, newLabel]);
      setSelectedStructureId(null); // Clear selection after placing
    } else if (clickedStructure) {
      // Wrong structure clicked
      showToastMessage(`Wrong structure. You selected: ${getStructureById(selectedStructureId)?.displayName}`);
    } else {
      // Unknown structure - still allow placement
      const newLabel: PlacedLabel = {
        id: `label-${Date.now()}-${Math.random()}`,
        structureId: selectedStructureId,
        position: hit.point,
      };

      setPlacedLabels([...placedLabels, newLabel]);
      setSelectedStructureId(null);
    }
  };

  const handleCheckLabels = () => {
    const allPlaced = heartStructures.every(structure => 
      placedLabels.some(label => label.structureId === structure.id)
    );

    if (allPlaced) {
      setShowResults(true);
      onComplete?.();
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#6EE7B7']
      });
    } else {
      showToastMessage("Please place all labels before checking");
    }
  };

  const handleReset = () => {
    setPlacedLabels([]);
    setSelectedStructureId(null);
    setShowResults(false);
    if (viewerApiRef.current) {
      viewerApiRef.current.resetView();
    }
  };

  const handleClearSelection = () => {
    setSelectedStructureId(null);
  };

  const handleLogMeshNames = () => {
    if (viewerApiRef.current) {
      viewerApiRef.current.logMeshNames();
    }
  };

  const allLabelsPlaced = heartStructures.every(structure => 
    placedLabels.some(label => label.structureId === structure.id)
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Toast Message */}
        {showToast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="bg-blue-500/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-blue-400 shadow-lg flex items-center gap-3">
              <p className="text-sm text-white font-medium">{showToast}</p>
              <button
                onClick={() => setShowToast(null)}
                className="text-white hover:text-blue-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <span className="text-emerald-300 font-medium">Week 5 Heart Structure</span>
          </div>
          <h2 className="text-4xl text-slate-100 mb-4">
            Label the Cardiac Structures
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Explore the 4-chamber heart configuration and developmental sequence.
          </p>
        </div>

        {/* Progress indicator */}
        {activeTab === "structures" && (
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="text-sm text-slate-400">
              Labels Placed: {placedLabels.length} / {heartStructures.length}
            </div>
            <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${(placedLabels.length / heartStructures.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: 3D Model Viewport */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
                {/* Viewport header */}
                <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-100">Week 5 Heart</h3>
                    <p className="text-sm text-slate-400">
                      {activeTab === "structures" ? "4-Chamber Configuration" : `Stage ${devStage}/6`}
                    </p>
                  </div>
                  <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/30">
                    3D Model
                  </div>
                </div>

                {/* 3D Model - Fixed height container */}
                <div 
                  className="relative bg-slate-950" 
                  style={{ 
                    height: typeof window !== 'undefined' && window.innerWidth < 1024 
                      ? '320px' 
                      : '480px',
                    pointerEvents: 'auto'
                  }}
                >
                  <React.Suspense fallback={
                    <div className="flex items-center justify-center h-full text-slate-400">
                      Loading 3D model...
                    </div>
                  }>
                    <ModelViewer
                      url={modelUrl}
                      enableOrbitControls={true}
                      background="dark"
                      onPick={activeTab === "structures" ? handleModelPick : undefined}
                      exposeApi={(api) => {
                        viewerApiRef.current = api;
                      }}
                      labels={activeTab === "structures" ? labels3D : []}
                      preserveCameraState={activeTab === "sequence"}
                      highlightMeshNames={activeTab === "structures" ? highlightMeshNames : []}
                      dimOthers={activeTab === "structures" && selectedStructureId !== null}
                    />
                  </React.Suspense>

                  {/* Caption */}
                  <div className="absolute bottom-4 right-4 text-xs text-slate-400 z-10" style={{ pointerEvents: 'none' }}>
                    Rotate, zoom, pan
                  </div>
                </div>

                {/* Info bar */}
                <div className="bg-emerald-500/10 px-6 py-3 border-t border-emerald-500/20">
                  <p className="text-sm text-emerald-300">
                    <span className="font-semibold">Note:</span>{" "}
                    {activeTab === "structures" 
                      ? "Click on a structure to select it, then click on the 3D model to place the label."
                      : "Use the slider to explore different developmental stages."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Tabs Panel */}
          <div className="order-1 lg:order-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700/50">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "structures" | "sequence")}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="structures" className="flex-1">Cardiac Structures</TabsTrigger>
                  <TabsTrigger value="sequence" className="flex-1">Developmental Sequence</TabsTrigger>
                </TabsList>

                <TabsContent value="structures">
                  {showResults && allLabelsPlaced ? (
                    /* Success State */
                    <div>
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h3 className="text-3xl text-slate-100 mb-4">Excellent Work!</h3>
                        <p className="text-lg text-slate-300 mb-6">
                          You've successfully labeled all the cardiac structures at Week 5 of development.
                        </p>
                      </div>

                      <div className="bg-slate-700/30 rounded-xl p-6 mb-6 border border-slate-600/50">
                        <h4 className="font-semibold text-slate-200 mb-3">Structures Labeled:</h4>
                        <div className="space-y-2">
                          {heartStructures.map((structure) => {
                            const isPlaced = placedLabels.some(label => label.structureId === structure.id);
                            return (
                              <div key={structure.id} className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: structure.color }}
                                />
                                <span className="text-slate-300">{structure.displayName}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

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
                    <div>
                      <div className="mb-6">
                        <h3 className="text-2xl text-slate-100 mb-2">Cardiac Structures</h3>
                        <p className="text-slate-300">
                          Click on a structure to select it, then click on the 3D model to place the label.
                        </p>
                      </div>

                      {/* Label Buttons */}
                      <div className="space-y-3 mb-6">
                        {heartStructures.map((structure) => {
                          const isPlaced = placedLabels.some(label => label.structureId === structure.id);
                          const isSelected = selectedStructureId === structure.id;
                          const colorAlpha = isSelected ? '20' : '10';
                          const borderAlpha = isSelected ? '50' : '30';

                          return (
                            <button
                              key={structure.id}
                              onClick={() => handleStructureClick(structure.id)}
                              disabled={isPlaced}
                              className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                                isPlaced
                                  ? 'border-slate-700 bg-slate-700/30 cursor-not-allowed opacity-60'
                                  : isSelected
                                  ? 'shadow-lg'
                                  : 'hover:border-slate-600 hover:bg-slate-700/30 cursor-pointer'
                              }`}
                              style={{
                                backgroundColor: isSelected ? `${structure.color}${colorAlpha}` : undefined,
                                borderColor: isSelected ? `${structure.color}${borderAlpha}` : undefined,
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {/* Color dot */}
                                  <div 
                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: structure.color }}
                                  />
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-400 text-sm font-semibold">{structure.abbr}</span>
                                    <span className="text-slate-200 font-medium">{structure.displayName}</span>
                                  </div>
                                </div>
                                {isPlaced && (
                                  <span 
                                    className="text-xs px-2 py-1 rounded-full font-medium"
                                    style={{ 
                                      backgroundColor: `${structure.color}20`,
                                      color: structure.color,
                                      border: `1px solid ${structure.color}40`
                                    }}
                                  >
                                    Placed
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="mb-6 text-xs text-slate-400 italic">
                        Colors correspond to label markers.
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
                          {allLabelsPlaced ? 'Check My Labels' : `Place ${heartStructures.length - placedLabels.length} more label${heartStructures.length - placedLabels.length !== 1 ? 's' : ''}`}
                        </Button>

                        <div className="flex gap-3">
                          <Button
                            onClick={handleReset}
                            variant="outline"
                            className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-200 py-4 rounded-xl border border-slate-600"
                          >
                            Reset All Labels
                          </Button>

                          {selectedStructureId && (
                            <Button
                              onClick={handleClearSelection}
                              variant="outline"
                              className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-200 py-4 rounded-xl border border-slate-600"
                            >
                              Clear Selection
                            </Button>
                          )}
                        </div>

                        {isDevMode && (
                          <Button
                            onClick={handleLogMeshNames}
                            variant="outline"
                            className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-200 py-4 rounded-xl border border-slate-600"
                          >
                            <Bug className="w-4 h-4 mr-2" />
                            Log Mesh Names (Dev)
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="sequence">
                  <div>
                    <div className="mb-6">
                      <h3 className="text-2xl text-slate-100 mb-2">Developmental Sequence</h3>
                      <p className="text-slate-300">
                        Explore the stages of atrial septation development.
                      </p>
                    </div>

                    {/* Stage Indicator */}
                    <div className="mb-6">
                      <div className="text-center mb-4">
                        <span className="text-3xl font-bold text-slate-100">Stage {devStage} / 6</span>
                      </div>
                      
                      {/* Slider */}
                      <div className="px-2">
                        <Slider
                          value={[devStage]}
                          onValueChange={(values) => setDevStage(values[0])}
                          min={0}
                          max={5}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-2 text-xs text-slate-400">
                          {[0, 1, 2, 3, 4, 5].map((stage) => (
                            <span key={stage}>{stage}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
                      <p className="text-slate-200 leading-relaxed">
                        {stageDescriptions[devStage] || "No description available for this stage."}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
