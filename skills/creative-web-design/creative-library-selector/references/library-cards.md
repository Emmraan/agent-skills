# Library Cards

Use these cards after the capability matrix has narrowed the field. Each card answers four questions: when to use it, when not to, what it pairs with, and what it costs.

## GSAP

**Category:** Motion, timeline, scroll, SVG, text.

**Use when:** animations must be sequenced, paused, reversed, scrubbed, or synced with scroll; SVG and text need precise control; the project is framework-agnostic or already uses GSAP.

**Do not use when:** the effect is a single CSS transition, a hover state, or a small React layout animation that Motion handles more declaratively.

**Preferred combination:** GSAP + ScrollTrigger + Lenis + SplitText.

**Alternatives:** Motion for React UI motion; Anime.js for small SVG sequences.

**Notes:** all GSAP plugins are included in the public `gsap` package. Register only the plugins you use. In React, use `useGSAP` and `gsap.context()` for cleanup.

## Motion

**Category:** React UI, layout, gestures, page transitions.

**Use when:** React owns the component tree and the animation is tied to state, layout, exit, or gestures; a small vanilla page needs a lightweight animation API.

**Do not use when:** the work is a long scroll-scrubbed timeline, a complex SVG sequence, or a non-React app where GSAP is already present.

**Preferred combination:** Motion + Lenis for React marketing pages; Motion `useScroll` for simple progress effects.

**Alternatives:** GSAP for timeline-heavy work; React Spring for existing spring-based code.

**Notes:** do not run Motion and GSAP on the same transform without a clear owner. Layout animations can be expensive on large lists.

## Anime.js

**Category:** Lightweight motion and SVG.

**Use when:** a small number of elements need a compact staggered sequence, SVG drawing, or a simple timeline without scroll integration.

**Do not use when:** the project needs ScrollTrigger-level scroll control, complex React layout animation, or a large coordinated system.

**Preferred combination:** Anime.js + native scroll + CSS.

**Alternatives:** GSAP for anything that will grow; CSS keyframes for simple loops.

**Notes:** v4 improved the API and module support. Verify the version and import style before writing code.

## Lenis

**Category:** Smooth scrolling.

**Use when:** a premium, weighted scroll feel is part of the design and the site is a marketing, portfolio, editorial, or brand experience.

**Do not use when:** the UI is a dashboard, form, editor, or documentation site; the user relies on native scroll behavior; reduced motion is preferred.

**Preferred combination:** Lenis + GSAP ScrollTrigger, driven by the GSAP ticker.

**Alternatives:** native CSS scroll-driven animations; Locomotive Scroll only for legacy projects.

**Notes:** never run two RAF loops. Disable Lenis under `prefers-reduced-motion`. Keep keyboard scroll, anchors, and `scroll-behavior` working.

## Locomotive Scroll

**Category:** Smooth scrolling and scroll effects.

**Use when:** an existing project already depends on it, or a legacy codebase cannot be migrated.

**Do not use when:** starting a new project; Lenis is smaller, better maintained, and easier to pair with ScrollTrigger.

**Preferred combination:** Locomotive + its own scroll events; avoid mixing with ScrollTrigger unless using the proxy correctly.

**Alternatives:** Lenis.

**Notes:** version differences are significant. Read the installed version's docs, not an old tutorial.

## Barba.js

**Category:** Multi-page page transitions.

**Use when:** a server-rendered or static multi-page site needs shared-element, overlay, or cinematic transitions between pages.

**Do not use when:** the site is a React/Vue/Svelte SPA with its own router; the transition is a simple fade that the View Transitions API can handle.

**Preferred combination:** Barba.js + GSAP timelines + Lenis; refresh ScrollTrigger after each enter.

**Alternatives:** View Transitions API; framework-native transitions.

**Notes:** kill old ScrollTriggers and Lenis instances on leave; move focus to the new page's main heading; provide a normal navigation fallback.

## View Transitions API

**Category:** Native page and state transitions.

**Use when:** the browser support matrix allows progressive enhancement and the transition is same-document or cross-document with simple shared elements.

**Do not use when:** identical behavior is required in older browsers and a polyfill is not acceptable.

**Preferred combination:** View Transitions + CSS animations; fall back to normal navigation.

**Alternatives:** Barba.js for full control across browsers.

**Notes:** use `view-transition-name` deliberately; too many named elements cause visual noise. Test with reduced motion.

## Three.js

**Category:** 3D and general WebGL.

**Use when:** the experience needs a scene graph, cameras, lights, materials, models, raycasting, or custom shaders in a 3D world.

**Do not use when:** the effect is a single full-screen shader plane, a 2D particle field, or a CSS-achievable hover. Use OGL, PixiJS, or CSS instead.

