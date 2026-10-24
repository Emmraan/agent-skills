---
name: creative-web-performance
description: Use when shipping or reviewing a motion-heavy, WebGL, or Awwwards-style website and the experience must stay smooth on real devices. Sets creative-specific budgets for JS, frame time, draw calls, textures, video, and fonts; covers lazy-loading WebGL, pausing offscreen loops, mobile quality tiers, cleanup on route changes, reduced motion, and a launch test matrix. Defers general Lighthouse and Core Web Vitals work to frontend-performance while adding the GPU, shader, and scroll-loop checks that creative sites fail on.
license: MIT
metadata:
  author: Emmraan
  version: 1.0.0
---

# Creative Web Performance

An award-level site that stutters on a laptop or overheats a phone is not award-level. Creative performance is mostly about **what you choose not to render**.

**Core principle:** measure on the devices your audience actually uses, then degrade the experience deliberately instead of letting the browser degrade it for you.

## When to Use

- A creative site is approaching launch and needs a performance pass.
- Scroll feels janky, the cursor lags, or the page drops frames after a WebGL hero is added.
- A 3D scene, shader, video, or particle system needs a mobile quality tier.
- Route changes leave old ScrollTriggers, RAF loops, listeners, or WebGL contexts running.
- The team needs a concrete budget before building the signature effect.
- The user asks why the site is slow despite a good Lighthouse score.

## When Not to Use

- The problem is general LCP/INP/CLS, bundle analysis, caching, or server response time: use `frontend-performance`.
- The site has no motion or WebGL: use `frontend-performance` and `high-perf-browser`.
- The issue is a specific library's API: use that library's skill.
- The task is visual QA only: use `top-design` or `frontend-craft`.

## Set the Budget Before Building

Write the budget into the project docs. A signature effect without a budget becomes an unbounded asset.

| Budget | Starting target | Notes |
|---|---|---|
| Initial JS | ≤ 200 KB gzip | Exclude lazy-loaded WebGL chunks; justify any excess |
| Route-level JS | ≤ 100 KB gzip per route | Code-split below-the-fold sections |
| Hero LCP | ≤ 2.5 s on 4G / mid-range phone | Stricter 95-grade target may apply from `frontend-performance` |
| INP | ≤ 200 ms | Long tasks from hydration and scroll handlers are the usual cause |
| CLS | ≤ 0.1 | Reserve space for media, fonts, and lazy content |
| Frame time | 16.7 ms desktop, 33 ms mobile floor | Measure during scroll, not idle |
| Main-thread use | < 50% during scroll | Leave headroom for input |
| WebGL draw calls | < 100 per frame | Lower for mobile |
| Device pixel ratio | ≤ 2 desktop, ≤ 1.5 mobile | Never render at 3x |
| Hero WebGL assets | ≤ 3 MB compressed | Lazy-load everything below the fold |
| GPU texture memory | Well under 100 MB on mobile | Compress textures; dispose unused ones |
| Fonts | 1–2 families, 2–3 weights | Subset; preload only the critical face |
| Long tasks | < 200 ms | Break up hydration and heavy initialization |

Adjust the numbers for the brief, but write them down. "It feels fast on my machine" is not a budget.

## Loading Strategy

Build the static page first; add the expensive layers after.

1. **Critical HTML and CSS first.** The page must render meaningful content before any JavaScript bundle executes.
2. **Hero poster immediately.** Show a compressed image, gradient, or blurred placeholder where the WebGL scene will appear.
3. **Lazy-load WebGL.** Use dynamic `import()` when the canvas approaches the viewport. Do not ship Three.js/R3F in the initial bundle for a below-the-fold scene.
4. **Preload only the critical path.** Hero image, primary font, and above-the-fold CSS. Do not preload every case-study image.
5. **Code-split routes and sections.** A case-study page should not download the homepage's WebGL scene.
6. **Use `fetchpriority="high"` on the LCP image**, `loading="lazy"` and `decoding="async"` elsewhere.
7. **Compress media.** AVIF/WebP for images, KTX2/Basis for textures, Draco/Meshopt for models, H.264/HEVC or AV1 for video.
8. **Subset fonts.** `font-display: swap`, `size-adjust` to reduce CLS, and preload only the face used above the fold.
9. **Do not autoplay large video on mobile.** Use a poster and a play control, or a short muted loop with `playsinline`.

## Runtime Rules

### One loop, many effects

- One `requestAnimationFrame` owner per page. If GSAP drives Lenis, do not also start a Lenis RAF.
- One WebGL renderer per canvas; do not create a new renderer on every React render.
- Pause all loops when the tab is hidden: `document.visibilitychange`.
- Pause WebGL, video, and physics when the section is offscreen: `IntersectionObserver`.
- Use `frameloop="demand"` in R3F for static scenes; call `invalidate()` only when something changes.

### Avoid layout thrash

- Read layout once, cache the values, then write transforms.
- Do not call `getBoundingClientRect()` inside a scroll or pointer loop.
- Do not animate `width`, `height`, `top`, `left`, `margin`, or `filter` during scroll.
- Use `content-visibility: auto` and `contain-intrinsic-size` for long below-the-fold sections.
- Batch DOM reads and writes; use `ScrollTrigger.batch` for lists.

