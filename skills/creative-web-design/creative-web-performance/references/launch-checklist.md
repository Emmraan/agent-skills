# Creative Site Launch Checklist

Run this before calling a motion-heavy site done. Tick only items with evidence.

## 1. Budget and Measurement

- [ ] Written budget exists for JS, hero assets, frame time, LCP, INP, and CLS.
- [ ] Initial JS is within budget, or the exception is documented.
- [ ] Route-level code splitting is in place.
- [ ] The hero LCP element is identified and measured on a throttled connection.
- [ ] INP is measured after hydration, not only on an idle page.
- [ ] CLS is measured with fonts, images, and lazy sections loaded.
- [ ] Lighthouse or WebPageTest baseline is recorded.
- [ ] Frame-level evidence exists from the Performance panel during scroll, not only an FPS counter.
- [ ] Tests include a real mid-range phone, not only an emulator.

## 2. Loading and Assets

- [ ] Meaningful HTML and CSS render before the main JS bundle executes.
- [ ] A poster, gradient, or placeholder is visible where the WebGL scene will appear.
- [ ] Three.js/R3F/OGL is dynamically imported and not in the initial bundle.
- [ ] Below-the-fold images use `loading="lazy"` and `decoding="async"`.
- [ ] The LCP image uses `fetchpriority="high"` and the correct dimensions.
- [ ] Images are served as AVIF/WebP with fallbacks.
- [ ] Models use Draco or Meshopt compression.
- [ ] Textures use KTX2/Basis or appropriately compressed formats.
- [ ] Fonts are subset, preloaded, and use `font-display: swap` plus `size-adjust`.
- [ ] No more than two font families and three weights are loaded.
- [ ] Video uses `poster`, `preload="metadata"`, `muted`, and `playsinline`; it does not autoplay a large file on mobile.
- [ ] Third-party scripts are audited and deferred.

## 3. Motion and Scroll

- [ ] One scroll system is active (native, Lenis, Locomotive, or ScrollSmoother — not two).
- [ ] One animation ticker drives the scroll (GSAP ticker or Lenis `autoRaf`, not both).
- [ ] `scroll-behavior: smooth` is removed when Lenis is active.
- [ ] ScrollTrigger measurements refresh after fonts, images, and route changes.
- [ ] `invalidateOnRefresh` is used for viewport-dependent values.
- [ ] Pinned sections are not inside transformed ancestors.
- [ ] Horizontal galleries use native scroll-snap on mobile.
- [ ] Full-screen sections use `svh`/`dvh`, not `100vh`.
- [ ] Entrance reveals use `once: true` where reversibility is unnecessary.
- [ ] Scroll handlers do not read layout on every frame.
- [ ] Reduced motion disables Lenis, pinning, scrubbing, and non-essential reveals.
- [ ] Keyboard scroll (`PageDown`, `Home`, `End`, arrows) still works.
- [ ] Anchor links land at the correct position.

## 4. WebGL and 3D

- [ ] WebGL is justified; a CSS/Canvas alternative was considered and rejected for a concrete reason.
- [ ] A static fallback exists for no-WebGL, reduced motion, and low-power devices.
- [ ] The renderer is created once and disposed on unmount.
- [ ] Geometries, materials, textures, and render targets are disposed.
- [ ] Pixel ratio is capped (≤ 2 desktop, ≤ 1.5 mobile).
- [ ] Resize uses the container, and the camera aspect updates.
- [ ] The render loop pauses when the tab is hidden and when the canvas is offscreen.
- [ ] Draw calls are under the budget; instancing/merging is used where appropriate.
- [ ] Postprocessing is disabled on low/medium tiers.
- [ ] `webglcontextlost` shows the fallback instead of a frozen canvas.
- [ ] Text and essential content are in the DOM, not only in the canvas.
- [ ] The canvas does not intercept clicks or scroll unless the interaction requires it.
- [ ] Tested on a real phone with the high tier forced and the fallback forced.

## 5. Interaction and Input

- [ ] Pointer effects are disabled on touch and reduced motion.
- [ ] `cursor: none` is scoped to fine-pointer devices.
- [ ] The custom cursor layer has `pointer-events: none`.
- [ ] Hover previews have a focus and tap equivalent.
- [ ] Magnetic/tilt effects reset on leave and blur.
- [ ] Drag galleries support arrow keys and native touch scroll.
- [ ] Marquees pause on hover and focus, and stop under reduced motion.
- [ ] Audio starts only after a user gesture and has a visible mute/stop control.
- [ ] No interaction blocks vertical scroll on mobile.
- [ ] Touch targets are at least 44×44 CSS pixels.

## 6. Accessibility

- [ ] Every interactive element is keyboard reachable.
- [ ] Focus is visible and not removed without a replacement.
- [ ] Page transitions move focus to the new main heading.
- [ ] Decorative cursor/canvas layers are `aria-hidden="true"`.
- [ ] Text scramble keeps a stable accessible name.
- [ ] Decorative motion respects `prefers-reduced-motion`.
- [ ] Color contrast passes WCAG AA for text and controls.
- [ ] Video has captions or a transcript; audio has a transcript.
- [ ] The site works at 200% zoom and 320 px width.
- [ ] Screen-reader smoke test completed on at least one platform.

## 7. Mobile and Low-Power

- [ ] High/medium/fallback tiers are implemented.
- [ ] Low-tier devices do not run postprocessing, physics, or continuous WebGL.
- [ ] The page does not overheat or drain battery in a 5-minute scroll test.
- [ ] The signature effect has a designed mobile behavior.
- [ ] No horizontal scroll trap.
- [ ] Tap targets and hover alternatives work with one hand.
- [ ] The layout is tested at 360 px, 390 px, 768 px, 1024 px, 1440 px, and 1920 px.

## 8. Content and Fallbacks

- [ ] Real copy and real assets are used; no lorem ipsum or placeholder metrics.
- [ ] The page is usable with JavaScript disabled.
- [ ] The page is usable with WebGL disabled.
- [ ] The page is usable with reduced motion enabled.
- [ ] Loading, empty, error, and slow-network states are designed.
- [ ] Images have alt text; decorative images use empty alt.
- [ ] The primary conversion action works without motion.

## 9. Cleanup and Memory

- [ ] ScrollTriggers and tweens are killed on unmount/route change.
- [ ] Lenis is destroyed and its ticker callback removed.
- [ ] RAF loops stop on teardown.
- [ ] Pointer/resize/scroll/visibility listeners are removed.
- [ ] IntersectionObserver and ResizeObserver are disconnected.
- [ ] Physics runners and worlds are stopped/cleared.
- [ ] WebGL resources and the renderer are disposed.
- [ ] A 10-minute route-change test shows stable memory.

## 10. Launch Monitoring

- [ ] Web Vitals are reported (LCP, INP, CLS) with a real-user sample.
- [ ] JavaScript errors are captured.
- [ ] WebGL context-loss events are captured.
- [ ] CDN caching and compression are enabled.
- [ ] A rollback path exists for the signature effect (feature flag or static variant).
- [ ] The team knows which tier each device class receives.

## 11. Evidence to Attach

- [ ] Lighthouse/WebPageTest summary.
- [ ] Performance panel screenshot during scroll.
- [ ] Mobile device and browser used for the test.
- [ ] Bundle analysis showing the initial and lazy chunks.
- [ ] Notes on any budget exception and why it is acceptable.
- [ ] A screen recording of the fallback path (no WebGL, reduced motion).