**Preferred combination:** Three.js + GLSL + GSAP ScrollTrigger; R3F if the app is React.

**Alternatives:** Babylon.js for a batteries-included engine; PlayCanvas for editor-driven teams; OGL for minimal shader scenes.

**Notes:** cap pixel ratio, dispose geometries/materials/textures, pause offscreen, compress models (Draco/Meshopt), compress textures (KTX2), and handle context loss.

## React Three Fiber + Drei

**Category:** React 3D.

**Use when:** the app is React and the 3D scene should be composed declaratively with reusable components and helpers.

**Do not use when:** there is no React runtime, or the scene is a single shader quad that OGL can render with less machinery.

**Preferred combination:** R3F + Drei + `@react-three/postprocessing` + `useFrame`; lazy-load the Canvas.

**Alternatives:** Three.js in an effect for non-React apps.

**Notes:** do not call React state setters every frame. Mutate refs and uniforms. Respect `frameloop="demand"` for static scenes. Dispose on unmount.

## OGL

**Category:** Minimal WebGL and shaders.

**Use when:** the effect is a small number of shader planes, image transitions, or a full-screen visual with no need for a 3D scene graph.

**Do not use when:** you need models, lights, physics, or a large scene hierarchy.

**Preferred combination:** OGL + GLSL + GSAP for uniform animation; Curtains.js if the source elements are DOM images.

**Alternatives:** Three.js for a scene graph; Curtains.js for DOM integration.

**Notes:** you own more of the rendering setup. Budget time for resize, DPR, and cleanup.

## Curtains.js

**Category:** DOM-to-WebGL planes.

**Use when:** existing images or videos in the DOM should become shader planes with hover, scroll, or transition effects.

**Do not use when:** the experience is a true 3D world or the DOM structure cannot be adapted.

**Preferred combination:** Curtains + GLSL + GSAP ScrollTrigger.

**Alternatives:** OGL with custom plane geometry; Three.js with DOM-synced planes.

**Notes:** keep a static image fallback; verify mobile GPU cost; destroy the Curtains instance on route change.

## PixiJS

**Category:** 2D GPU rendering.

**Use when:** thousands of sprites, filters, particle effects, or a 2D interactive scene need GPU acceleration.

**Do not use when:** a few DOM elements or a simple Canvas 2D drawing is enough.

**Preferred combination:** PixiJS + GSAP for timeline control; custom shaders for filters.

**Alternatives:** Canvas 2D for small scenes; Three.js for 3D.

**Notes:** manage texture atlases and destroy textures; avoid running a second ticker alongside GSAP's.

## Postprocessing

**Category:** Bloom, depth of field, noise, chromatic aberration.

**Use when:** the look depends on cinematic post effects and the target hardware can afford an extra render pass.

**Do not use when:** the site must run on low-end mobile, or the effect can be faked with a CSS overlay.

**Preferred combination:** `@react-three/postprocessing` in R3F; Three.js `EffectComposer` in vanilla.

**Alternatives:** CSS overlays, gradient masks, baked textures.

**Notes:** disable antialiasing when postprocessing handles it; scale the render target; measure GPU time, not just FPS.

## GLSL, TSL, and WebGPU

**Category:** Shader authoring and next-generation rendering.

**Use when:** GLSL for per-pixel effects in WebGL; TSL when using Three.js's WebGPU renderer; WebGPU only when the project can require modern browsers and has a fallback.

**Do not use when:** the effect is a gradient, blend mode, or filter that CSS/SVG can produce.

**Preferred combination:** GLSL + Three.js/OGL/Curtains; TSL + Three.js WebGPURenderer.

**Alternatives:** CSS filters, SVG filters, Canvas 2D.

**Notes:** use `mediump` where possible on mobile; avoid branching and `discard`; precompute on the CPU; limit varyings; test on a real phone.

## Matter.js

**Category:** 2D physics.

**Use when:** objects should collide, stack, bounce, or be dragged with visible weight in a 2D scene.

**Do not use when:** the motion is a scripted tween, or the interaction must be fully keyboard-accessible and physics would block it.

**Preferred combination:** Matter.js + Canvas/DOM rendering + GSAP for UI.

**Alternatives:** Rapier 2D; hand-rolled collision for a few objects.

**Notes:** provide a static fallback; pause the simulation offscreen; do not run a physics engine for decorative hover states.

## Rapier

**Category:** 2D/3D physics.

**Use when:** a 3D/R3F scene needs rigid bodies, joints, sensors, or character control.

**Do not use when:** simple raycasting or scripted animation covers the interaction.

