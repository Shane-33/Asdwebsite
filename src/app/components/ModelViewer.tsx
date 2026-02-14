import React, { Suspense, useRef, useEffect, useState, forwardRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useProgress, Html } from '@react-three/drei';
import { Button } from '@/app/components/ui/button';
import { RotateCcw, AlertCircle } from 'lucide-react';
import * as THREE from 'three';

export interface Label3D {
  id: string;
  text: string;
  color: string;
  position: [number, number, number];
}

export interface PickResult {
  point: [number, number, number];
  objectName: string;
}

export interface ModelViewerProps {
  url: string;
  enableOrbitControls?: boolean;
  background?: 'light' | 'dark';
  onPick?: (hit: PickResult) => void;
  exposeApi?: (api: ModelViewerApi) => void;
  labels?: Label3D[];
  preserveCameraState?: boolean;
  highlightMeshNames?: string[];
  dimOthers?: boolean;
}

export interface ModelViewerApi {
  resetView: () => void;
  logMeshNames: () => void;
  getMeshNames: () => string[];
  getCameraState: () => CameraState | null;
  setCameraState: (state: CameraState) => void;
}

export interface CameraState {
  target: [number, number, number];
  position: [number, number, number];
  zoom: number;
}

// Camera state storage (shared across model switches)
const cameraStateRef = { current: null as CameraState | null };

// Material cache for highlighting
interface MaterialCache {
  originalEmissive: THREE.Color;
  originalColor: THREE.Color;
  originalOpacity: number;
}

const materialCache = new Map<string, MaterialCache>();

