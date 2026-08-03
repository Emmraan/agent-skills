---
name: lottie-animations
description: After Effects animation rendering for web and React applications. Use this skill when implementing Lottie animations, JSON vector animations, interactive animated icons, micro-interactions, or loading animations. Triggers on tasks involving Lottie, lottie-web, lottie-react, dotLottie, After Effects JSON export, bodymovin, animated SVG alternatives, or designer-created animations. Complements GSAP ScrollTrigger and Framer Motion for scroll-driven and interactive animations.
license: MIT
metadata:
  author: freshtechbro
  version: 1.0.0
---

# Lottie Animations

## Overview

Lottie is a library for rendering After Effects animations in real-time on web, iOS, Android, and React Native. Created by Airbnb, it allows designers to ship animations as easily as shipping static assets. Animations are exported from After Effects as JSON files using the Bodymovin plugin, then rendered natively with minimal performance overhead.

**When to use Lottie:**
- Designer-created animations that need pixel-perfect fidelity
- Complex animated icons and micro-interactions
- Loading animations and progress indicators
- Onboarding sequences and tutorial animations
- Marketing animations and promotional content
- Alternative to GIF/video with smaller file sizes and scalability

**Key advantages:**
- Vector-based (scalable without quality loss)
- Significantly smaller file sizes than GIF or video
- Editable at runtime (colors, speed, segments)
- Full designer control via After Effects
- Cross-platform rendering consistency
- Interactive controls (play, pause, seek, loop)

## Core Concepts

### Lottie Format Types

**1. JSON Lottie (.json)**
- Original Lottie format
- Exported from After Effects via Bodymovin plugin
- Human-readable JSON structure
- Larger file sizes (not compressed)
- Widely supported across all platforms

**2. dotLottie (.lottie)**
- Modern compressed format
- ZIP archive containing JSON + assets
- Supports multiple animations and themes in one file
- Smaller file sizes (up to 90% reduction)
- Recommended for production use

### Library Options

**lottie-web** (original library):
```javascript
import lottie from 'lottie-web';

lottie.loadAnimation({
  container: document.getElementById('lottie-container'),
  renderer: 'svg', // or 'canvas', 'html'
  loop: true,
  autoplay: true,
  path: 'animation.json' // or animationData: jsonData
});
```

**@lottiefiles/dotlottie-web** (modern, recommended):
```javascript
import { DotLottie } from '@lottiefiles/dotlottie-web';

new DotLottie({
  canvas: document.getElementById('canvas'),
  src: 'animation.lottie',
  autoplay: true,
  loop: true
});
```

**@lottiefiles/dotlottie-react** (React integration):
```jsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

<DotLottieReact
  src="animation.lottie"
  loop
  autoplay
  style={{ height: 300 }}
/>
```

**lottie-react** (alternative React wrapper):
```jsx
import Lottie from 'lottie-react';
import animationData from './animation.json';

<Lottie animationData={animationData} loop={true} />
```

### Animation Data Sources

**1. LottieFiles** (lottie.host)
- 100,000+ free animations
- Direct URL embedding
- CDN hosting

**2. Local JSON/dotLottie files**
- Bundled with application
- Better performance (no network request)
- Version control friendly

**3. After Effects export**
- Custom designer animations
- Bodymovin plugin required
- Export settings critical for file size

## Patterns & Reference

The full common patterns, integration recipes, performance guidance, and pitfall fixes for this library live in [references/patterns.md](references/patterns.md). Read the section relevant to the current task instead of the whole file; each section is self-contained with runnable examples.

## Resources

- scripts/ - automation and generator utilities for this library.
- references/ - API reference and pattern docs (see patterns.md for the moved patterns sections).
- assets/ - starter templates and examples.