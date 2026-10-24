# Library Capability Matrix

Use this reference after the effect inventory exists. It answers one question: **which capability does the effect require, and what is the smallest tool that provides it?**

Read [library-cards.md](library-cards.md) for per-library use/avoid guidance.

## How to Read the Tables

- **Primary** — the default choice for the capability.
- **Alternatives** — credible substitutes; not additive.
- **Choose primary when** — the condition that makes the default correct.
- **Avoid when** — the condition that should send you to a simpler rung of the platform ladder.
- **Cost** — qualitative runtime/bundle cost: Low, Medium, High. Verify in the actual bundle; versions change.

## 1. Motion and Timeline

| Capability | Primary | Alternatives | Choose primary when | Avoid when | Cost |
|---|---|---|---|---|---|
| Complex timeline / choreography | GSAP | Anime.js, Motion | Sequences must be paused, reversed, scrubbed, or synced across elements | The effect is a single hover or entrance | Medium |
| React component and layout motion | Motion | React Spring | React owns the UI; layout, exit, and gesture animations are needed | You need a long scroll-scrubbed timeline | Medium |
| Small SVG / UI sequences | Anime.js | GSAP, CSS | A few elements need staggered motion and no scroll integration | The timeline is large or scroll-linked | Low |
| Physics-based UI springs | Motion | React Spring | Natural settling and interruption matter | You need precise timeline control | Medium |
| Timeline editing for 3D scenes | Theatre.js | Hand-authored keyframes | A designer must tune a 3D sequence visually | The sequence is short and code-authored | Medium |
| Lottie playback | `lottie-web` / `@lottiefiles/dotlottie-web` | GIF/WebM for simple loops | An After Effects animation is part of the design | The animation must react to live data or pointer input | Low–Medium |

## 2. Scroll and Navigation

| Capability | Primary | Alternatives | Choose primary when | Avoid when | Cost |
|---|---|---|---|---|---|
| Smooth scrolling | Lenis | Locomotive Scroll, native | A premium, weighted scroll feel is part of the design | The UI is app-like, form-heavy, or accessibility-critical | Low |
| Scroll-linked animation | GSAP ScrollTrigger | Motion `useScroll`, CSS scroll-driven animations | Pinning, scrubbing, snapping, or precise trigger control is needed | A simple progress bar or fade can use CSS | Medium |
| Pinned / sticky storytelling | GSAP ScrollTrigger | CSS `position: sticky` + IntersectionObserver | Multiple scenes must pin and animate in sequence | The content can stay in normal flow | Medium |
| Horizontal gallery | GSAP ScrollTrigger | CSS scroll-snap, Motion `useScroll` | Vertical scroll should drive horizontal movement | Native horizontal swipe is the better mobile behavior | Medium |
| Page transitions (multi-page) | Barba.js | View Transitions API | A static/MPA site needs shared-element or overlay continuity | The site is a React/Vue SPA with its own router | Medium |
| Page transitions (native) | View Transitions API | Barba.js | The browser support matrix allows progressive enhancement | You need identical behavior in older browsers | Low |
| Scroll progress / reading indicator | ScrollTrigger or CSS scroll-driven | IntersectionObserver | The indicator must follow a custom scroll container | Native scroll progress is enough | Low |
| Anchor navigation | Native + Lenis `scrollTo` | GSAP ScrollToPlugin | Smooth anchors should match the smooth scroll system | Default browser jump behavior is fine | Low |

## 3. 3D, WebGL, and Shaders

| Capability | Primary | Alternatives | Choose primary when | Avoid when | Cost |
|---|---|---|---|---|---|
| 3D scene graph | Three.js | Babylon.js, PlayCanvas | Models, cameras, lights, materials, and a scene hierarchy are needed | One full-screen shader plane is the entire effect | High |
| React 3D | React Three Fiber + Drei | Three.js in a `useEffect` | The app is React and the scene should be declarative | There is no React runtime | High |
| Shader plane / image distortion | OGL | Curtains.js, Three.js | The effect is a small number of full-screen or image planes | A CSS filter or SVG displacement produces the same look | Medium |
| DOM-to-WebGL image/video planes | Curtains.js | OGL, custom Three.js | Existing DOM images must become shader planes with minimal restructuring | The scene is a real 3D world with models | Medium |
| 2D sprites, particles, filters | PixiJS | Canvas 2D, Three.js | Thousands of sprites or filters must run on the GPU | A few DOM elements or a simple canvas is enough | Medium–High |
| Postprocessing | `@react-three/postprocessing` | Three.js `EffectComposer` | Bloom, DOF, noise, or chromatic aberration is part of the look | The target includes low-end mobile | High |
| Custom GPU shaders | GLSL | TSL for WebGPU paths | Per-pixel effects are required | The effect is a gradient or blend mode | Medium |
| WebGPU rendering | Three.js `WebGPURenderer` + TSL | WebGL renderer | The project can require modern browsers and needs compute or advanced rendering | Broad browser support is mandatory | High |
| Large particle field | Three.js `Points` / instancing | PixiJS, Canvas 2D | Tens of thousands of particles must animate smoothly | A few hundred particles are enough | Medium–High |
| 3D product viewer | Three.js/R3F + glTF | `<model-viewer>` for simple embeds | Materials, lighting, and interaction are art-directed | A simple embeddable viewer is enough | High |

