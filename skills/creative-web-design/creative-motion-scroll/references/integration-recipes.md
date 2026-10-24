# Motion and Scroll Integration Recipes

Copy the pattern that matches the stack. Every recipe includes cleanup and a reduced-motion branch; both are part of the implementation, not optional polish.

## 1. Vanilla Lenis + GSAP + ScrollTrigger

```javascript
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

let lenis = null
let tick = null

function initScroll() {
  if (reduceMotion.matches) {
    document.documentElement.classList.add('reduced-motion')
    return
  }

  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
  })

  lenis.on('scroll', ScrollTrigger.update)

  tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
}

function destroyScroll() {
  if (tick) gsap.ticker.remove(tick)
  if (lenis) lenis.destroy()
  tick = null
  lenis = null
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
}

initScroll()

// Re-measure after webfonts settle.
document.fonts.ready.then(() => ScrollTrigger.refresh())

reduceMotion.addEventListener('change', () => {
  destroyScroll()
  initScroll()
  ScrollTrigger.refresh()
})
```

**Do not** add a second `requestAnimationFrame` loop for Lenis. **Do not** keep `scroll-behavior: smooth` in CSS while Lenis is active.

## 2. React Lenis + useGSAP

```jsx
import { useRef } from 'react'
import { ReactLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Experience() {
  const root = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.reveal', {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.reveal-grid',
          start: 'top 80%',
          once: true,
        },
      })
    })

    return () => mm.revert()
  }, { scope: root })

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }} autoRaf={false}>
      <main ref={root}>
        <section className="reveal-grid">
          <h1 className="reveal">...</h1>
          <p className="reveal">...</p>
        </section>
      </main>
    </ReactLenis>
  )
}
```

`autoRaf={false}` is important: the GSAP ticker must be the single owner of the loop. If you do not use GSAP, leave `autoRaf` on.

## 3. Pinned Horizontal Gallery (desktop only)

```javascript
const mm = gsap.matchMedia()

mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
  const gallery = document.querySelector('.gallery')
  const track = gallery.querySelector('.gallery__track')
  const distance = () => track.scrollWidth - window.innerWidth

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: gallery,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  })

  return () => {
    tween.scrollTrigger?.kill()
    tween.kill()
    gsap.set(track, { clearProps: 'transform' })
  }
})
```

Mobile CSS fallback:

```css
@media (max-width: 1023px), (prefers-reduced-motion: reduce) {
  .gallery__track {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }

  .gallery__item {
    flex: 0 0 85%;
    scroll-snap-align: start;
  }
}
```

## 4. Masked SplitText Reveal

```css
.line {
  display: block;
  overflow: hidden;
}

.line > span {
  display: block;
  will-change: transform;
}
```

```javascript
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

document.fonts.ready.then(() => {
  const split = new SplitText('.headline', {
    type: 'lines,words',
    linesClass: 'line',
  })

  gsap.from(split.words, {
    yPercent: 120,
    duration: 1,
    stagger: 0.04,
    ease: 'power3.out',
    onComplete: () => split.revert(),
  })
})
```

Keep the original text accessible. SplitText keeps the source text for screen readers; do not also duplicate the heading in an `aria-label`.

For responsive line breaks, re-split on resize:

```javascript
let split

const build = () => {
  split?.revert()
  split = new SplitText('.headline', { type: 'lines,words', linesClass: 'line' })
}

build()
window.addEventListener('resize', debounce(build, 200))
```

## 5. Barba.js Transition with Cleanup

```javascript
import barba from '@barba/core'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function initPageScripts() {
  // page-specific reveals, galleries, media
}

barba.hooks.beforeLeave(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  // destroy the page's Lenis instance here
})

barba.hooks.afterEnter(() => {
  initPageScripts()
  document.querySelector('main h1')?.focus()
  ScrollTrigger.refresh()
})

barba.init({
  transitions: [{
    name: 'fade',
    async leave({ current }) {
      await gsap.to(current.container, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
      })
    },
    async enter({ next }) {
      window.scrollTo(0, 0)
      await gsap.from(next.container, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
    },
  }],
})
```