### Clean up on route change and unmount

Every page must release:

- ScrollTriggers and GSAP timelines.
- Lenis instance and its ticker callback.
- `requestAnimationFrame` loops.
- Pointer, resize, scroll, and visibility listeners.
- `IntersectionObserver` and `ResizeObserver`.
- Physics runners and Matter/Rapier worlds.
- WebGL geometries, materials, textures, render targets, and the renderer.
- Video elements and audio contexts.

A leaked WebGL context or ticker is often the reason a site gets slower after the third navigation.

### Memory

- Dispose GPU resources explicitly; JavaScript garbage collection does not free GPU memory.
- Watch `renderer.info.memory.geometries`, `.textures`, and `renderer.info.render.calls` during development.
- Reuse geometries and materials instead of recreating them every frame.
- Avoid allocating arrays, vectors, or objects inside the render loop.
- Test a 10-minute session with repeated route changes; memory should plateau, not climb.

## Mobile Quality Tiers

Design three tiers up front.

| Tier | Detection | Behavior |
|---|---|---|
| High | Desktop, recent phone, capable GPU | Full scene, postprocessing, DPR 2, high-res assets |
| Medium | Mid-range phone or laptop | DPR 1.5, simplified shader, no postprocessing, fewer particles |
| Low / fallback | Low core count, reduced motion, no WebGL, slow connection | Static poster or CSS composition; no continuous loop |

```javascript
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const coarsePointer = window.matchMedia('(pointer: coarse)').matches
const cores = navigator.hardwareConcurrency ?? 4
const memory = navigator.deviceMemory ?? 8

const tier =
  reduceMotion || !hasWebGL()
    ? 'fallback'
    : coarsePointer || cores <= 4 || memory <= 4
      ? 'medium'
      : 'high'
```

Feature-detect; do not rely on user-agent strings. Give the user a way to reduce effects if the site is decorative-heavy (a "reduce motion" or "low power" toggle is a legitimate accessibility feature).

## What Usually Breaks

| Bottleneck | Symptom | Fix |
|---|---|---|
| Three.js in the initial bundle | Slow LCP, high TBT | Dynamic import the scene; show a poster first |
| DPR 3 on mobile | Hot phone, low FPS | Cap at 1.5–2 |
| Postprocessing on mobile | Frame drops, battery drain | Disable below the high tier |
| Uncompressed GLB/textures | Long load, memory pressure | Draco/Meshopt + KTX2 |
| Per-frame React state | Re-renders and jank | Mutate refs/uniforms; `useFrame` without `setState` |
| Scroll handler + layout reads | Jank while scrolling | `ScrollTrigger.scrub`, cached measurements |
| Multiple RAF loops | Double-speed motion, CPU burn | One loop; drive Lenis from GSAP |
| Leaked renderer | Memory climbs after navigation | Dispose on unmount; remove canvas |
| Large hero video | Slow LCP, data cost | Poster + short loop, or a static image |
| Font soup | FOIT/FOUT, layout shift | 1–2 families, subset, preload, `size-adjust` |
| Hydration of the whole page | Long tasks, delayed interaction | Islands or partial hydration |
| Autoplay audio | Surprise, battery, accessibility failure | User gesture + visible control |

## Test Matrix

Measure on devices, not only in DevTools.

| Test | What it catches |
|---|---|
| Desktop Chrome + Safari + Firefox | Rendering differences, backdrop-filter, scroll behavior |
| Real iPhone (Safari) | 100vh, touch scroll, video, memory pressure |
| Real mid-range Android | GPU limits, DPR, thermal throttling |
| 4x CPU throttle + Fast 3G | Hydration cost, bundle weight |
| WebGL disabled | Fallback path |
| `prefers-reduced-motion: reduce` | Motion and Lenis branches |
| Keyboard only | Focus, scroll traps, drag alternatives |
| Screen reader (VoiceOver/NVDA) | Hidden content, animated labels, canvas-only text |
| Repeated route changes (10 min) | Leaked contexts, listeners, tickers |
| Battery/thermal check | Continuous WebGL or video loops |

Run Lighthouse or WebPageTest for the baseline, then use the Performance panel for frame-level evidence. A green lab score does not prove smooth scroll on a phone.

## Definition of Done

- The budget is written down and met, or the exception is documented.
- The static page renders before JavaScript finishes.
- WebGL and below-the-fold media are lazy-loaded.
- The high/medium/fallback tiers are implemented and tested.
- Reduced motion is honored, including Lenis and scroll scrubbing.
- No leaked tickers, listeners, triggers, or WebGL contexts after route changes.
- The site is tested on at least one real phone, not only an emulator.
- The launch checklist in [references/launch-checklist.md](references/launch-checklist.md) is complete.

## Related Skills

- `frontend-performance` — general Core Web Vitals, bundling, caching, and Lighthouse.
- `high-perf-browser` — browser rendering and network-level optimization.
- `creative-motion-scroll` — Lenis/ScrollTrigger lifecycle and cleanup.
- `creative-webgl-shaders` — GPU budgets, disposal, and quality tiers.
- `creative-interactions` — pointer performance and accessibility.
- `threejs-webgl` — Three.js-specific memory and draw-call rules.
