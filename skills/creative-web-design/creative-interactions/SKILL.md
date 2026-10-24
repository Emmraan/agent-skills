---
name: creative-interactions
description: Use when implementing signature interaction details on a creative website — magnetic buttons, custom cursors, hover image previews, drag galleries, tilt cards, marquees, kinetic typography, text scramble, physics cards, or audio-reactive visuals. Covers pointer/touch/keyboard behavior, reduced-motion fallbacks, performance-safe pointer handling, and the accessibility rules that keep Awwwards-style interactions usable. For scroll choreography use creative-motion-scroll; for shader distortion use creative-webgl-shaders.
license: MIT
metadata:
  author: Emmraan
  version: 1.0.0
---

# Creative Interactions

The details users remember are usually small: a button that leans toward the pointer, an image that previews under the cursor, a title that decodes into place. These details fail when they replace a usable control with a toy.

**Core principle:** hover is an enhancement; the interaction must survive touch, keyboard, reduced motion, and no JavaScript.

## When to Use

- The design calls for magnetic buttons, a custom cursor, cursor trails, or hover previews.
- A gallery should be dragged, tilted, or explored with physical momentum.
- Typography should animate on scroll, hover, or entrance.
- A section needs a physics-based or audio-reactive signature moment.
- An existing creative interaction feels broken on touch or keyboard.
- Micro-interactions need to match the site's art direction without becoming noise.

## When Not to Use

- The interaction is a standard button, menu, or form: use `microinteractions` and `refactoring-ui`.
- The effect requires per-pixel GPU work: pair with `creative-webgl-shaders`.
- The interaction is really scroll choreography: use `creative-motion-scroll`.
- The project is a utility app where delight would slow the user down.
- The effect has no touch or keyboard equivalent and carries essential content.

## Interaction Principles

1. **Discoverability before delight.** If the user cannot tell the element is interactive, the animation is decoration.
2. **Pointer events, not mouse events.** `pointerenter`, `pointermove`, `pointerleave` cover mouse, pen, and touch. Pair with `pointerType` checks.
3. **Hover is never the only path.** Every hover preview, reveal, or distortion needs a tap, focus, or always-visible equivalent.
4. **Touch is not a smaller mouse.** Do not simulate hover on touch; design a tap or scroll behavior instead.
5. **Keyboard is a first-class input.** Focus order, visible focus rings, arrow-key navigation, and `Escape` to close.
6. **Reduced motion changes the interaction, not just the duration.** A magnetic button can become a standard button; a cursor follower can disappear.
7. **Performance is part of the feel.** Throttle pointer handlers with `requestAnimationFrame`; animate transforms, not layout.
8. **One signature interaction per page.** More than one competes for attention and doubles the maintenance surface.

## Pattern Catalog

| Pattern | Best technology | Complexity | Touch behavior | Fallback |
|---|---|---|---|---|
| Magnetic button | Pointer events + GSAP `quickTo` | Low | Standard button | Standard hover/focus |
| Custom cursor / follower | Pointer events + GSAP `quickTo` | Low–Medium | Hidden; native cursor | Native cursor |
| Cursor trail | Canvas or DOM + RAF | Medium | Hidden | None; it is decorative |
| Hover image preview | Pointer events + preloaded images | Low–Medium | Tap opens the item | Visible thumbnail |
| Image distortion on hover | WebGL shader | Medium–High | Tap/scroll effect or static | Static image |
| Marquee | CSS animation | Low | Continues or pauses | Static wrapped list |
| Drag gallery | Embla, Swiper, or GSAP Draggable | Low–Medium | Native swipe | Scroll-snap |
| Tilt card | Pointer events + transform | Low | No tilt; standard card | Standard card |
| Kinetic typography | GSAP SplitText | Medium | Same or simplified | Static text |
| Text scramble | GSAP ScrambleText | Low | Same | Static label |
| Physics cards | Matter.js or Rapier | Medium–High | Static grid | Static grid |
| Audio-reactive visuals | Web Audio API | Medium | Same, with controls | Static visual |
| SVG morph | GSAP MorphSVG or flubber | Medium | Same | Static SVG |
| Page transition | Barba.js or View Transitions | Medium | Same | Normal navigation |