Add a loading state for slow navigations. Do not animate out and then leave the user on a blank screen while the next page loads; prefetch on hover where possible.

## 6. View Transitions

**Multi-page site (supporting browsers):**

```css
@view-transition {
  navigation: auto;
}

.hero-image {
  view-transition-name: hero-image;
}
```

**Same-document update:**

```javascript
function navigate(update) {
  if (!document.startViewTransition) {
    update()
    return
  }

  document.startViewTransition(() => update())
}
```

**Reduced motion:**

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

The fallback is a normal navigation. The site must work without the API.

## 7. Scroll Velocity Skew

```javascript
let current = 0
let target = 0

lenis.on('scroll', ({ velocity }) => {
  target = gsap.utils.clamp(-12, 12, velocity)
})

gsap.ticker.add(() => {
  current += (target - current) * 0.08
  target *= 0.92

  gsap.set('.velocity-layer', {
    skewY: current * 0.15,
    transformOrigin: 'center',
  })
})
```

Rules:

- Clamp the velocity.
- Smooth the value; do not map raw wheel deltas directly.
- Disable under reduced motion and on touch.
- Never apply this to body copy or form fields.

## 8. Refresh After Fonts, Images, and Route Changes

```javascript
async function refreshWhenReady() {
  await document.fonts.ready

  const images = [...document.images].filter((img) => !img.complete)
  await Promise.all(
    images.map((img) =>
      img.decode().catch(() => {})
    )
  )

  ScrollTrigger.refresh()
}

refreshWhenReady()
```

For dynamic content:

```javascript
const observer = new ResizeObserver(() => {
  ScrollTrigger.refresh()
})

observer.observe(document.querySelector('.dynamic-section'))
```

Debounce the observer. Do not call `refresh()` on every resize event.

## 9. Reduced-Motion Branch

```javascript
const mm = gsap.matchMedia()

mm.add('(prefers-reduced-motion: reduce)', () => {
  gsap.set('[data-reveal]', { clearProps: 'all', opacity: 1, y: 0 })
  document.documentElement.classList.add('reduced-motion')
})

mm.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.from('[data-reveal]', {
    y: 40,
    opacity: 0,
    stagger: 0.08,
    scrollTrigger: {
      trigger: '[data-reveal-grid]',
      start: 'top 80%',
      once: true,
    },
  })
})
```

CSS safety net:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The CSS rule is a backstop, not a substitute for a deliberate reduced-motion design.

## 10. Teardown Checklist

Before removing a page or unmounting a component:

```javascript
// 1. Kill ScrollTriggers created by this page.
ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

// 2. Remove the GSAP ticker callback.
gsap.ticker.remove(tick)

// 3. Destroy Lenis.
lenis?.destroy()

// 4. Remove listeners and observers.
window.removeEventListener('resize', onResize)
resizeObserver.disconnect()
intersectionObserver.disconnect()

// 5. Revert SplitText.
split?.revert()

// 6. Clear inline transforms left by tweens.
gsap.set('[data-reveal]', { clearProps: 'all' })
```

If the page uses WebGL, also dispose geometries, materials, textures, and the renderer. See `creative-webgl-shaders`.

## 11. Debug Checklist

- Add `markers: true` to one trigger at a time; remove before shipping.
- Check the trigger's `start` and `end` against the actual layout.
- Confirm the scroller is `window`, not a custom wrapper.
- Confirm no ancestor has `transform`, `filter`, or `perspective` when using `pin`.
- Confirm `ScrollTrigger.refresh()` runs after fonts and images.
- Confirm only one ticker is running in the Performance panel.
- Test with 4x CPU throttling and on a real phone.
