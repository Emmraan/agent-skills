---
name: creative-library-selector
description: Use when choosing the technical stack for a creative or Awwwards-level website, or when the user asks "which library should I use for..." smooth scrolling, scroll-linked animation, page transitions, image distortion, WebGL/3D, shaders, cursor effects, physics, text animation, audio-reactive visuals, or carousels. Maps each requested effect to a rendering capability and selects the simplest library that delivers it, with use/avoid rules, alternatives, compatibility checks, overlap rules, and a dependency plan. Prevents library stacking and unnecessary WebGL. Pairs with creative-web-orchestrator for the experience plan and the implementation skills for recipes.
license: MIT
metadata:
  author: Emmraan
  version: 1.0.0
---

# Creative Library Selector

The agent's job is not to know every library. It is to know which capability an effect requires, and to choose the smallest tool that provides it.

**Core rule:** never select a library because it exists. Select it because a detected visual or interaction requirement needs it. Prefer the simplest technology capable of producing the requested effect. Avoid overlapping libraries unless there is a concrete reason.

## When to Use

Activate when:

- The user asks which library, framework, or stack to use for a creative site or a specific effect.
- A brief contains effects but no stack: smooth scroll, horizontal gallery, image distortion, 3D product, page transitions, magnetic cursor, text reveal, particles, physics, audio-reactive.
- An existing project has performance or conflict problems caused by overlapping libraries.
- The agent is about to install a package for a visual effect and needs to justify the choice.
- The user asks whether to use GSAP, Motion, Three.js, R3F, Lenis, Locomotive, Barba, Matter.js, PixiJS, OGL, or Curtains for a task.

## When Not to Use

- The user already chose a library and only needs implementation help: go to that library's skill.
- The task is a standard SaaS UI with no creative-motion requirement: use `frontend-craft` and `frontend-performance`.
- The visual direction is undecided: run `top-design` first; the stack follows the design, not the reverse.
- The question is about a CMS, hosting, or backend: use the relevant category.

## The Selection Algorithm

Run these steps in order. State the outcome of each step so the decision is reviewable.

### 1. Restate the effect as observable behavior

Convert vague language into something testable.

- "Make it feel premium" → "the page eases into position over 900 ms and settles without bounce".
- "Cool image effect" → "the image bends toward the pointer and returns to rest on leave".
- "3D product" → "the user can rotate the object 360° and see material changes".

If the effect cannot be described observably, it is not ready to select a library for.

### 2. Classify the effect family

Use one family per requirement:

- entrance / timeline / reveal
- scroll choreography (pin, scrub, horizontal, parallax)
- smooth scrolling
- typography animation
- page transition
- 2D GPU rendering
- 3D / scene graph
- shader / image distortion
- physics
- gesture / drag
- cursor / hover
- audio / video
- carousel / slider
- data visualization
- CMS / content modeling

### 3. Climb the platform-first ladder

Stop at the first rung that can deliver the effect at the required quality:

1. **HTML + CSS** — transitions, keyframes, `clip-path`, masks, gradients, `:has()`, container queries.
2. **CSS scroll-driven animations** — simple progress-linked effects without JavaScript.
3. **SVG** — path drawing, masks, filters, morphing with SMIL or CSS where supported.
4. **Web Animations API** — small imperative UI motion with no dependency.
5. **Canvas 2D** — particles, trails, custom drawing without GPU complexity.
6. **WebGL** — shaders, 3D, image displacement, large particle fields, postprocessing.
7. **WebGPU** — only when the project can require it and has a WebGL fallback.

Do not jump to WebGL because it sounds more impressive. A CSS gradient is often the better answer.

### 4. Check runtime and framework constraints

| Constraint | What it rules out or changes |
|---|---|
| React / Next.js with SSR | Favor `motion`, `@react-three/fiber`, `lenis/react`, `useGSAP`; guard browser APIs |
| Astro islands | Vanilla libraries are cheapest; avoid hydrating a React-only library for one effect |
| Vue / Svelte | GSAP, Motion (vanilla), Lenis, Three.js; check framework wrappers |
| Vanilla / static | GSAP, Lenis, OGL, Curtains, Matter.js, p5.js, Barba.js |
| Webflow / no-code | GSAP and custom code embeds; avoid React-only dependencies |
| CMS-managed content | Keep effects content-agnostic; do not hardcode layout assumptions |
| Multi-page site | Barba.js or View Transitions API |
| Single-page app | Framework transitions; do not add Barba.js |

### 5. Check the budget

For each candidate, estimate:

- **JS cost** — bundle size and parse/execute cost.
- **GPU cost** — draw calls, shader complexity, texture memory.
- **Main-thread cost** — scroll handlers, layout reads, per-frame allocations.
- **Asset cost** — models, textures, video, audio.
- **Mobile behavior** — does it degrade, or does it need to be disabled?

