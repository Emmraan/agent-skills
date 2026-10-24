---
name: creative-motion-scroll
description: Use when implementing premium motion and scroll behavior on a creative website — smooth scrolling, GSAP ScrollTrigger pinning, horizontal galleries, parallax, scroll-velocity effects, masked text reveals, or cinematic page transitions. Covers the canonical GSAP + ScrollTrigger + Lenis + SplitText stack, Barba.js and View Transitions, ticker wiring, cleanup, refresh order, reduced motion, and the mobile/accessibility failure modes that make award-style sites feel broken. For library selection use creative-library-selector; for WebGL use creative-webgl-shaders.
license: MIT
metadata:
  author: Emmraan
  version: 1.0.0
---

# Creative Motion and Scroll

Motion is not decoration added after layout. It is the reading rhythm of the page. This skill covers the stack that carries that rhythm: GSAP for choreography, ScrollTrigger for scroll-linked behavior, Lenis for the feel of the scroll itself, and a deliberate transition layer between pages.

**Core principle:** one scroll system, one animation ticker, one owner for every transform.

## When to Use

- Smooth scrolling with Lenis (or a deliberate decision to keep native scroll).
- ScrollTrigger pinning, scrubbing, snapping, parallax, horizontal galleries, or progress-linked sequences.
- Masked text reveals, line-by-line entrances, or kinetic typography tied to scroll.
- Page transitions on a multi-page site with Barba.js or the View Transitions API.
- Scroll-velocity effects, skew, or inertia.
- Debugging jitter, stale triggers, double RAF loops, or broken anchors after adding smooth scroll.

## When Not to Use

- The UI is a dashboard, form, editor, or documentation site: keep native scrolling and use `microinteractions` for feedback.
- The effect is a simple hover or entrance: use CSS or `motion`; do not add a scroll system.
- The project is a React SPA with no real page navigation: use the framework's transition tools, not Barba.js.
- The performance problem is general Core Web Vitals, not motion: use `frontend-performance`.
- The effect needs per-pixel GPU work: pair this skill with `creative-webgl-shaders`.

## The Canonical Stack

| Layer | Default | Why |
|---|---|---|
| Scroll feel | Lenis | Small, maintained, predictable, pairs cleanly with ScrollTrigger |
| Choreography | GSAP | Timelines, scrub, pin, reverse, and precise easing |
| Scroll triggers | GSAP ScrollTrigger | Pinning, scrubbing, snapping, batching, refresh control |
| Text splitting | GSAP SplitText | Robust line/word/char splitting with re-splitting; free with GSAP |
| Page transitions | Barba.js or View Transitions | Barba for control across browsers; native for progressive enhancement |

Do not add a second engine for the same layer. If the project already uses Motion for React UI, GSAP can still own scroll timelines, but each library must own a distinct set of properties.

## Wiring Lenis to GSAP

The most common failure is running two animation loops. Let the GSAP ticker drive Lenis.

```javascript
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  // syncTouch stays false: native touch scrolling is usually better
})

lenis.on('scroll', ScrollTrigger.update)

const tick = (time) => lenis.raf(time * 1000)
gsap.ticker.add(tick)
gsap.ticker.lagSmoothing(0)

// cleanup
export function destroyScroll() {
  gsap.ticker.remove(tick)
  lenis.destroy()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
}
```

Rules:

- `lenis.raf(time * 1000)` because the GSAP ticker passes seconds and Lenis expects milliseconds.
- `gsap.ticker.lagSmoothing(0)` prevents a long frame from warping the scroll feel.
- Do not also call `requestAnimationFrame` for Lenis.
- If Lenis is scoped to a custom wrapper, set up `ScrollTrigger.scrollerProxy`; for the default window scroll, do not.
- Remove the CSS `scroll-behavior: smooth`; it conflicts with Lenis.

### React

Use `lenis/react` and disable its internal RAF when GSAP drives the loop.

```jsx
import { ReactLenis } from 'lenis/react'
import { useGSAP } from '@gsap/react'

export function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }} autoRaf={false}>
      {children}
    </ReactLenis>
  )
}
```

