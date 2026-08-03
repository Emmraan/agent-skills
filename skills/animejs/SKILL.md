---
name: animejs
description: Versatile JavaScript animation engine for DOM, CSS, SVG, and JavaScript objects. Use when creating timeline-based animations, stagger effects, SVG morphing, keyframe sequences, or complex choreographed animations. Triggers on tasks involving Anime.js, timeline animations, staggered sequences, SVG path animations, morphing, or multi-step animation choreography. Alternative to GSAP for SVG-heavy animations and React-independent projects.
license: MIT
metadata:
  author: freshtechbro
  version: 1.0.0
---

# Anime.js

Lightweight JavaScript animation library with powerful timeline and stagger capabilities for web animations.

## Overview

Anime.js (pronounced "Anime JS") is a versatile animation engine that works with DOM elements, CSS properties, SVG attributes, and JavaScript objects. Unlike React-specific libraries, Anime.js works with vanilla JavaScript and any framework.

**When to use this skill:**
- Timeline-based animation sequences with precise choreography
- Staggered animations across multiple elements
- SVG path morphing and drawing animations
- Keyframe animations with percentage-based timing
- Framework-agnostic animation (works with React, Vue, vanilla JS)
- Complex easing functions (spring, steps, cubic-bezier)

**Core features:**
- Timeline sequencing with relative positioning
- Powerful stagger utilities (grid, from center, easing)
- SVG morphing and path animations
- Built-in spring physics easing
- Keyframe support with flexible timing
- Small bundle size (~9KB gzipped)

## Core Concepts

### Basic Animation

The `anime()` function creates animations:

```javascript
import anime from 'animejs'

anime({
  targets: '.element',
  translateX: 250,
  rotate: '1turn',
  duration: 800,
  easing: 'easeInOutQuad'
})
```

### Targets

Multiple ways to specify animation targets:

```javascript
// CSS selector
anime({ targets: '.box' })

// DOM elements
anime({ targets: document.querySelectorAll('.box') })

// Array of elements
anime({ targets: [el1, el2, el3] })

// JavaScript object
const obj = { x: 0 }
anime({ targets: obj, x: 100 })
```

### Animatable Properties

**CSS Properties:**
```javascript
anime({
  targets: '.element',
  translateX: 250,
  scale: 2,
  opacity: 0.5,
  backgroundColor: '#FFF'
})
```

**CSS Transforms (Individual):**
```javascript
anime({
  targets: '.element',
  translateX: 250,   // Individual transform
  rotate: '1turn',   // Not 'transform: rotate()'
  scale: 2
})
```

**SVG Attributes:**
```javascript
anime({
  targets: 'path',
  d: 'M10 80 Q 77.5 10, 145 80', // Path morphing
  fill: '#FF0000',
  strokeDashoffset: [anime.setDashoffset, 0] // Line drawing
})
```

**JavaScript Objects:**
```javascript
const obj = { value: 0 }
anime({
  targets: obj,
  value: 100,
  round: 1,
  update: () => console.log(obj.value)
})
```

### Timeline

Create complex sequences with precise control:

```javascript
const timeline = anime.timeline({
  duration: 750,
  easing: 'easeOutExpo'
})

timeline
  .add({
    targets: '.box1',
    translateX: 250
  })
  .add({
    targets: '.box2',
    translateX: 250
  }, '-=500') // Start 500ms before previous animation ends
  .add({
    targets: '.box3',
    translateX: 250
  }, '+=200') // Start 200ms after previous animation ends
```

## Patterns & Reference

The full common patterns, integration recipes, performance guidance, and pitfall fixes for this library live in [references/patterns.md](references/patterns.md). Read the section relevant to the current task instead of the whole file; each section is self-contained with runnable examples.

## Resources

- scripts/ - automation and generator utilities for this library.
- references/ - API reference and pattern docs (see patterns.md for the moved patterns sections).
- assets/ - starter templates and examples.