## 4. Physics

| Capability | Primary | Alternatives | Choose primary when | Avoid when | Cost |
|---|---|---|---|---|---|
| 2D collisions, gravity, constraints | Matter.js | Rapier (2D) | DOM/canvas objects should collide, stack, or drag with weight | The motion is cosmetic and can be tweened | Medium |
| 3D physics | Rapier | Cannon-es | A 3D/R3F scene needs rigid bodies, joints, or character control | The scene only needs simple raycasting | High |
| Simple collision / hit testing | Hand-rolled math | Matter.js | A few circles or rectangles need overlap checks | A full simulation is required | Low |
| Draggable with inertia | GSAP Draggable + Inertia | Native pointer events | Dragging must integrate with a GSAP timeline | Native scroll or a carousel already handles it | Low–Medium |

## 5. Interaction and Gestures

| Capability | Primary | Alternatives | Choose primary when | Avoid when | Cost |
|---|---|---|---|---|---|
| Pointer gestures (drag, pinch, wheel) | `@use-gesture` | Hand-rolled pointer events | React or vanilla code needs normalized gestures | A carousel library already owns the gesture | Low |
| Custom cursor / follower | GSAP `quickTo` | Shery.js, Motion | The cursor is a designed part of the brand | The device is touch-only or reduced motion is on | Low |
| Magnetic buttons | GSAP `quickTo` or CSS transform | Motion | A small number of CTAs should respond to proximity | Every button would move; it becomes noise | Low |
| Hover image preview | Pointer events + preloaded images | GSAP quickTo | A list should preview imagery on hover | The primary device is touch | Low–Medium |
| Tilt cards | Pointer events + transform | Vanilla CSS `perspective` | Cards should respond to pointer position | The card contains critical reading content | Low |
| Carousel (lightweight, accessible) | Embla Carousel | Swiper, CSS scroll-snap | A simple, accessible slider is needed | CSS scroll-snap already works | Low |
| Carousel (feature-rich) | Swiper | Embla, Flickity | Thumbs, virtual slides, parallax, and many modes are needed | The requirement is a basic slider | Medium |
| Drag-to-scroll gallery | Embla or GSAP Draggable | Native overflow scrolling | Horizontal browsing must feel physical | Native scroll-snap is sufficient | Low–Medium |

## 6. Typography and SVG

| Capability | Primary | Alternatives | Choose primary when | Avoid when | Cost |
|---|---|---|---|---|---|
| Text splitting for animation | GSAP SplitText | SplitType | GSAP is already used; lines, words, and chars must be re-split responsively | Text is short and a CSS mask is enough | Low |
| Lightweight text splitting | SplitType | GSAP SplitText | GSAP is not otherwise needed | You need advanced re-splitting and masking behavior | Low |
| Kinetic typography | GSAP + SplitText | Motion, CSS | Type is the main visual and must respond to scroll or pointer | Body copy would become hard to read | Medium |
| Text scramble / decode | GSAP ScrambleText | Custom character swap | Short labels or headings need a technical reveal | Long paragraphs or accessible content | Low |
| SVG path drawing | GSAP DrawSVG | CSS `stroke-dashoffset` | The drawing must sync with a timeline | A simple one-shot draw is enough | Low |
| SVG morphing | GSAP MorphSVG | flubber | Shapes must morph smoothly inside a timeline | The paths have incompatible point counts and no cleanup is planned | Medium |
| Variable-font animation | CSS `font-variation-settings` + GSAP | Motion | A variable font is part of the brand system | The font is not variable or the axis changes cause layout shift | Low |

## 7. Audio, Video, and Media

