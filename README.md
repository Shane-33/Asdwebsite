  # ASD Website – Landing Page
  
  This repository contains the landing page for the **ASD Website** project.  
  The page is built from a Figma design and exported using Figma → code tooling, then integrated and maintained as part of this repo.
  
  ## Project Context
  
  This project is part of the ASD website work, originally created for an academic capstone project focused on interactive 3D medical education.  
  The landing page serves as an entry point and overview for the project.
  
  ## Tech Stack
  
  - Vite
  - TypeScript
  - React
  - @react-three/fiber & @react-three/drei (3D model rendering)
  - Three.js
  - HTML / CSS
  - PostCSS

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## 3D Models

  3D models (GLB format) must be present in the `public/models/` directory. Model naming must use lowercase filenames.

  **Week 5 Heart Models:**
  - Main 4-chamber heart: `public/models/week5/heart_4chamber.glb`
  - Developmental stages: `public/models/week5/dev/s0.glb` through `public/models/week5/dev/s5.glb`

  Models are automatically preloaded when the Week 5 Heart page is accessed. Ensure all required GLB files exist before running the application.
  