If the effect cannot fit the budget on the target device, change the effect, not just the library.

### 6. Choose primary, fallback, and rejected alternatives

Every row in the decision table must have:

- a **primary** library or platform feature,
- a **fallback** for unsupported devices or reduced motion,
- at least one **rejected** alternative and the reason.

"Rejected: none" is acceptable only when no credible alternative exists.

### 7. Emit the dependency plan

Do not start coding before producing this artifact.

```markdown
## Effect → Stack Decision

| # | Requirement | Effect family | Capability | Primary | Fallback | Rejected | Why |
|---|---|---|---|---|---|---|---|

## Dependency Plan

- Runtime: React 19 / Next.js 15 / vanilla / Astro
- Packages: ...
- Removed from consideration: ...
- Estimated JS weight: ...
- WebGL assets: ...

## Install

```bash
# exact commands
```

## Budget

- Target frame time:
- Mobile tier:
- LCP / INP / CLS targets:
- Max WebGL asset weight:

## Accessibility

- Reduced motion:
- Keyboard:
- Touch:
- No-JS / no-WebGL:

## Risks

- ...
```

## Hard Selection Rules

1. **One engine per layer.** Do not run GSAP and Motion for the same animation system. Do not run Lenis and Locomotive together. Do not run Matter.js and Rapier in the same 2D scene.
2. **One scroll system.** Native scroll, Lenis, Locomotive, or GSAP ScrollSmoother — choose one. Two systems fight over the same scroll position.
3. **No library for a one-line effect.** If a CSS transition or 10 lines of vanilla JavaScript solves it, do not add a dependency.
4. **No WebGL for DOM-achievable effects.** Use WebGL when the effect needs per-pixel work, 3D, or thousands of independent elements.
5. **No smooth scroll on app-like UI.** Dashboards, forms, editors, and long-reading documentation should keep native scrolling.
6. **No hover-only interaction without a touch and keyboard path.** Hover is an enhancement, never the only route to content.
7. **Respect the existing stack.** If the project already uses GSAP, do not add Motion for a reveal. If it already uses Three.js, do not add OGL for one plane.
8. **Prefer maintained libraries.** Check last release, open issues, and framework compatibility. Do not build a new project on an abandoned package.
9. **No autoplay audio.** Audio requires a user gesture, a visible control, and a mute default.
10. **No effect without a fallback.** Every `Must` effect needs a static or reduced version.

## Capability Matrix (Summary)

The full matrix, library cards, and compatibility notes live in [references/library-capability-matrix.md](references/library-capability-matrix.md) and [references/library-cards.md](references/library-cards.md).

| Requirement | Primary | Alternatives | Avoid when |
|---|---|---|---|
| Timeline / complex sequencing | GSAP | Anime.js, Motion | The effect is one CSS transition |
| Scroll-linked animation | GSAP ScrollTrigger | Motion `useScroll`, CSS scroll-driven | Native scroll is sufficient |
| Smooth scrolling | Lenis | Locomotive Scroll, native CSS | App-like UI, accessibility-critical |
| Text splitting | GSAP SplitText | SplitType | Text is short or must remain selectable per character |
| Page transitions (MPA) | Barba.js | View Transitions API | React SPA, or no real navigation |
| React UI / layout motion | Motion | React Spring (existing code) | Server-rendered page with no hydration |
| SVG / small UI sequences | Anime.js | GSAP, CSS | Large coordinated timelines |
| 3D scene graph | Three.js | Babylon.js, PlayCanvas | A single shader plane |
| React 3D | React Three Fiber + Drei | Three.js in an effect | No React runtime |
| Shader plane / image distortion | OGL or Curtains.js | Three.js / R3F | CSS filters already achieve the look |
| 2D sprites / particles | PixiJS | Canvas 2D | A few DOM elements |
| Postprocessing | `@react-three/postprocessing` | Three.js EffectComposer | Mobile low-tier devices |
| GPU shaders | GLSL | TSL (WebGPU path) | The effect is a gradient |
| 2D physics | Matter.js | Rapier (2D) | Static layout |
| 3D physics | Rapier | Cannon-es | Simple collision checks |
| Generative art | p5.js | Canvas 2D | Production UI layout |
| Gestures / drag | `@use-gesture` | GSAP Draggable | Native touch scrolling works |
| Custom cursor | GSAP `quickTo` | Shery.js | Touch-only or reduced-motion users |
| Audio playback | Howler.js | Web Audio API | Autoplay background music |
| Audio-reactive visuals | Web Audio API + AnalyserNode | Tone.js | No user gesture or no mute control |
| Carousel | Embla Carousel | Swiper, native scroll-snap | CSS scroll-snap is enough |
| Data visualization | D3.js | Chart library | Decorative fake charts |
| CMS | Sanity, Prismic, Contentful | Strapi, Directus | Content is static |

