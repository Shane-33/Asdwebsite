/**
 * Heart structure definitions with colors and metadata
 */

export interface HeartStructure {
  id: string;
  meshName: string | string[];
  displayName: string;
  abbr: string;
  description: string;
  color: string; // hex color
}

export const heartStructures: HeartStructure[] = [
  {
    id: "ra",
    meshName: ["Right Atrium", "right_atrium", "RightAtrium", "RA"],
    displayName: "Right Atrium",
    abbr: "RA",
    description: "Receives deoxygenated blood from the body",
    color: "#3B82F6", // Soft blue
  },
  {
    id: "la",
    meshName: ["Left Atrium", "left_atrium", "LeftAtrium", "LA"],
    displayName: "Left Atrium",
    abbr: "LA",
    description: "Receives oxygenated blood from the lungs",
    color: "#22C55E", // Soft green
  },
  {
    id: "rv",
    meshName: ["Right Ventricle", "right_ventricle", "RightVentricle", "RV"],
    displayName: "Right Ventricle",
    abbr: "RV",
    description: "Pumps deoxygenated blood to the lungs",
    color: "#F97316", // Soft orange
  },
  {
    id: "lv",
    meshName: ["Left Ventricle", "left_ventricle", "LeftVentricle", "LV"],
    displayName: "Left Ventricle",
    abbr: "LV",
    description: "Pumps oxygenated blood to the body",
    color: "#A855F7", // Soft purple
  },
  {
    id: "ta",
    meshName: ["Truncus Arteriosus", "truncus_arteriosus", "TruncusArteriosus", "TA"],
    displayName: "Truncus Arteriosus",
    abbr: "TA",
    description: "Develops into the aorta and pulmonary trunk",
    color: "#EAB308", // Champagne yellow-gold
  },
  {
    id: "bc",
    meshName: ["Bulbus Cordis", "bulbus_cordis", "BulbusCordis", "BC"],
    displayName: "Bulbus Cordis",
    abbr: "BC",
    description: "Forms the right ventricular outflow tract",
    color: "#EF4444", // Soft red
  },
];

/**
 * Normalize mesh name for matching
 * Handles variations in naming conventions
 */
export function normalizeMeshName(name: string): string {
  if (!name) return '';
  // Remove extra whitespace, convert to lowercase, strip underscores
  return name.trim().replace(/\s+/g, ' ').replace(/_/g, '').toLowerCase();
}

/**
 * Find structure by mesh name (with normalization)
 */
export function getStructureByMeshName(meshName: string): HeartStructure | null {
  const normalized = normalizeMeshName(meshName);
  
  for (const structure of heartStructures) {
    const meshNames = Array.isArray(structure.meshName) 
      ? structure.meshName 
      : [structure.meshName];
    
    for (const name of meshNames) {
      if (normalizeMeshName(name) === normalized) {
        return structure;
      }
    }
  }
  
  return null;
}

/**
 * Find structure by ID
 */
export function getStructureById(id: string): HeartStructure | null {
  return heartStructures.find(s => s.id === id) || null;
}

/**
 * Get all available structure display names
 */
export function getAllStructureNames(): string[] {
  return heartStructures.map(s => s.displayName).sort();
}

/**
 * Legacy function for backward compatibility
 */
export function getStructureInfo(meshName: string): HeartStructure | null {
  return getStructureByMeshName(meshName);
}
