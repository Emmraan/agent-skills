# Interaction Pattern Catalog

Each pattern includes the minimum viable implementation and the accessibility/touch branch. Decorative layers are always `aria-hidden="true"` and `pointer-events: none`.

## Shared Guards

```javascript
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const finePointer = window.matchMedia('(pointer: fine)')
```

Use `reduceMotion.matches` to skip non-essential motion and `finePointer.matches` to gate hover-only effects. Do not infer touch support from the user agent.

## 1. Magnetic Button

```javascript
import { gsap } from 'gsap'

const strength = 0.35

document.querySelectorAll('[data-magnetic]').forEach((button) => {
  const xTo = gsap.quickTo(button, 'x', { duration: 0.4, ease: 'power3.out' })
  const yTo = gsap.quickTo(button, 'y', { duration: 0.4, ease: 'power3.out' })

  button.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || reduceMotion.matches) return

    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2

    xTo(x * strength)
    yTo(y * strength)
  })

  const reset = () => {
    xTo(0)
    yTo(0)
  }

  button.addEventListener('pointerleave', reset)
  button.addEventListener('blur', reset)
})
```

The button remains a normal `<button>` or `<a>`. The transform is visual only; focus and click behavior do not change.

## 2. Custom Cursor / Follower

```css
.has-custom-cursor,
.has-custom-cursor a,
.has-custom-cursor button {
  cursor: none;
}

.cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border: 1px solid currentColor;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transition: width 0.25s ease, height 0.25s ease, opacity 0.25s ease;
}

.cursor.is-active {
  width: 56px;
  height: 56px;
}
```

```javascript
if (finePointer.matches && !reduceMotion.matches) {
  const cursor = document.querySelector('.cursor')
  document.documentElement.classList.add('has-custom-cursor')

  gsap.set(cursor, { xPercent: -50, yPercent: -50 })
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power2.out' })
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power2.out' })

  window.addEventListener('pointermove', (event) => {
    xTo(event.clientX)
    yTo(event.clientY)
  })

  document.querySelectorAll('a, button, [data-cursor]').forEach((target) => {
    target.addEventListener('pointerenter', () => cursor.classList.add('is-active'))
    target.addEventListener('pointerleave', () => cursor.classList.remove('is-active'))
  })
}
```

Do not hide the native cursor unless the custom cursor is actually rendered. Keep the custom cursor out of the accessibility tree.

## 3. Hover Image Preview

```html
<ul class="work-list">
  <li>
    <a href="/work/one" data-preview="/work/one.avif">Project One</a>
  </li>
  <li>
    <a href="/work/two" data-preview="/work/two.avif">Project Two</a>
  </li>
</ul>

<div class="preview" aria-hidden="true">
  <img alt="" />
</div>
```

```javascript
const preview = document.querySelector('.preview')
const previewImage = preview.querySelector('img')

if (finePointer.matches && !reduceMotion.matches) {
  document.querySelectorAll('[data-preview]').forEach((link) => {
    link.addEventListener('pointerenter', () => {
      previewImage.src = link.dataset.preview
      gsap.to(preview, { autoAlpha: 1, duration: 0.3 })
    })

    link.addEventListener('pointerleave', () => {
      gsap.to(preview, { autoAlpha: 0, duration: 0.2 })
    })
  })

  window.addEventListener('pointermove', (event) => {
    gsap.set(preview, { x: event.clientX + 24, y: event.clientY + 24 })
  })
}
```

Provide visible thumbnails or a tap-to-expand view for touch. Preload the images or use a low-quality placeholder to avoid a blank preview.

## 4. Tilt Card

```javascript
document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || reduceMotion.matches) return

    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      transformPerspective: 800,
      duration: 0.4,
      ease: 'power2.out',
    })
  })

  card.addEventListener('pointerleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' })
  })
})
```

Do not tilt cards that contain long-form reading content. The movement makes text harder to track.

## 5. Marquee

```html
<div class="marquee" aria-label="Selected clients">
  <div class="marquee__track">
    <span>Studio One</span>
    <span>Studio Two</span>
    <span>Studio Three</span>
    <!-- duplicate the list for a seamless loop -->
    <span aria-hidden="true">Studio One</span>
    <span aria-hidden="true">Studio Two</span>
    <span aria-hidden="true">Studio Three</span>
  </div>
</div>
```

```css
.marquee {
  overflow: hidden;
}

.marquee__track {
  display: flex;
  width: max-content;
  gap: 3rem;
  animation: marquee 24s linear infinite;
}

.marquee:hover .marquee__track,
.marquee:focus-within .marquee__track {
  animation-play-state: paused;
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee__track {
    animation: none;
    flex-wrap: wrap;
    width: auto;
  }
}
```

Keep the duplicated items `aria-hidden` so screen readers do not announce the list twice.

## 6. Drag Gallery with Embla

```javascript
import EmblaCarousel from 'embla-carousel'

const root = document.querySelector('.embla')
const embla = EmblaCarousel(root, {
  align: 'start',
  dragFree: true,
  containScroll: 'trimSnaps',
})

root.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    embla.scrollNext()
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    embla.scrollPrev()
  }
})
```