Inside components, use `useGSAP(() => { ... }, { scope: containerRef })` so tweens and ScrollTriggers are reverted on unmount.

## Scroll Patterns

### Pinned hero or sticky section

```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: '+=120%',
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
  },
})
.to('.hero__image', { scale: 1.15, ease: 'none' }, 0)
.to('.hero__title', { yPercent: -20, ease: 'none' }, 0)
```

Use `pin: true` only when the section must remain in view while its internal timeline advances. Do not pin a section that contains another pinned section.

### Horizontal gallery

```javascript
const track = document.querySelector('.gallery__track')
const distance = () => track.scrollWidth - window.innerWidth

gsap.to(track, {
  x: () => -distance(),
  ease: 'none',
  scrollTrigger: {
    trigger: '.gallery',
    start: 'top top',
    end: () => `+=${distance()}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
  },
})
```

On mobile, replace the pinned horizontal gallery with native horizontal scroll-snap. It is faster, more accessible, and matches platform expectations.

### Parallax layers

```javascript
gsap.utils.toArray('[data-parallax]').forEach((layer) => {
  const depth = Number(layer.dataset.parallax) || 0.2
  gsap.to(layer, {
    yPercent: -depth * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: layer,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
})
```

Keep parallax subtle. Large opposing movements cause motion sickness and expose layout gaps.

### Masked text reveal

```javascript
const split = new SplitText('.headline', {
  type: 'lines,words',
  linesClass: 'line',
})

gsap.from(split.words, {
  yPercent: 120,
  opacity: 0,
  duration: 1,
  stagger: 0.04,
  ease: 'power3.out',
})
```

Wrap each line in an `overflow: hidden` container so words rise from behind a mask. Re-split on resize only if the line breaks must be recalculated.

### Scroll velocity

```javascript
let velocity = 0

lenis.on('scroll', ({ velocity: v }) => {
  velocity = gsap.utils.clamp(-20, 20, v)
})

gsap.ticker.add(() => {
  gsap.to('.velocity-layer', {
    skewY: velocity * 0.15,
    duration: 0.5,
    overwrite: true,
  })
})
```

Clamp the value. Unclamped velocity effects produce violent skew on trackpads and mobile.

### Batched reveals

```javascript
ScrollTrigger.batch('[data-reveal]', {
  start: 'top 85%',
  once: true,
  onEnter: (elements) => {
    gsap.from(elements, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
    })
  },
})
```

## Page Transitions

### Barba.js

Barba owns navigation between server-rendered pages. The transition must:

1. Kill the old page's ScrollTriggers and Lenis instance.
2. Animate the current container out.
3. Swap the container.
4. Re-initialize page scripts and scroll.
5. Move focus to the new page's main heading.
6. Refresh ScrollTrigger after images and fonts settle.

```javascript
import barba from '@barba/core'
import { gsap } from 'gsap'

barba.init({
  transitions: [{
    name: 'fade',
    async leave({ current }) {
      await gsap.to(current.container, { opacity: 0, duration: 0.4 })
    },
    async enter({ next }) {
      window.scrollTo(0, 0)
      await gsap.from(next.container, { opacity: 0, duration: 0.6 })
    },
    after() {
      document.querySelector('main h1')?.focus()
      ScrollTrigger.refresh()
    },
  }],
})
```

In a real build, re-initialize the page's scroll setup in `after`, not once at load. Do not leave the old Lenis instance running.

### View Transitions API

For a multi-page site, the native approach needs no navigation interception in supporting browsers:

```css
@view-transition {
  navigation: auto;
}

.hero-image {
  view-transition-name: hero-image;
}
```

For a same-document update (SPA or filtered list):

```javascript
if (document.startViewTransition) {
  document.startViewTransition(() => updateDOM())
} else {
  updateDOM()
}
```

Use few named elements. Every `view-transition-name` must be unique on the page. Test reduced motion and older browsers; the fallback is a normal navigation.

## Refresh and Lifecycle

ScrollTrigger measures the page. If the page changes after measurement, the triggers are wrong.

- Call `ScrollTrigger.refresh()` after fonts load: `document.fonts.ready.then(() => ScrollTrigger.refresh())`.
- Call it after images above the fold decode, after accordions change height, and after route transitions.
- Use `invalidateOnRefresh: true` for values that depend on viewport size or content width.
- Do not call `refresh()` inside a scroll handler. It causes loops and jank.
- In React, `useGSAP` reverts tweens and triggers automatically. In vanilla, keep a registry and kill on teardown.

## Accessibility and Mobile

Motion is optional. Content is not.

- **Reduced motion:** use `gsap.matchMedia()` and skip Lenis, pinning, scrubbing, and long reveals when `(prefers-reduced-motion: reduce)` matches. Show the final state immediately.
- **Keyboard:** smooth scroll must not break `PageDown`, `Home`, `End`, arrow keys, or anchor links. Test with Lenis enabled.
- **Focus:** after a page transition, move focus to the new `<main>` or `<h1>`; announce the route change.
- **No-JS:** content must be visible without JavaScript. Do not set `opacity: 0` in CSS for elements that only a script reveals; add the hidden state from JavaScript.
- **Touch:** do not enable `syncTouch` by default; native touch scrolling is more predictable. Never trap vertical scroll inside a horizontal gallery.
- **Viewport units:** use `svh`/`dvh`, not `100vh`, for full-screen pinned sections on mobile browsers.
- **Motion sickness:** avoid large parallax, fast scrub, and continuous skew. Keep the signature motion in one place.

## Performance Rules

- Animate `transform` and `opacity`. Avoid `top`, `left`, `width`, `height`, `margin`, and `filter` on scroll.
- Cache measurements outside the scroll handler; do not read layout in a loop.
- Use `ScrollTrigger.batch` for lists instead of one trigger per item.
- Limit `will-change` to elements that are actively animating; remove it after.
- Pause offscreen video, canvas, and WebGL; do not keep rendering a section the user cannot see.
- Prefer `once: true` for entrance reveals; not every element needs a reversible trigger.
- Test on a mid-range phone with CPU throttling. Desktop Chrome is not evidence.

## Common Failures

| Symptom | Likely cause | Fix |
|---|---|---|
| Jitter or double-speed scroll | Two RAF loops or two scroll systems | Drive Lenis from the GSAP ticker; remove Locomotive/ScrollSmoother |
| Triggers fire at the wrong position | Layout changed after measurement | `ScrollTrigger.refresh()` after fonts/images; `invalidateOnRefresh` |
| Pinned section jumps | Pinned inside a transformed ancestor | Move the pin to a non-transformed parent |
| Horizontal gallery is broken on mobile | Pinned track on a narrow viewport | Switch to native scroll-snap below a breakpoint |
| Page transition leaves stale animations | Old triggers not killed | Kill triggers and destroy Lenis on leave; re-init on enter |
| Text reveal flashes unstyled text | Split after paint, or hidden state in CSS | Set hidden state in JS, split after `document.fonts.ready` |
| Anchor links overshoot | Native smooth scroll fighting Lenis | Remove `scroll-behavior: smooth`; use Lenis `scrollTo` |
| `100vh` section is cut off on iOS | Mobile browser chrome | Use `100svh`/`100dvh` |
| Reduced-motion users still get motion | No `matchMedia` branch | Gate all non-essential motion and Lenis |

## Definition of Done

- One scroll system and one animation ticker are active.
- Pinning, horizontal movement, and parallax have mobile behavior.
- `ScrollTrigger.refresh()` runs after fonts and route changes.
- All triggers, tickers, listeners, and Lenis instances are destroyed on teardown.
- Reduced motion shows content immediately with no pinning or scrub.
- Keyboard scroll, anchors, and focus work.
- The page is usable with JavaScript disabled.
- Performance is measured on a throttled mid-range device, not just a desktop.

## Related Skills

- `creative-library-selector` — decides whether Lenis, ScrollTrigger, Barba, or a simpler option is warranted.
- `creative-webgl-shaders` — syncs shader uniforms and 3D cameras with scroll.
- `creative-interactions` — cursor, magnetic, drag, and hover motion.
- `creative-web-performance` — runtime budgets and launch checks.
- `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-react`, `barba-js`, `motion` — API-level depth.
