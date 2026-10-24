---
name: creative-webgl-shaders
description: Use when implementing a WebGL scene, shader effect, 3D product, image distortion, fluid/liquid visual, particle field, generative background, or postprocessing on a creative website. Covers when WebGL is actually required, Three.js vs React Three Fiber vs OGL vs Curtains vs PixiJS, GLSL essentials, GSAP/scroll integration, mobile quality tiers, asset compression, context-loss handling, and static fallbacks. For library selection use creative-library-selector; for scroll choreography use creative-motion-scroll.
license: MIT
metadata:
  author: Emmraan
  version: 1.0.0
---

# Creative WebGL and Shaders

WebGL is a cost, not a credential. It is justified when the effect needs per-pixel work, a real 3D scene, or thousands of independent elements. Everything else should stay in the DOM.

**Core principle:** every WebGL scene must have a designed life without WebGL.

## When to Use

- A hero or full-screen visual needs shader work: gradients, noise, displacement, liquid, RGB split, refraction.
- Images or video must bend, ripple, or transition as shader planes.
- A product must be viewed in 3D, rotated, configured, or revealed through a scroll-driven camera.
- A particle field, instanced mesh system, or generative background is part of the concept.
- A DOM-to-WebGL effect is required for editorial imagery.
- A Three.js/R3F scene needs postprocessing, performance review, or cleanup.

## When Not to Use

- The effect is a gradient, blend, mask, clip-path, or simple hover: use CSS/SVG.
- The effect is a few dozen moving dots: use Canvas 2D or CSS.
- The site is content-first and the GPU effect does not serve the story.
- The target includes low-end mobile and the concept has no static fallback.
- The team cannot maintain a 3D pipeline: a simpler art direction is the better engineering decision.

## Decision Tree

```text
What does the effect need?
├── Color, light, or a static texture → CSS gradient / blend / image
├── Shape reveal or mask → CSS clip-path / SVG mask
├── Simple hover scale or filter → CSS transform / filter
├── A few hundred particles or trails → Canvas 2D
├── Image bending / liquid / RGB split → shader plane (OGL or Curtains)
├── 2D sprites, filters, large particle counts → PixiJS
├── Real 3D objects, camera, lights, models → Three.js or R3F
├── Postprocessing (bloom, DOF, noise) → Three.js/R3F postprocessing
└── Compute-heavy or next-gen → WebGPU + TSL, with a WebGL fallback
```

## Stack Selection

| Need | Default | Alternatives | Notes |
|---|---|---|---|
| 3D scene graph | Three.js | Babylon.js, PlayCanvas | Models, lights, cameras, raycasting |
| React 3D | React Three Fiber + Drei | Three.js in an effect | Declarative scene composition |
| Shader planes | OGL | Curtains.js, Three.js | Small, fast, no scene graph |
| DOM images/videos as planes | Curtains.js | OGL, custom Three.js | Minimal DOM restructuring |
| 2D sprites / particles / filters | PixiJS | Canvas 2D | GPU-accelerated 2D |
| Postprocessing | `@react-three/postprocessing` | Three.js `EffectComposer` | Expensive on mobile |
| Custom shaders | GLSL | TSL for WebGPU | Per-pixel effects |
| WebGPU | Three.js `WebGPURenderer` + TSL | WebGL renderer | Only with a fallback |

Do not combine Three.js, OGL, Curtains, and PixiJS in one page. Pick the renderer that matches the scene, and let the others go.

## Scene Setup Checklist

Every WebGL implementation needs these, regardless of library:

- **Renderer** — antialias only when needed; `powerPreference: 'high-performance'`; alpha only when the DOM shows through.
- **Pixel ratio** — cap at `Math.min(window.devicePixelRatio, 2)`; use 1.5 on mobile.
- **Camera** — set a tight near/far range; handle aspect ratio on resize.
- **Resize** — use `ResizeObserver` on the container, not the window alone.
- **Single loop** — one animation loop; do not start a second RAF for the same canvas.
- **Visibility** — pause when the tab is hidden and when the canvas is offscreen.
- **Disposal** — geometries, materials, textures, render targets, and the renderer.
- **Context loss** — listen for `webglcontextlost` and `webglcontextrestored`; show a fallback.
- **Fallback** — a poster image or CSS composition for no-WebGL and reduced motion.

### Minimal Three.js Setup

```javascript
import * as THREE from 'three'

const container = document.querySelector('.scene')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
})
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
container.appendChild(renderer.domElement)

const geometry = new THREE.PlaneGeometry(1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x111111 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const resize = () => {
  const { width, height } = container.getBoundingClientRect()
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

const observer = new ResizeObserver(resize)
observer.observe(container)
resize()

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
})

// teardown
function dispose() {
  observer.disconnect()
  renderer.setAnimationLoop(null)
  geometry.dispose()
  material.dispose()
  renderer.dispose()
  renderer.domElement.remove()
}
```

### React Three Fiber Setup

```jsx
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

export function Scene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
  )
}
```

Use `frameloop="demand"` for static scenes and call `invalidate()` when something changes. Do not set React state every frame; mutate refs and uniforms inside `useFrame`.

## Shader Essentials

A shader needs three things: inputs (uniforms), per-vertex data (attributes/varyings), and a fragment output.