| Capability | Primary | Alternatives | Choose primary when | Avoid when | Cost |
|---|---|---|---|---|---|
| Audio playback and sprites | Howler.js | Native `Audio`, Web Audio API | Sound effects or a managed audio track are needed | Audio autoplays without a gesture or mute control | Low |
| Audio-reactive visuals | Web Audio API `AnalyserNode` | Tone.js | Visuals must respond to live audio data | There is no user gesture or no mute/stop control | Medium |
| Music synthesis / scheduling | Tone.js | Web Audio API | The project needs synths, sequencing, or tempo-aware events | Simple playback is enough | Medium |
| Standard video playback | Native `<video>` | Video.js | The browser controls are sufficient | You need adaptive streaming, DRM, or advanced analytics | Low |
| Complex video player | Video.js | Native + custom controls | Captions, quality levels, and analytics are required | A background loop needs only `muted` + `playsinline` | Medium |
| Video scrubbing on scroll | Native video + `currentTime` | WebCodecs, image sequence | Short, compressed clips can be scrubbed | The clip is long or the device is mobile | High |
| Animated image sequence | Canvas or `<img>` swap | WebGL texture sequence | The sequence is short and compression is controlled | A video would be smaller and smoother | Medium |

## 8. Data, Content, and Structure

| Capability | Primary | Alternatives | Choose primary when | Avoid when | Cost |
|---|---|---|---|---|---|
| Data visualization | D3.js | Chart library, SVG | The visualization is bespoke and data-driven | The chart is a standard bar/line chart | Medium |
| CMS for client editing | Sanity | Prismic, Contentful, Strapi, Directus | Non-developers must edit structured content | Content changes with code releases | Medium |
| Structured content modeling | Sanity / Prismic | Contentful | The schema must be designed around the site's sections | A flat markdown file is enough | Medium |
| Self-hosted CMS | Strapi / Directus | WordPress | The team needs full control and hosting | A managed CMS is acceptable | Medium–High |

## Library Power Levels

Use this as a quick sanity check. **Creative power** is how much distinctive experience the library enables; **complexity** is the integration and maintenance burden.

| Library | Category | Complexity | Creative power | Runtime cost | Default for new work |
|---|---|---|---|---|---|
| GSAP | Motion / timeline | Medium | 5 | Medium | Yes |
| Motion | React UI motion | Low–Medium | 3 | Medium | Yes, for React UI |
| Anime.js | Small motion | Low | 3 | Low | Situational |
| Lenis | Smooth scroll | Low | 4 | Low | Yes |
| Locomotive Scroll | Smooth scroll | Medium | 4 | Medium | No (legacy) |
| GSAP ScrollTrigger | Scroll | Medium | 5 | Medium | Yes |
| Barba.js | MPA transitions | Medium | 4 | Low | Yes, for MPA |
| View Transitions API | Native transitions | Low | 3 | Low | Yes, when support allows |
| Three.js | 3D / WebGL | High | 5 | High | Yes, for 3D |
| React Three Fiber | React 3D | High | 5 | High | Yes, in React |
| Drei | R3F helpers | Low | 4 | Low | Yes, with R3F |
| OGL | Shader planes | Medium | 5 | Medium | Yes, for small shader scenes |
| Curtains.js | DOM-to-WebGL | Medium | 4 | Medium | Yes, for image/video planes |
| PixiJS | 2D GPU | Medium–High | 4 | Medium–High | Situational |
| `@react-three/postprocessing` | Postprocessing | Medium | 4 | High | Situational |
| GLSL | Shaders | High | 5 | Varies | Yes, when per-pixel work is needed |
| WebGPU / TSL | Next-gen rendering | High | 5 | High | No, unless required |
| Matter.js | 2D physics | Medium | 4 | Medium | Yes, for 2D physics |
| Rapier | 3D physics | High | 4 | High | Yes, for 3D physics |
| p5.js | Creative coding | Low–Medium | 4 | Medium | Situational |
| `@use-gesture` | Gestures | Low | 3 | Low | Yes, for gestures |
| SplitText | Typography | Low | 4 | Low | Yes, with GSAP |
| SplitType | Typography | Low | 3 | Low | Yes, without GSAP |
| Lottie | Motion graphics | Low | 3 | Low–Medium | Situational |
| Howler.js | Audio | Low | 3 | Low | Yes, for playback |
| Embla | Carousel | Low | 3 | Low | Yes |
| Swiper | Carousel | Medium | 3 | Medium | Situational |
| D3.js | Data viz | Medium–High | 4 | Medium | Situational |
| Shery.js | Cursor effects | Low | 3 | Low | Evaluate maintenance first |

## Compatibility Matrix

