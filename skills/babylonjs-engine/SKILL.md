---
name: babylonjs-engine
description: Comprehensive skill for Babylon.js 3D web rendering engine. Use this skill when building real-time 3D experiences, browser-based games, interactive visualizations, or immersive web applications. Triggers on tasks involving Babylon.js, 3D scenes, WebGL/WebGPU rendering, entity-component systems, physics simulations, PBR materials, shadow mapping, or 3D model loading. Alternative to Three.js with built-in editor integration and game engine features.
license: MIT
metadata:
  author: freshtechbro
  version: 1.0.0
---

# Babylon.js Engine Skill

## Related Skills
- threejs-webgl: Alternative 3D engine
- react-three-fiber: React integration for 3D
- gsap-scrolltrigger: Animation library
- motion-framer: UI animations

## Core Concepts
Babylon.js is the most feature-complete WebGL engine. Master these eight concepts in order; full code and deep detail for each lives in [references/core-concepts.md](references/core-concepts.md).

| # | Concept | What you need |
|---|---------|---------------|
| 1 | Engine and Scene Initialization | Create the Engine from a canvas, create a Scene, run the render loop |
| 2 | Camera Systems | UniversalCamera/FPS/ArcRotate; attach control, set position and target |
| 3 | Lighting Systems | Point, directional, spot, hemispheric, shadow-generating lights |
| 4 | Mesh Creation | Box, sphere, plane, ground builders; sub-meshes; vertex data |
| 5 | Materials | PBR and Standard materials; textures, bump/alpha, emissive |
| 6 | Model Loading | SceneLoader to load glTF/3DS/OBJ async (AssetContainer) |
| 7 | Physics Engine | Ammo.js/Cannon/Oimo plugin; physics impostors on meshes |
| 8 | Animations | Animation objects; EasingFunction, keyframes, animation groups |

Start with concept 1, then read references/core-concepts.md for the exact code of the concept you are implementing.
## Patterns & Reference

Common patterns, integrations, performance, and pitfall fixes live in [references/patterns.md](references/patterns.md). Read the section relevant to the current task; each is self-contained with runnable examples.

## Resources

- scripts/ - scene and mesh generation utilities (scene_generator.py, mesh_builder.py).
- references/ - core-concepts.md and patterns.md (deep API detail).
- assets/ - starter scene templates.