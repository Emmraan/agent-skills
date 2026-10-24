---
name: creative-web-orchestrator
description: Use when the user wants an Awwwards/FWA-level, cinematic, immersive, experimental, or "not a template" website — an agency site, portfolio, luxury/fashion brand, product launch, cultural/editorial experience, or flagship e-commerce front. Turns the brief into an experience plan with one signature moment, a purposeful effect inventory, a stack decision, a build order, and a definition of done covering motion, WebGL, accessibility, mobile fallback, and performance. Routes art direction to top-design/frontend-craft and library selection to creative-library-selector.
license: MIT
metadata:
  author: Emmraan
  version: 1.0.0
---

# Creative Web Orchestrator

Award-level websites are not a pile of libraries. They are a small number of deliberate ideas executed with unusual care. This skill is the entry point for that work: it turns a creative brief into an experience plan before any code is written, then routes each part of the build to the skill that owns it.

**Core principle:** one signature moment, supported by a quiet system — not ten effects competing for attention.

## When to Use

Activate when the request contains any of these signals:

- "Awwwards-level", "FWA-level", "award-winning", "site of the day", "showcase", "flagship".
- "Cinematic", "immersive", "experiential", "experimental", "editorial", "art-directed".
- "Make it feel alive", "make it memorable", "not a template", "not AI-generated", "wow factor".
- A creative agency, studio, portfolio, luxury/fashion, cultural, product-launch, or brand-experience site.
- A redesign where the site itself must demonstrate craft, not just communicate information.
- A request for a WebGL hero, scroll storytelling, page transitions, or a signature interaction as part of a broader site.

## When Not to Use

- **SaaS dashboard or app UI:** use `frontend-craft`, `refactoring-ui`, and `frontend-core`. Motion should be restrained and functional.
- **Content or SEO-first site where motion is not the product:** use `create-website`, `seo`, and `one-page-marketing`.
- **The user only asks which library to use:** go straight to `creative-library-selector`.
- **The design is already fixed and only implementation is needed:** go to `creative-motion-scroll`, `creative-webgl-shaders`, or `creative-interactions`.
- **The user has not decided the visual direction:** run `top-design` or `frontend-craft` first. This skill plans the experience; it does not invent the brand.

## Operating Principles

1. **One signature moment per page.** A signature moment is the thing a visitor describes to someone else. It can be a WebGL hero, a scroll-driven product reveal, a page transition, or a typographic sequence. One primary moment; at most one secondary.
2. **Every effect has a narrative job.** If an effect cannot be explained in one sentence — "it reveals the product as the user commits to scrolling" — remove it.
3. **Cap the effect families.** Use no more than three families from the list below. More than three usually means the concept is unclear.
4. **Progressive enhancement is mandatory.** The page must be readable, navigable, and conversion-capable with JavaScript disabled, WebGL unavailable, and reduced motion enabled.
5. **Performance is part of the design.** A 20 MB hero that stutters on a laptop is not premium. Budget it before building it.
6. **Derive, do not copy.** References set a quality bar and a mood. They are not layouts to clone.

## Phase 1 — Classify the Experience

State the archetype before planning. The archetype determines the motion posture.

| Archetype | Primary goal | Motion posture | Typical signature moment |
|---|---|---|---|
| Portfolio / personal | Demonstrate taste and capability | Expressive, authored | Case-study transition or cursor-led image reveal |
| Agency / studio | Prove craft through the site itself | Confident, editorial | Scroll-driven showreel or kinetic type |
| Luxury / fashion | Sell desire and exclusivity | Slow, restrained, tactile | Full-bleed image sequence with shader distortion |
| Product launch | Explain a new object or idea | Cinematic, paced | 3D product turntable or scroll-scrubbed reveal |
| Cultural / editorial | Create atmosphere and discovery | Layered, textural | Horizontal story gallery or generative background |
| Experimental / art | Create a memorable experience | Unrestricted | Physics, audio-reactive, or generative system |
| Flagship e-commerce | Convert without losing brand | Premium but efficient | Product configurator or transition into PDP |
| SaaS brand marketing | Explain a complex product | Crisp, restrained | One hero interaction that demonstrates the product |

If the archetype is ambiguous, ask one question: *"Is the site meant to impress, explain, or sell first?"* Do not ask more than three questions before producing a draft plan.

## Phase 2 — Write the Experience Brief

Produce this before selecting libraries. Keep it to one screen.

```text
AUDIENCE:
ONE JOB:              (the single outcome the page must produce)
EMOTION (3 words):
REFERENCES (2-3):     (quality + mood, not layouts to clone)
SIGNATURE MOMENT:     (one sentence; what the visitor remembers)
CONSTRAINTS:          (stack, CMS, deadline, brand rules, devices)
NOT DOING:            (effects or patterns explicitly out of scope)
```

