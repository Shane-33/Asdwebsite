  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

// Ensure Three.js is available before rendering
// This helps with react-three-fiber initialization
if (typeof window !== 'undefined') {
  import('three').then((THREE) => {
    (window as any).THREE = THREE;
  }).catch(() => {
    // Ignore if already loaded
  });
}

  createRoot(document.getElementById("root")!).render(<App />);