Make the gallery focusable (`tabindex="0"`) and label it. Native touch scrolling should remain available; do not call `preventDefault` on vertical touch movement.

For a CSS-only gallery, use `overflow-x: auto` + `scroll-snap-type: x mandatory` and visible scrollbar or arrows.

## 7. Kinetic Typography

```javascript
import { SplitText } from 'gsap/SplitText'

document.fonts.ready.then(() => {
  const split = new SplitText('.kinetic-title', { type: 'chars' })

  gsap.from(split.chars, {
    yPercent: 100,
    opacity: 0,
    stagger: 0.03,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.kinetic-title',
      start: 'top 80%',
      once: true,
    },
  })
})
```

Wrap the title in an `overflow: hidden` container. Keep the readable text in the DOM; do not animate body paragraphs character by character.

## 8. Text Scramble

```javascript
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin)

document.querySelectorAll('[data-scramble]').forEach((element) => {
  const finalText = element.textContent
  element.setAttribute('aria-label', finalText)

  ScrollTrigger.create({
    trigger: element,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(element, {
        duration: 1.2,
        scrambleText: {
          text: finalText,
          chars: '01<>/_',
          speed: 0.4,
        },
      })
    },
  })
})
```

Use it for short labels and headings, not paragraphs. The accessible name stays stable while the visual text animates.

## 9. Physics Cards with Matter.js

```javascript
import Matter from 'matter-js'

const container = document.querySelector('.physics-stage')
const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter

if (!reduceMotion.matches && finePointer.matches) {
  const engine = Engine.create()
  const render = Render.create({
    element: container,
    engine,
    options: {
      width: container.clientWidth,
      height: container.clientHeight,
      background: 'transparent',
      wireframes: false,
    },
  })

  const cards = [...container.querySelectorAll('.physics-card')].map((card, index) => {
    return Bodies.rectangle(
      80 + index * 150,
      100,
      120,
      80,
      { restitution: 0.6, friction: 0.2 }
    )
  })

  const ground = Bodies.rectangle(
    container.clientWidth / 2,
    container.clientHeight - 20,
    container.clientWidth,
    40,
    { isStatic: true }
  )

  Composite.add(engine.world, [...cards, ground])

  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } },
  })

  Composite.add(engine.world, mouseConstraint)
  Render.run(render)
  Runner.run(Runner.create(), engine)
}
```

Provide a static grid as the default markup. The canvas is an enhancement, not the only way to read the cards. Pause the runner when offscreen and destroy it on teardown.

## 10. Audio-Reactive Visuals

```javascript
const button = document.querySelector('[data-audio-toggle]')
let analyser
let data
let audioContext

button.addEventListener('click', async () => {
  if (audioContext) {
    await audioContext.resume()
    return
  }

  audioContext = new AudioContext()
  const audio = new Audio('/audio/track.mp3')
  audio.loop = true
  audio.muted = false

  const source = audioContext.createMediaElementSource(audio)
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 256

  source.connect(analyser)
  analyser.connect(audioContext.destination)

  await audio.play()
  data = new Uint8Array(analyser.frequencyBinCount)
})
```

```javascript
function readAudio() {
  if (!analyser || !data) return

  analyser.getByteFrequencyData(data)
  const bass = data.slice(0, 8).reduce((sum, value) => sum + value, 0) / 8

  gsap.set('.audio-visual', { scale: 1 + bass / 512 })
  requestAnimationFrame(readAudio)
}
```

Audio requires a user gesture, a visible mute/stop control, and a visual fallback. Do not autoplay background music.

## 11. SVG Morph

```javascript
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

gsap.registerPlugin(MorphSVGPlugin)

gsap.to('#shape-a', {
  morphSVG: '#shape-b',
  duration: 1,
  ease: 'power2.inOut',
})
```

Morphing works best when both paths have a similar number and order of points. Use `shapeIndex` to map points when they differ. Provide a static SVG for reduced motion.

## 12. Teardown

```javascript
function teardown() {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('resize', onResize)

  gsap.killTweensOf('[data-magnetic], .cursor, .preview, .tilt')

  embla?.destroy()
  runner?.stop()
  Matter.Engine.clear(engine)
  render?.canvas.remove()

  document.documentElement.classList.remove('has-custom-cursor')
}
```

Remove only the listeners and instances created by the interaction. Do not clear global GSAP state that other sections own.

## 13. Test Matrix

| Input | What to verify |
|---|---|
| Mouse | Hover preview, magnetic pull, tilt, cursor scale |
| Trackpad | Pointer frequency does not cause jank or overshoot |
| Touch | No hover trap; tap targets work; vertical scroll is not blocked |
| Keyboard | Tab reaches every control; arrows navigate galleries; Escape closes overlays |
| Reduced motion | Magnetic/cursor/tilt/parallax are disabled or simplified |
| Screen reader | Decorative layers hidden; accessible names stable |
| No JavaScript | Content and navigation remain usable |
| Low-end phone | No continuous loops, no physics engine, no heavy canvas |