Rules:

- The one job is a verb and an outcome, not a vibe: "make a creative director request the studio's reel", not "feel premium".
- References must be described by quality: "the pacing of X, the typography of Y, the restraint of Z".
- Write the "not doing" line. It prevents effect creep later.
- If the user cannot supply references, propose two directions and let them choose before planning the build.

## Phase 3 — Build the Effect Inventory

Inventory the effects section by section. This is the bridge between the brief and the stack.

| Section | Story beat | Effect | Why it earns its place | Tech family | Priority |
|---|---|---|---|---|---|
| Hero | Establish the world | Slow image scale + masked headline reveal | Creates arrival and focus | Typography + scroll | Must |
| Product | Reveal the object | Scroll-scrubbed 3D turntable | Lets the user inspect without a configurator | WebGL | Must |
| Story | Build desire | Horizontal image gallery | Changes reading rhythm | Scroll choreography | Should |
| Footer | Close | Magnetic CTA | Makes the final action feel crafted | Pointer interaction | Could |

Effect families:

- **Entrance / reveal** — load sequences, masks, staggered content.
- **Scroll choreography** — pinning, horizontal movement, parallax, scrubbed timelines.
- **Typography** — split text, kinetic type, variable-font axes, scramble.
- **Page transition** — overlay, shared element, view transition.
- **WebGL / shader** — 3D, distortion, particles, fluid, generative backgrounds.
- **Cursor / hover** — followers, magnetic targets, previews, distortion triggers.
- **Physics / gesture** — draggable objects, collisions, inertia, tilt.
- **Audio / video** — reactive visuals, scroll-scrubbed video, sound design.
- **SVG / morph** — path drawing, shape transitions, logo animation.

Inventory rules:

- Mark every effect `Must`, `Should`, or `Could`. Cut `Could` effects first when the budget tightens.
- At least one section must be quiet. Contrast is what makes the signature moment land.
- Every `Must` effect needs a static fallback and a mobile behavior.
- Do not list two effects that do the same job (for example, a custom cursor follower and a separate cursor trail).
- If the inventory needs more than three families, return to the brief and cut.

## Phase 4 — Select the Stack

Invoke `creative-library-selector` and require a decision table, not a list of packages:

```text
| Effect | Capability | Primary | Fallback | Rejected alternatives | Why |
```

Then require:

- **Dependency plan** — packages actually needed, with install commands.
- **Compatibility check** — React/Next SSR, Astro islands, vanilla, CMS, or static.
- **Performance budget** — JS weight, WebGL asset weight, target frame time, mobile tier.
- **Accessibility plan** — reduced motion, keyboard, focus, no-JS behavior.
- **Risks** — the two or three things most likely to break.

Hard rules:

- No library without a requirement.
- No two libraries in the same layer (two animation engines, two smooth-scroll systems, two physics engines).
- Prefer platform APIs (CSS scroll-driven animation, View Transitions, Canvas 2D) before adding a dependency.
- Prefer CSS/SVG before Canvas, and Canvas before WebGL, unless the effect genuinely requires the GPU.
- If the user already has a stack, respect it; do not introduce a second engine for a small effect.

## Phase 5 — Build in Layers

Build in this order. Each layer must work before the next is added.

1. **Content and semantics.** Real copy, headings, landmarks, links, alt text. The page must make sense as plain HTML.
2. **Layout, typography, color, responsive behavior.** The static design must already look intentional.
3. **Base motion.** Focus states, hover feedback, small reveals, reduced-motion defaults.
4. **Scroll choreography.** Lenis + ScrollTrigger (or the chosen equivalent), pinning, horizontal sections, scrubbed timelines.
5. **Signature effect.** The WebGL scene, shader, physics system, or audio-reactive layer — lazy-loaded and with a fallback.
6. **Page transitions.** Only after each page works independently.
7. **Performance and accessibility pass.** Measure, degrade, verify.
8. **Visual QA.** Check at 360 px, 768 px, 1440 px, and 1920 px; check with reduced motion and keyboard only.

Why this order: the static page is the fallback. If the signature effect fails, the site still works and still sells.

## Phase 6 — Verify

A build is done only when all of these are true.