**Preferred combination:** Rapier + R3F (`@react-three/rapier`) or Three.js.

**Alternatives:** Cannon-es for simpler 3D physics; Matter.js for 2D.

**Notes:** WASM loading has a cost; initialize once; step the world at a fixed timestep; pause offscreen.

## p5.js

**Category:** Creative coding and generative visuals.

**Use when:** the visual is generative, mathematical, or sketch-like, and the code is the artwork.

**Do not use when:** the task is a production UI layout or a conventional marketing section.

**Preferred combination:** p5.js in instance mode + GSAP for scroll triggers.

**Alternatives:** Canvas 2D for simpler drawing; Three.js for 3D.

**Notes:** do not let the sketch own the whole page's render loop; pause when hidden; respect reduced motion.

## @use-gesture and GSAP Draggable

**Category:** Gestures and drag.

**Use when:** drag, pinch, wheel, or swipe must be normalized across pointer and touch; or when dragging must integrate with a GSAP timeline.

**Do not use when:** native scroll or a carousel library already owns the gesture.

**Preferred combination:** `@use-gesture` + Motion for React; GSAP Draggable + Inertia for timeline-driven drag.

**Alternatives:** native pointer events for a single simple drag.

**Notes:** set `touch-action` deliberately; provide keyboard alternatives; do not block page scroll on mobile.

## SplitText and SplitType

**Category:** Text splitting for animation.

**Use when:** headings or short copy must animate by line, word, or character; SplitText if GSAP is present, SplitType if not.

**Do not use when:** the text is long-form body copy, must remain selectable per character, or a CSS mask already gives the desired reveal.

**Preferred combination:** SplitText + GSAP timeline; SplitType + GSAP or CSS.

**Alternatives:** manual `<span>` wrapping for one heading.

**Notes:** split after fonts load; re-split on resize if line breaks must be recalculated; keep the original text for screen readers; avoid splitting every paragraph.

## Lottie

**Category:** Motion graphics.

**Use when:** an After Effects animation is part of the design and needs to scale cleanly.

**Do not use when:** the animation must react to live data or pointer input; a video or CSS animation is smaller.

**Preferred combination:** `lottie-web` or `@lottiefiles/dotlottie-web` + IntersectionObserver to pause offscreen.

**Alternatives:** WebM/MP4 for simple loops; CSS for simple shapes.

**Notes:** audit the JSON size; limit simultaneous players; provide a static poster for reduced motion.

## Howler.js, Web Audio API, and Tone.js

**Category:** Audio.

**Use when:** Howler for playback and sprites; Web Audio API for analysis and reactive visuals; Tone.js for synthesis and scheduling.

**Do not use when:** audio would autoplay, there is no visible mute/stop control, or the experience is inaccessible without sound.

**Preferred combination:** a user gesture starts audio; Howler for the track; AnalyserNode for reactive data.

**Alternatives:** native `<audio>` for a simple player.

**Notes:** default to muted; remember the user's choice; pause when the tab is hidden; provide captions/transcripts for spoken content.

## Embla and Swiper

**Category:** Carousels and sliders.

**Use when:** Embla for a lightweight, accessible slider; Swiper for thumbs, virtual slides, parallax, and advanced modes.

**Do not use when:** CSS scroll-snap already provides the needed behavior.

**Preferred combination:** Embla + native scroll-snap styling; Swiper only when its feature set is genuinely required.

**Alternatives:** native overflow scrolling with scroll-snap.

**Notes:** ensure arrow keys, focus order, and touch gestures work; do not autoplay carousels without a pause control.

## D3.js

**Category:** Data visualization.

**Use when:** the visualization is bespoke, data-driven, and needs scales, axes, transitions, or geographic projections.

**Do not use when:** a standard chart library covers the need, or the chart is decorative and the data is fake.

**Preferred combination:** D3 scales/data + SVG or Canvas rendering; GSAP for entrance choreography.

**Alternatives:** a chart library for standard charts; Canvas 2D for very large datasets.

**Notes:** keep the data honest; provide a table or text summary for accessibility; do not animate every data point by default.

## CMS (Sanity, Prismic, Contentful, Strapi, Directus)

**Category:** Content modeling.

**Use when:** non-developers must edit structured content, case studies, products, or editorial pages.

**Do not use when:** content changes with code releases, or the site is a one-off static page.

**Preferred combination:** a managed CMS (Sanity/Prismic/Contentful) + a frontend that treats content as data; self-hosted (Strapi/Directus) when hosting control is required.

**Alternatives:** markdown/MDX for developer-edited content.

**Notes:** model content around sections, not around visual effects; effects must not depend on hardcoded copy lengths; provide preview and fallback images.