// Internal component that handles the 3D scene
function SceneContent({
  url,
  enableOrbitControls = true,
  background = 'dark',
  onPick,
  apiRef,
  labels = [],
  preserveCameraState = false,
  highlightMeshNames = [],
  dimOthers = true,
}: {
  url: string;
  enableOrbitControls: boolean;
  background: 'light' | 'dark';
  onPick?: (hit: PickResult) => void;
  apiRef: React.MutableRefObject<ModelViewerApi | null> | React.RefObject<ModelViewerApi | null>;
  labels?: Label3D[];
  preserveCameraState?: boolean;
  highlightMeshNames?: string[];
  dimOthers?: boolean;
}) {
  const gltf = useGLTF(url);
  const scene = gltf.scene;
  const controlsRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const initialCameraStateRef = useRef<CameraState | null>(null);
  const hasAutoFittedRef = useRef(false);

  const { camera, gl } = useThree();

  // Helper to normalize mesh names for comparison
  const normalizeName = (name: string): string => {
    return name.trim().replace(/\s+/g, '').replace(/_/g, '').toLowerCase();
  };

  // Apply highlighting to meshes
  useEffect(() => {
    if (!scene || highlightMeshNames.length === 0) {
      // Restore all materials
      materialCache.forEach((cache, uuid) => {
        const material = scene.getObjectByProperty('uuid', uuid) as THREE.Mesh;
        if (material && material.material) {
          const mat = material.material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.emissive.copy(cache.originalEmissive);
            mat.color.copy(cache.originalColor);
            mat.opacity = cache.originalOpacity;
            mat.needsUpdate = true;
          }
        }
      });
      materialCache.clear();
      return;
    }

    const normalizedHighlight = highlightMeshNames.map(n => normalizeName(n));

    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material) {
        const mat = object.material as THREE.MeshStandardMaterial;
        if (!mat) return;

        const objectName = normalizeName(object.name || '');
        const isHighlighted = normalizedHighlight.some(h => 
          objectName.includes(h) || h.includes(objectName)
        );

        // Cache original material if not cached
        if (!materialCache.has(object.uuid)) {
          materialCache.set(object.uuid, {
            originalEmissive: mat.emissive.clone(),
            originalColor: mat.color.clone(),
            originalOpacity: mat.opacity,
          });
        }

        const cache = materialCache.get(object.uuid)!;

        if (isHighlighted) {
          // Subtle highlight: slight emissive boost and lighten
          mat.emissive.setHex(0x333333); // Subtle gray emissive
          mat.color.lerp(new THREE.Color(0xffffff), 0.15); // Slight lighten
          mat.opacity = 1.0;
        } else if (dimOthers) {
          // Dim non-highlighted: reduce opacity slightly
          mat.color.copy(cache.originalColor);
          mat.emissive.copy(cache.originalEmissive);
          mat.opacity = Math.max(0.4, cache.originalOpacity * 0.6);
        } else {
          // Restore original
          mat.emissive.copy(cache.originalEmissive);
          mat.color.copy(cache.originalColor);
          mat.opacity = cache.originalOpacity;
        }

        mat.needsUpdate = true;
      }
    });

    return () => {
      // Cleanup on unmount or when highlights change
    };
  }, [scene, highlightMeshNames, dimOthers]);

  // Restore camera state if preserved
  useEffect(() => {
    if (preserveCameraState && cameraStateRef.current && controlsRef.current) {
      const state = cameraStateRef.current;
      camera.position.set(...state.position);
      controlsRef.current.target.set(...state.target);
      if (camera.zoom !== undefined) {
        camera.zoom = state.zoom;
        camera.updateProjectionMatrix();
      }
      controlsRef.current.update();
      hasAutoFittedRef.current = true;
    }
  }, [preserveCameraState, camera]);

  // Store initial camera state after first render
  useEffect(() => {
    if (controlsRef.current && !initialCameraStateRef.current) {
      const controls = controlsRef.current;
      initialCameraStateRef.current = {
        position: [camera.position.x, camera.position.y, camera.position.z] as [number, number, number],
        target: [controls.target.x, controls.target.y, controls.target.z] as [number, number, number],
        zoom: camera.zoom || 1,
      };
    }
  }, [camera]);

  // Save camera state on change (for preservation)
  useEffect(() => {
    if (preserveCameraState && controlsRef.current) {
      const saveState = () => {
        const controls = controlsRef.current;
        if (controls) {
          cameraStateRef.current = {
            position: [camera.position.x, camera.position.y, camera.position.z] as [number, number, number],
            target: [controls.target.x, controls.target.y, controls.target.z] as [number, number, number],
            zoom: camera.zoom || 1,
          };
        }
      };

      const interval = setInterval(saveState, 100);
      return () => clearInterval(interval);
    }
  }, [preserveCameraState, camera]);

  // Expose API methods
  useEffect(() => {
    if (apiRef) {
      apiRef.current = {
        resetView: () => {
          if (controlsRef.current && initialCameraStateRef.current) {
            const controls = controlsRef.current;
            const state = initialCameraStateRef.current;
            camera.position.set(...state.position);
            controls.target.set(...state.target);
            if (camera.zoom !== undefined) {
              camera.zoom = state.zoom;
              camera.updateProjectionMatrix();
            }
            controls.update();
          }
        },
        logMeshNames: () => {
          printSceneGraph(scene);
        },
        getMeshNames: () => {
          return getMeshNames(scene);
        },
        getCameraState: () => {
          if (controlsRef.current) {
            return {
              position: [camera.position.x, camera.position.y, camera.position.z] as [number, number, number],
              target: [controlsRef.current.target.x, controlsRef.current.target.y, controlsRef.current.target.z] as [number, number, number],
              zoom: camera.zoom || 1,
            };
          }
          return null;
        },
        setCameraState: (state: CameraState) => {
          if (controlsRef.current) {
            camera.position.set(...state.position);
            controlsRef.current.target.set(...state.target);
            if (camera.zoom !== undefined) {
              camera.zoom = state.zoom;
              camera.updateProjectionMatrix();
            }
            controlsRef.current.update();
          }
        },
      };
    }
  }, [apiRef, scene, camera]);

  // Auto-fit model to view (only if not preserving state)
  useEffect(() => {
    if (!preserveCameraState && groupRef.current && scene && !hasAutoFittedRef.current) {
      try {
        const box = new THREE.Box3().setFromObject(groupRef.current);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const distance = maxDim * 2.5;

        if (maxDim > 0) {
          camera.position.set(center.x, center.y, center.z + distance);
          if (controlsRef.current) {
            controlsRef.current.target.copy(center);
            controlsRef.current.update();
          }
          
          // Store initial state after auto-fit
          if (!initialCameraStateRef.current && controlsRef.current) {
            initialCameraStateRef.current = {
              position: [camera.position.x, camera.position.y, camera.position.z] as [number, number, number],
              target: [controlsRef.current.target.x, controlsRef.current.target.y, controlsRef.current.target.z] as [number, number, number],
              zoom: camera.zoom || 1,
            };
          }
          hasAutoFittedRef.current = true;
        }
      } catch (error) {
        console.warn('Failed to auto-fit model:', error);
      }
    }
  }, [scene, camera, preserveCameraState]);

  // Handle pointer events on the scene using R3F events
  const handlePointerDown = (event: any) => {
    if (onPick) {
      event.stopPropagation();
      
      if (event.point) {
        const object = event.object;
        
        // Find mesh name by walking up parent chain
        let meshName = '';
        let current: THREE.Object3D | null = object;
        while (current) {
          if (current.name && current.name.trim() !== '') {
            meshName = current.name;
            break;
          }
          current = current.parent;
        }
        
        if (meshName) {
          onPick({
            point: [
              event.point.x,
              event.point.y,
              event.point.z,
            ],
            objectName: meshName,
          });
        }
      }
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <hemisphereLight intensity={0.2} />
      
      <group 
        ref={groupRef}
        onPointerDown={onPick ? handlePointerDown : undefined}
      >
        <primitive object={scene} />
      </group>

      {/* Render 3D labels */}
      {labels.map((label) => (
        <Html
          key={label.id}
          position={label.position}
          center
          transform
          occlude
          style={{ pointerEvents: 'none' }}
        >
          <div 
            className="bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full border shadow-lg flex items-center gap-2"
            style={{ 
              borderColor: `${label.color}80`,
            }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: label.color }}
            />
            <p className="text-xs text-white font-medium whitespace-nowrap">{label.text}</p>
          </div>
        </Html>
      ))}

      {enableOrbitControls && (
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
          minDistance={0.5}
          maxDistance={10}
        />
      )}
    </>
  );
}