Detailed code for the most common patterns lives in [references/pattern-catalog.md](references/pattern-catalog.md).

## Pointer Handling

Use one pointer listener per interactive surface, not one per element, and throttle visual updates with RAF.

```javascript
function onPointerMove(event) {
  if (event.pointerType === 'touch') return

  if (!frame) {
    frame = requestAnimationFrame(() => {
      update(event.clientX, event.clientY)
      frame = 0
    })
  }
}
```

Rules:

- Read `getBoundingClientRect()` once on enter or resize, not on every move.
- Use `gsap.quickTo()` for smooth following; it reuses a single tween.
- Reset transforms on `pointerleave` and on `blur`.
- Disable pointer effects when `(pointer: coarse)` or `(prefers-reduced-motion: reduce)` matches.
- Do not set `cursor: none` globally; hide the native cursor only on fine-pointer devices and only when a custom cursor is actually rendered.

## Accessibility Checklist

- Every interactive element is reachable by `Tab`.
- Focus is visible and not removed by `outline: none` without a replacement.
- Hover-only content has a focus and tap equivalent.
- Custom cursors do not hide the focus ring or the text caret.
- Drag interactions have keyboard controls (arrow keys, buttons, or a list view).
- Marquees pause on hover and focus, and stop under reduced motion.
- Audio never autoplays; a visible mute/stop control exists.
- Text scramble does not change the accessible name; keep the final text in the DOM.
- Decorative canvas and cursor layers are `aria-hidden="true"` and `pointer-events: none`.
- Touch targets are at least 44×44 CSS pixels.
- `Escape` closes overlays and returns focus to the trigger.

## Performance Rules

- Animate `transform` and `opacity`; avoid `top`, `left`, `width`, and `height`.
- Throttle pointer movement to one update per frame.
- Avoid layout reads in the pointer handler; cache the rect.
- Use `will-change: transform` only while the interaction is active.
- Do not run a physics engine, canvas, or WebGL scene for a decorative hover.
- Pause loops when the element is offscreen or the tab is hidden.
- Test with a trackpad, a mouse, a pen, and a phone. Trackpads produce very different event frequency.

## Common Failures

| Symptom | Cause | Fix |
|---|---|---|
| Cursor disappears on touch | `cursor: none` applied globally | Scope it to `(pointer: fine)` |
| Links are hard to click | Cursor layer intercepts pointer events | `pointer-events: none` on the visual layer |
| Hover content is inaccessible | No focus/tap equivalent | Add focus and tap behavior |
| Janky cursor | Layout read or state update per move | Cache rect, use `quickTo`, RAF-throttle |
| Magnetic button drifts | Transform not reset | Reset on leave/blur and when reduced motion changes |
| Drag gallery traps scroll | `preventDefault` on touch | Let vertical scroll pass; use `touch-action: pan-y` |
| Scramble breaks screen readers | Accessible name comes from animated spans | Keep a stable `aria-label` or hidden final text |
| Physics cards never settle | No damping or sleep threshold | Add damping and a static fallback |
| Audio starts unexpectedly | Autoplay or no gesture | Start only after a click; default muted |

## Definition of Done

- The interaction works with mouse, touch, and keyboard.
- A visible focus state exists.
- Reduced motion removes or simplifies the interaction.
- The page is usable with JavaScript disabled.
- Decorative layers are hidden from assistive technology.
- Pointer handlers are RAF-throttled and do not read layout every frame.
- The interaction is tested on a real phone and a trackpad.
- It is one of no more than two signature interactions on the page.

## Related Skills

- `creative-motion-scroll` — scroll-driven reveals, pinning, and page transitions.
- `creative-webgl-shaders` — distortion, particles, and GPU-based interactions.
- `creative-web-performance` — runtime budgets and launch checks.
- `microinteractions` — the four-part structure of feedback, triggers, rules, and loops.
- `frontend-craft` — intent-first craft and anti-AI-tell rules.
