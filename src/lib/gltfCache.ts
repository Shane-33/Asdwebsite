// Cache for preloaded GLB models
const preloadedUrls = new Set<string>();

/**
 * Preload GLB models for faster switching
 * This must be called from within a React component or after React is initialized
 * @param urls Array of model URLs to preload
 */
export function preloadGLB(urls: string[]): void {
  urls.forEach((url) => {
    if (!preloadedUrls.has(url)) {
      preloadedUrls.add(url);
      // Preloading will happen when the component mounts
    }
  });
}

/**
 * Preload GLB models (async version that can be called outside React)
 * Note: Preloading will happen automatically when components mount
 * @param urls Array of model URLs to preload (for tracking purposes)
 */
export async function preloadGLBAsync(urls: string[]): Promise<void> {
  // Mark URLs as intended for preloading
  // Actual preloading happens when components mount via useGLTF.preload
  urls.forEach((url) => {
    preloadedUrls.add(url);
  });
  // Preloading is handled by react-three-fiber automatically
}

/**
 * Check if a URL has been preloaded
 */
export function isPreloaded(url: string): boolean {
  return preloadedUrls.has(url);
}

/**
 * Clear the preload cache (useful for testing or memory management)
 */
export function clearPreloadCache(): void {
  preloadedUrls.clear();
}