| Area | Done means |
|---|---|
| Visual | Typography, spacing, and composition match the chosen direction at every breakpoint; no default-looking sections |
| Motion | One signature moment lands; all other motion supports it; nothing loops endlessly without a pause control |
| Performance | Target frame rate holds during scroll on a mid-range laptop; no long tasks over 200 ms; hero LCP within budget |
| Accessibility | Keyboard reaches every action; focus is visible; reduced motion removes non-essential movement; page transitions move focus |
| Mobile | Every effect has a touch behavior or a graceful fallback; no hover-only content; no horizontal scroll traps |
| No-JS / no-WebGL | Content is readable; navigation works; a static image or gradient replaces the 3D scene |
| Engineering | ScrollTriggers, Lenis, RAF loops, listeners, and WebGL resources are cleaned up on route change/unmount |
| Content | Real copy and real assets are used; no lorem ipsum, placeholder gradients, or fake metrics |

Do not claim "60fps" or "Awwwards-level" without measurement. Run the checks in `creative-web-performance`.

## Routing Table

| Need | Use |
|---|---|
| Art direction, composition, typography, color, motion theory | `top-design`, `web-typography` |
| Intent analysis, anti-AI-tell craft, mode selection | `frontend-craft`, `steve-jobs-design-review` |
| Library and stack decisions | `creative-library-selector` |
| Smooth scroll, pinning, horizontal galleries, page transitions | `creative-motion-scroll`, `gsap-scrolltrigger`, `gsap-timeline`, `barba-js` |
| WebGL, shaders, 3D, postprocessing | `creative-webgl-shaders`, `threejs-webgl`, `react-three-fiber`, `pixijs-2d` |
| Cursor, magnetic buttons, drag, tilt, kinetic type | `creative-interactions` |
| Runtime budgets, mobile degradation, launch checks | `creative-web-performance`, `frontend-performance` |
| Page structure, messaging, conversion | `create-website`, `one-page-marketing`, `cro-methodology` |

## Worked Example — Luxury Fashion Portfolio

**Brief**

```text
AUDIENCE: Creative directors and stylists evaluating the studio
ONE JOB: Request the lookbook
EMOTION: Restrained, tactile, confident
REFERENCES: the pacing of a fashion film, the typography of an editorial masthead
SIGNATURE MOMENT: A full-bleed image that distorts like fabric as the cursor moves
CONSTRAINTS: Next.js, client-editable case studies, must work on iPhone
NOT DOING: No audio autoplay, no custom cursor on touch, no horizontal scroll on mobile
```

**Effect inventory (three families)**

| Section | Effect | Family | Priority |
|---|---|---|---|
| Hero | Masked headline reveal + slow image scale | Typography + motion | Must |
| Selected work | Image planes with fabric-like distortion on hover | WebGL/shader | Must |
| Collection story | Pinned horizontal image sequence (desktop only) | Scroll choreography | Should |
| CTA | Magnetic "Request lookbook" button | Pointer interaction | Could |

**Stack decision**

- GSAP + ScrollTrigger for the entrance, pinning, and scrubbed sequences.
- Lenis for smooth scroll, driven by the GSAP ticker.
- GSAP SplitText for the headline reveal.
- OGL or Curtains.js for the image distortion planes, with a static image fallback.
- No physics engine, no second animation library, no PixiJS — none of the requirements need them.

**Build order**

Static editorial layout → type and image treatment → entrance and hover motion → pinned collection sequence → WebGL image planes (desktop, lazy) → mobile static fallback → performance and accessibility pass.

## Anti-Patterns

- **Effect soup.** Five signature moments on one page means none of them is a signature.
- **WebGL with no story.** A 3D blob that could be a static image is expensive decoration.
- **Smooth scroll on app UI.** Scroll hijacking breaks dashboards, forms, and keyboard users.
- **Reference cloning.** Copying a site's layout produces a worse version of that site, not a better version of this one.
- **Content hidden behind animation.** If the copy only appears after a scroll trigger, it does not exist for many users.
- **Mobile as an afterthought.** The signature effect must have a designed mobile behavior, not a broken desktop one.
- **Award-chasing over the brief.** The site still has a job. Craft serves the job.
- **Unmeasured performance claims.** "Buttery smooth" is a measurement, not an adjective.

## Related Skills

- `top-design` — art direction, composition, typography, and the Awwwards scoring rubric.
- `frontend-craft` — intent-first craft, mode classification, and anti-AI-tell rules.
- `creative-library-selector` — effect-to-library decisions and dependency plans.
- `creative-motion-scroll` — Lenis, GSAP, ScrollTrigger, and page transitions.
- `creative-webgl-shaders` — Three.js, R3F, OGL, Curtains, GLSL, and fallbacks.
- `creative-interactions` — cursor, magnetic, drag, tilt, and kinetic patterns.
- `creative-web-performance` — budgets, mobile tiers, cleanup, and launch checks.
- `frontend-performance` — general Core Web Vitals and Lighthouse work.
