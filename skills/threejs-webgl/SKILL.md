---
name: threejs-webgl
description: Comprehensive skill for Three.js 3D web development. Use this skill when building interactive 3D scenes, WebGL/WebGPU applications, product configurators, 3D visualizations, or immersive web experiences. Triggers on tasks involving Three.js, 3D rendering, scenes, cameras, meshes, materials, lights, animations, textures, or WebGL/WebGPU rendering.
license: MIT
metadata:
  author: freshtechbro
  version: 1.0.0
---

# Three.js WebGL/WebGPU Development

## Overview

Three.js is the industry-standard JavaScript library for creating 3D graphics in web browsers using WebGL and WebGPU. This skill provides comprehensive guidance for building performant, interactive 3D experiences including scenes, cameras, renderers, geometries, materials, lights, textures, and animations.

## Core Concepts

### Scene Graph Architecture

Three.js uses a hierarchical scene graph where all 3D objects are organized in a tree structure:

```javascript
Scene
├── Camera
├── Lights
│   ├── AmbientLight
│   ├── DirectionalLight
│   └── PointLight
├── Meshes
│   ├── Mesh (Geometry + Material)
│   └── InstancedMesh
└── Groups
```

### Essential Components

Every Three.js application requires these core elements:

1. **Scene**: Container for all 3D objects
2. **Camera**: Defines the viewing perspective
3. **Renderer**: Draws the scene to canvas (WebGL or WebGPU)
4. **Geometry**: Defines the shape of objects
5. **Material**: Defines the surface appearance
6. **Mesh**: Combines geometry and material

## Quick Start Pattern

### Basic Scene Setup

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

const camera = new THREE.PerspectiveCamera(
  75, // FOV
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

### WebGPU Setup (Modern Alternative)

```javascript
import * as THREE from 'three/webgpu';

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1;
document.body.appendChild(renderer.domElement);
```

## Patterns & Reference

The full common patterns, integration recipes, performance guidance, and pitfall fixes for this library live in [references/patterns.md](references/patterns.md). Read the section relevant to the current task instead of the whole file; each section is self-contained with runnable examples.

## Resources

- scripts/ - automation and generator utilities for this library.
- references/ - API reference and pattern docs (see patterns.md for the moved patterns sections).
- assets/ - starter templates and examples.