## Overlap Rules

| Layer | Pick one | Why |
|---|---|---|
| Animation engine | GSAP **or** Motion **or** Anime.js | Competing tickers, duplicated easing, conflicting transforms |
| Smooth scroll | Lenis **or** Locomotive **or** native | Two scroll systems produce jitter and broken anchors |
| 3D renderer | Three.js/R3F **or** Babylon **or** PlayCanvas | Duplicate WebGL contexts and scene graphs |
| 2D GPU | PixiJS **or** Canvas 2D | Unnecessary GPU overhead for simple drawing |
| DOM-to-WebGL | Curtains **or** OGL **or** custom Three.js | Three ways to manage the same planes |
| Physics | Matter.js **or** Rapier | Duplicate simulation loops |
| Page transitions | Barba **or** View Transitions **or** framework transition | Competing navigation interception |
| Text splitting | SplitText **or** SplitType | Double-wrapped spans break layout and accessibility |
| Carousel | Embla **or** Swiper | Two gesture systems on one track |

## Stack Compatibility

| Stack | Smooth default | 3D | Page transitions | Notes |
|---|---|---|---|---|
| Next.js / React | Motion + Lenis | R3F + Drei | Next/Very framework transition or Motion | Use `useGSAP` if GSAP is chosen; guard `window` |
| Astro | Lenis + GSAP | Three.js or OGL in an island | View Transitions API | Keep interactive islands small |
| Vue / Nuxt | GSAP + Lenis | Three.js | Nuxt page transitions | Avoid React-only wrappers |
| Svelte / SvelteKit | GSAP + Lenis | Three.js | Svelte transitions | Check lifecycle cleanup |
| Vanilla / static | GSAP + Lenis | Three.js or OGL | Barba.js or View Transitions | Simplest compatibility |
| Webflow | GSAP | Custom embed / Three.js | Webflow interactions or Barba | Avoid React-only libraries |

## Worked Example — Luxury Fashion Portfolio

**Request:** smooth scrolling, horizontal collection gallery, fabric-like image distortion on hover, cinematic page transitions, masked headline reveal.

| Requirement | Capability | Primary | Fallback | Rejected | Why |
|---|---|---|---|---|---|
| Smooth scroll | Scroll interpolation | Lenis | Native scroll | Locomotive | Lenis is smaller, maintained, and pairs cleanly with ScrollTrigger |
| Masked headline | Text splitting + timeline | GSAP SplitText | SplitType + GSAP | Motion | GSAP is already required for scroll work |
| Horizontal gallery | Scroll-linked transform | GSAP ScrollTrigger | CSS scroll-snap | Motion `useScroll` | Pinning and scrub are more precise in ScrollTrigger |
| Fabric distortion | GPU shader | OGL | Curtains.js | Three.js/R3F | No scene graph needed; one shader plane is enough |
| Page transitions | MPA transition | Barba.js | View Transitions API | Full reload | The site is multi-page and needs shared-element continuity |
| Magnetic CTA | Pointer interaction | GSAP `quickTo` | CSS transform | Shery.js | One small interaction does not justify another library |

**Dependency plan:** `gsap`, `lenis`, `ogl`, `@barba/core`. Four packages total, not twenty.

## Anti-Patterns

- **The starter-pack install.** Adding GSAP, Motion, Anime.js, Three.js, R3F, PixiJS, and Lenis "just in case".
- **Library-first reasoning.** "Let's use Three.js" before deciding what the user should see or feel.
- **WebGL for a hover state.** A CSS filter or SVG displacement is often enough.
- **Two animation engines.** They fight over transforms and tickers, and double the bundle.
- **Ignoring framework lifecycle.** ScrollTriggers, listeners, and WebGL contexts that are never cleaned up.
- **Desktop-only decisions.** Every choice must answer: what happens on a phone, with reduced motion, and without JavaScript?
- **Adding a library for one helper.** Write the ten lines or use the platform API.
- **Abandoned dependencies.** Check maintenance before adopting; a demo repo is not a production dependency.

## Related Skills

- `creative-web-orchestrator` — builds the experience plan that feeds this selector.
- `creative-motion-scroll` — implements the motion and scroll choices.
- `creative-webgl-shaders` — implements the WebGL and shader choices.
- `creative-interactions` — implements cursor, drag, tilt, and kinetic patterns.
- `creative-web-performance` — sets the budgets that constrain the choice.
- `gsap-core`, `gsap-scrolltrigger`, `threejs-webgl`, `react-three-fiber`, `motion`, `barba-js`, `pixijs-2d` — API-level depth.
