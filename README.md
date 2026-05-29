# Cosmic Scroll

A mind-bending, high-contrast, brutalist scrolling experience through space and time. Built to push the boundaries of scroll-driven animations, real-time WebGL, and custom shaders.

## 🚀 The Tech Stack

This project is built using a modern, high-performance web stack:

- **React 19 & Vite**: The blazing fast foundation.
- **Tailwind CSS v4**: For the stark, brutalist, 1px-grid aesthetic.
- **GSAP (GreenSock)**: The engine powering the complex scrub-based scroll animations.
- **Three.js & React Three Fiber**: For real-time 3D rendering and custom GLSL shaders (Solar Flares, Black Holes, etc.).
- **Framer Motion**: For buttery-smooth, spring-based UI physics.

## 🌌 The Design Philosophy: "Technical Brutalism"

We abandoned the generic "AI glassmorphism" aesthetic (blurry backgrounds, soft rounded corners, emojis). Instead, this project uses:

- **Stark Geometry**: Sharp lines, pure black `#000000` backgrounds, and 1px white technical borders.
- **Aggressive Typography**: Heavy use of monospace metadata tags alongside massive, kinetic display fonts.
- **Abstract Representations**: Trading standard images for pure WebGL shader math and abstract SVG geometry.

## 🛠️ Getting Started

To run this project locally:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Dev Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 📂 Architecture Overview

The app is divided into distinct, scroll-pinned sections:

- `Hero.jsx`: The brutalist typographic entry point.
- `WarpSection.jsx`: A high-speed, horizontal scanning canvas effect.
- `PlanetSection.jsx`: 2D geometric representations of our orbital bodies with orbiting moons and rings.
- `ConstellationSection.jsx`: Technical SVG star mapping with strict line drawing.
- `DataSection.jsx`: A full-bleed CSS grid of animated numerical data.
- `RevealSection.jsx`: A massive Carl Sagan quote with inverted text-reveal mechanics.
- `GalaxySection.jsx`: A custom HTML5 Canvas particle spiral.
- `GallerySection.jsx`: (The WebGL Core) Features custom GLSL shaders running inside a React Three Fiber `<Canvas>` for cosmic anomalies.
- `FinaleSection.jsx`: The end of the transmission.

## 👾 Custom Shaders

The `GallerySection` employs custom vertex and fragment shaders to simulate:
- Plasma noise and turbulent flares.
- Gravitational lensing and accretion disks.
- High-frequency volumetric emissions.

---
*The cosmos is all that is, or ever was, or ever will be.*