// Loading component
function LoadingOverlay() {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <div className="bg-slate-900/90 backdrop-blur-sm px-6 py-4 rounded-lg border border-slate-700 text-center">
        <div className="text-slate-200 mb-2">Loading model...</div>
        <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-slate-400 text-sm mt-2">{Math.round(progress)}%</div>
      </div>
    </Html>
  );
}

// Error component
function ErrorOverlay({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
      <div className="bg-red-900/90 border-2 border-red-500 rounded-xl p-6 max-w-md mx-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-red-200 font-bold text-lg mb-2">Model failed to load</h3>
        <p className="text-red-300 text-sm">{message}</p>
        <p className="text-red-400 text-xs mt-4">
          Make sure the GLBs exist in public/models/week5.
        </p>
      </div>
    </div>
  );
}

// Debug utilities
function printSceneGraph(scene: THREE.Group, indent = 0): void {
  const prefix = '  '.repeat(indent);
  console.log(`${prefix}${scene.name || 'Scene'}`);
  
  scene.children.forEach((child) => {
    if (child instanceof THREE.Group) {
      printSceneGraph(child, indent + 1);
    } else if (child instanceof THREE.Mesh) {
      console.log(`${prefix}  └─ Mesh: ${child.name || 'Unnamed'}`);
    } else {
      console.log(`${prefix}  └─ ${child.type}: ${child.name || 'Unnamed'}`);
    }
  });
  
  // Also print flat list of meshes
  console.log('\n--- Flat list of meshes with names ---');
  const meshNames = getMeshNames(scene);
  meshNames.forEach((name, index) => {
    console.log(`${index + 1}. ${name}`);
  });
  console.log(`\nTotal meshes with names: ${meshNames.length}`);
}

function getMeshNames(scene: THREE.Group): string[] {
  const names: string[] = [];
  
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh && object.name) {
      names.push(object.name);
    }
  });
  
  return names;
}

// Export debug utilities
export { printSceneGraph, getMeshNames };

// Main ModelViewer component
export const ModelViewer = forwardRef<ModelViewerApi, ModelViewerProps>(
  ({ url, enableOrbitControls = true, background = 'dark', onPick, exposeApi, labels = [], preserveCameraState = false, highlightMeshNames = [], dimOthers = true }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const apiRef = useRef<ModelViewerApi | null>(null);

    useEffect(() => {
      if (exposeApi && apiRef.current) {
        exposeApi(apiRef.current);
      }
    }, [exposeApi, apiRef.current]);

    const handleReset = () => {
      if (apiRef.current) {
        apiRef.current.resetView();
      }
    };

    return (
      <div className="relative w-full h-full bg-slate-950" style={{ pointerEvents: 'auto' }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
        >
          <Suspense fallback={<LoadingOverlay />}>
            <SceneContent
              url={url}
              enableOrbitControls={enableOrbitControls}
              background={background as 'light' | 'dark'}
              onPick={onPick}
              apiRef={apiRef}
              labels={labels}
              preserveCameraState={preserveCameraState}
              highlightMeshNames={highlightMeshNames}
              dimOthers={dimOthers}
            />
          </Suspense>
        </Canvas>

        {error && <ErrorOverlay message={error} />}

        {/* Reset View Button */}
        {enableOrbitControls && (
          <div className="absolute top-4 right-4 z-10" style={{ pointerEvents: 'auto' }}>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleReset}
              className="bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 border border-slate-700/50 text-slate-300"
              title="Reset view"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }
);

ModelViewer.displayName = 'ModelViewer';