```glsl
// vertex
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

```glsl
// fragment
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Correct UV aspect before using distance fields.
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 centered = (uv - 0.5) * aspect;
  float dist = length(centered);
  float mouse = 1.0 - smoothstep(0.0, 0.6, length((uv - uMouse) * aspect));

  vec3 base = texture2D(uTexture, uv).rgb;
  vec3 tint = vec3(0.9, 0.2, 0.1);
  vec3 color = mix(base, tint, mouse * 0.6);
  color += 0.03 * sin(uTime + dist * 20.0);

  gl_FragColor = vec4(color, 1.0);
}
```

Rules:

- Use `mediump` precision on mobile when the effect allows it.
- Replace `if` branches with `mix`, `step`, and `smoothstep` where possible.
- Avoid `discard`; it disables early-z and costs performance.
- Precompute constants on the CPU and pass them as uniforms.
- Limit varyings on mobile.
- Keep a visible version in the DOM; do not render essential text only inside the canvas.

## Effect Recipes

Detailed implementations live in [references/effect-recipes.md](references/effect-recipes.md):

- Shader gradient background.
- Image displacement on hover.
- Liquid / fabric distortion.
- RGB split / chromatic aberration.
- Particle field.
- 3D product viewer with scroll-driven camera.
- Postprocessing bloom and noise.
- DOM-to-WebGL image planes with Curtains.
- Static poster fallback.

## Scroll and Motion Integration

- **GSAP ScrollTrigger** — drive a uniform or camera position with `scrub`, not a per-frame scroll listener.
- **Lenis** — read the scroll value from Lenis or ScrollTrigger; do not add a second scroll listener.
- **R3F** — use `useFrame` for the render loop and `useThree` for the renderer/camera; mutate uniforms through refs.
- **Pin + canvas** — size the canvas to its container, not the viewport, when the scene is pinned inside a section.
- **Page transitions** — dispose the scene on leave; do not keep a hidden renderer alive across routes.

```javascript
// GSAP drives a Three.js uniform
const uniforms = { uProgress: { value: 0 } }

gsap.to(uniforms.uProgress, {
  value: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: '.scene-section',
    start: 'top top',
    end: '+=100%',
    scrub: true,
  },
})
```

## Performance and Quality Tiers

Build three tiers, not one:

| Tier | Target | Behavior |
|---|---|---|
| High | Desktop, discrete GPU | Full scene, postprocessing, DPR 2, high-res textures |
| Medium | Laptop, modern phone | Reduced DPR (1.5), no postprocessing, simplified shaders |
| Low / fallback | Low-end phone, reduced motion, no WebGL | Static poster or CSS composition; no render loop |

Detection should use capabilities, not user-agent strings:

```javascript
function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const lowPower = navigator.hardwareConcurrency
  ? navigator.hardwareConcurrency <= 4
  : false
```

Rules:

- Cap DPR; never render at 3x on a phone.
- Target under 100 draw calls per frame for a marketing scene.
- Use `InstancedMesh` for repeated objects; merge static geometry.
- Compress models with Draco or Meshopt; compress textures with KTX2/Basis.
- Use power-of-two textures and mipmaps where appropriate.
- Lazy-load WebGL below the fold with `IntersectionObserver` and dynamic `import()`.
- Pause the render loop when the canvas is offscreen or the tab is hidden.
- Measure GPU time, not only FPS. A scene can report 60fps while the fan is at full speed.
- Test on a real mid-range Android, not only an iPhone and a desktop.

## Fallbacks and Accessibility

- **No WebGL** — show a poster image, video, or CSS composition with the same art direction.
- **Reduced motion** — freeze the scene at a composed frame; do not autoplay motion.
- **Keyboard** — if the 3D object is interactive (rotate, configure), provide buttons or sliders as an equivalent.
- **Text** — keep headings, labels, and descriptions in the DOM; do not paint essential copy into the canvas.
- **Loading** — show a low-quality poster or blurred image immediately; swap in the scene when ready.
- **Context loss** — catch the event, stop the loop, and show the fallback instead of a frozen canvas.
- **Pointer** — the canvas must not block links or scroll unless the interaction explicitly needs capture.

## Common Failures

| Symptom | Cause | Fix |
|---|---|---|
| Canvas stretches on resize | Fixed aspect ratio or no resize handler | Resize to the container, update camera aspect |
| Blurry scene on retina | DPR not set | `setPixelRatio(Math.min(devicePixelRatio, 2))` |
| Page janks while scrolling | Render loop plus scroll listener plus layout reads | One loop; drive uniforms with ScrollTrigger scrub |
| Memory grows on navigation | Geometries/materials/textures not disposed | Dispose on unmount; remove the canvas |
| Scene invisible on some phones | Shader precision or unsupported feature | Use `mediump`, feature-detect, provide fallback |
| Canvas covers links | Canvas positioned above the DOM | Set `pointer-events: none` unless interaction is required |
| React Strict Mode double scene | Effect runs twice in development | Guard with cleanup and dispose in the effect return |
| Textures fail to load | CORS or wrong color space | Set `crossOrigin`, use `SRGBColorSpace` for color textures |
| Postprocessing tanks mobile FPS | Extra render passes | Disable postprocessing on low/medium tiers |

## Definition of Done

- The effect has a documented reason to use WebGL rather than CSS/Canvas.
- A static fallback exists for no-WebGL, reduced motion, and low-power devices.
- The scene is lazy-loaded if below the fold.
- The render loop pauses offscreen and when the tab is hidden.
- Resize, DPR, and camera aspect are handled.
- All GPU resources are disposed on teardown.
- No essential content lives only inside the canvas.
- Performance is measured on a mid-range phone with the quality tier disabled and enabled.

## Related Skills

- `creative-library-selector` — decides whether WebGL is warranted and which renderer fits.
- `creative-motion-scroll` — syncs scroll, pinning, and page transitions with the scene.
- `creative-interactions` — pointer, drag, and hover interactions around the canvas.
- `creative-web-performance` — budgets, lazy loading, and launch checks.
- `threejs-webgl`, `react-three-fiber`, `pixijs-2d` — API-level depth.