| Library | React | Next SSR | Astro | Vue/Svelte | Vanilla | Webflow | Mobile |
|---|---|---|---|---|---|---|---|
| GSAP | Yes (`useGSAP`) | Yes (client) | Yes | Yes | Yes | Yes | Yes |
| Motion | Yes | Yes (client) | Island only | No (use vanilla Motion) | Yes | No | Yes |
| Lenis | Yes (`lenis/react`) | Yes (client) | Yes | Yes | Yes | Yes | Yes, but consider disabling |
| ScrollTrigger | Yes | Yes (client) | Yes | Yes | Yes | Yes | Yes |
| Three.js | Yes | Yes (client) | Yes | Yes | Yes | Embed only | Yes, with quality tiers |
| R3F / Drei | Yes | Yes (client) | Island only | No | No | No | Yes, with quality tiers |
| OGL | Yes | Yes (client) | Yes | Yes | Yes | Embed only | Yes, with fallback |
| Curtains.js | Yes | Yes (client) | Yes | Yes | Yes | Embed only | Yes, with fallback |
| PixiJS | Yes | Yes (client) | Yes | Yes | Yes | Embed only | Yes |
| Matter.js | Yes | Yes (client) | Yes | Yes | Yes | Embed only | Consider disabling |
| Rapier | Yes | Yes (client) | Island only | Yes | Yes | No | High cost |
| Barba.js | No | No | Yes | No | Yes | Yes | Yes |
| View Transitions | Framework support | Framework support | Yes | Framework support | Yes | Limited | Browser-dependent |
| Embla | Yes | Yes | Yes | Yes | Yes | No | Yes |
| Swiper | Yes | Yes | Yes | Yes | Yes | No | Yes |
| Howler.js | Yes | Yes (client) | Yes | Yes | Yes | Yes | Yes |

## Fallback Matrix

Every `Must` effect needs one of these fallbacks.

| Effect | Fallback |
|---|---|
| Smooth scroll | Native scroll; disable Lenis |
| Pinned storytelling | Normal-flow sections with static images |
| Horizontal gallery | Native horizontal scroll-snap |
| Shader image distortion | Static image with CSS hover scale |
| 3D product | Poster image or short muted video |
| Particle field | Static gradient or poster |
| Custom cursor | Native cursor |
| Magnetic button | Standard hover/focus state |
| Physics cards | Static grid with CSS hover |
| Audio-reactive visuals | Static visual; audio still playable with controls |
| Video scrub | Poster image + normal video controls |
| Page transition | Standard navigation with a fast loading state |

## Budget Heuristics

Use qualitative budgets before measurement:

- **Low-cost libraries** (Lenis, `@use-gesture`, SplitType, Howler, Embla): safe defaults on most projects.
- **Medium-cost libraries** (GSAP + ScrollTrigger, Motion, Anime.js, OGL, Curtains, Matter.js, PixiJS): budget one or two per page, not all at once.
- **High-cost libraries** (Three.js, R3F + Drei, postprocessing, Rapier, WebGPU): budget one scene, lazy-load it, and define a low-tier fallback.
- **Asset cost often exceeds code cost.** A 4 MB GLB or 8 MB video is a bigger performance decision than a 30 KB library.

## Official Documentation

- GSAP: https://gsap.com/docs/
- Motion: https://motion.dev/docs
- Lenis: https://github.com/darkroomengineering/lenis
- Locomotive Scroll: https://github.com/locomotivemtl/locomotive-scroll
- Barba.js: https://barba.js.org/
- View Transitions API: https://developer.mozilla.org/docs/Web/API/View_Transition_API
- Three.js: https://threejs.org/docs/
- React Three Fiber: https://r3f.docs.pmnd.rs/
- Drei: https://drei.docs.pmnd.rs/
- OGL: https://github.com/oframe/ogl
- Curtains.js: https://www.curtainsjs.com/
- PixiJS: https://pixijs.com/
- Matter.js: https://brm.io/matter-js/
- Rapier: https://rapier.rs/
- p5.js: https://p5js.org/
- `@use-gesture`: https://use-gesture.netlify.app/
- SplitType: https://github.com/luncheon/split-type
- Lottie: https://airbnb.io/lottie/
- Howler.js: https://howlerjs.com/
- Embla: https://www.embla-carousel.com/
- Swiper: https://swiperjs.com/
- D3.js: https://d3js.org/
- Sanity: https://www.sanity.io/docs
- Prismic: https://prismic.io/docs
- Contentful: https://www.contentful.com/developers/docs/
- Strapi: https://docs.strapi.io/
- Directus: https://docs.directus.io/
