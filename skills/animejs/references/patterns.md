# animejs - Patterns, Integrations, Performance & Pitfalls

(Full detail moved here so SKILL.md stays within the 500-line spec. Each section below is self-contained.)

## Common Patterns

### 1. Stagger Animation (Sequential Reveal)

```javascript
anime({
  targets: '.stagger-element',
  translateY: [100, 0],
  opacity: [0, 1],
  delay: anime.stagger(100), // Increase delay by 100ms
  easing: 'easeOutQuad',
  duration: 600
})
```

### 2. Stagger from Center

```javascript
anime({
  targets: '.grid-item',
  scale: [0, 1],
  delay: anime.stagger(50, {
    grid: [14, 5],
    from: 'center', // Also: 'first', 'last', index, [x, y]
    axis: 'x'       // Also: 'y', null
  }),
  easing: 'easeOutQuad'
})
```

### 3. SVG Line Drawing

```javascript
anime({
  targets: 'path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutQuad',
  duration: 2000,
  delay: (el, i) => i * 250
})
```

### 4. SVG Morphing

```javascript
anime({
  targets: '#morphing-path',
  d: [
    { value: 'M10 80 Q 77.5 10, 145 80' }, // Start shape
    { value: 'M10 80 Q 77.5 150, 145 80' }  // End shape
  ],
  duration: 2000,
  easing: 'easeInOutQuad',
  loop: true,
  direction: 'alternate'
})
```

### 5. Timeline Sequence

```javascript
const tl = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750
})

tl.add({
  targets: '.title',
  translateY: [-50, 0],
  opacity: [0, 1]
})
.add({
  targets: '.subtitle',
  translateY: [-30, 0],
  opacity: [0, 1]
}, '-=500')
.add({
  targets: '.button',
  scale: [0, 1],
  opacity: [0, 1]
}, '-=300')
```

### 6. Keyframe Animation

```javascript
anime({
  targets: '.element',
  keyframes: [
    { translateX: 100 },
    { translateY: 100 },
    { translateX: 0 },
    { translateY: 0 }
  ],
  duration: 4000,
  easing: 'easeInOutQuad',
  loop: true
})
```

### 7. Scroll-Triggered Animation

```javascript
const animation = anime({
  targets: '.scroll-element',
  translateY: [100, 0],
  opacity: [0, 1],
  easing: 'easeOutQuad',
  autoplay: false
})

window.addEventListener('scroll', () => {
  const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
  animation.seek(animation.duration * scrollPercent)
})
```

## Integration Patterns

### With React

```javascript
import { useEffect, useRef } from 'react'
import anime from 'animejs'

function AnimatedComponent() {
  const ref = useRef(null)

  useEffect(() => {
    const animation = anime({
      targets: ref.current,
      translateX: 250,
      duration: 800,
      easing: 'easeInOutQuad'
    })

    return () => animation.pause()
  }, [])

  return <div ref={ref}>Animated</div>
}
```

### With Vue

```javascript
export default {
  mounted() {
    anime({
      targets: this.$el,
      translateX: 250,
      duration: 800
    })
  }
}
```

### Path Following Animation

```javascript
const path = anime.path('#motion-path')

anime({
  targets: '.element',
  translateX: path('x'),
  translateY: path('y'),
  rotate: path('angle'),
  easing: 'linear',
  duration: 2000,
  loop: true
})
```

## Advanced Techniques

### Spring Easing

```javascript
anime({
  targets: '.element',
  translateX: 250,
  easing: 'spring(1, 80, 10, 0)', // mass, stiffness, damping, velocity
  duration: 2000
})
```

### Steps Easing

```javascript
anime({
  targets: '.element',
  translateX: 250,
  easing: 'steps(5)',
  duration: 1000
})
```

### Custom Bezier

```javascript
anime({
  targets: '.element',
  translateX: 250,
  easing: 'cubicBezier(.5, .05, .1, .3)',
  duration: 1000
})
```

### Direction and Loop

```javascript
anime({
  targets: '.element',
  translateX: 250,
  direction: 'alternate', // 'normal', 'reverse', 'alternate'
  loop: true,             // or number of iterations
  easing: 'easeInOutQuad'
})
```

### Playback Control

```javascript
const animation = anime({
  targets: '.element',
  translateX: 250,
  autoplay: false
})

animation.play()
animation.pause()
animation.restart()
animation.reverse()
animation.seek(500) // Seek to 500ms
```

## Performance Optimization

### Use Transform and Opacity

```javascript
// ✅ Good: GPU-accelerated
anime({
  targets: '.element',
  translateX: 250,
  opacity: 0.5
})

// ❌ Avoid: Triggers layout
anime({
  targets: '.element',
  left: '250px',
  width: '500px'
})
```

### Batch Similar Animations

```javascript
// ✅ Single animation for multiple targets
anime({
  targets: '.multiple-elements',
  translateX: 250
})

// ❌ Avoid: Multiple separate animations
elements.forEach(el => {
  anime({ targets: el, translateX: 250 })
})
```

### Use `will-change` for Complex Animations

```css
.animated-element {
  will-change: transform, opacity;
}
```

### Disable autoplay for Scroll Animations

```javascript
const animation = anime({
  targets: '.element',
  translateX: 250,
  autoplay: false // Control manually
})
```

## Common Pitfalls

### 1. Forgetting Unit Types

```javascript
// ❌ Wrong: No unit
anime({ targets: '.element', width: 200 })

// ✅ Correct: Include unit
anime({ targets: '.element', width: '200px' })
```

### 2. Using CSS transform Property Directly

```javascript
// ❌ Wrong: Can't animate transform string
anime({ targets: '.element', transform: 'translateX(250px)' })

// ✅ Correct: Individual transform properties
anime({ targets: '.element', translateX: 250 })
```

### 3. Not Handling Animation Cleanup

```javascript
// ❌ Wrong: Animation continues after unmount
useEffect(() => {
  anime({ targets: ref.current, translateX: 250 })
}, [])

// ✅ Correct: Pause on cleanup
useEffect(() => {
  const anim = anime({ targets: ref.current, translateX: 250 })
  return () => anim.pause()
}, [])
```

### 4. Animating Too Many Elements

```javascript
// ❌ Avoid: Animating 1000+ elements
anime({ targets: '.many-items', translateX: 250 }) // 1000+ elements

// ✅ Better: Use CSS animations for large sets
// Or reduce element count with virtualization
```

### 5. Incorrect Timeline Timing

```javascript
// ❌ Wrong: Missing offset operator
.add({ targets: '.el2' }, '500') // Treated as absolute time

// ✅ Correct: Use relative operators
.add({ targets: '.el2' }, '-=500') // Relative to previous
.add({ targets: '.el3' }, '+=200') // Relative to previous
```

### 6. Overusing Loop

```javascript
// ❌ Avoid: Infinite loops drain battery
anime({
  targets: '.element',
  rotate: '1turn',
  loop: true,
  duration: 1000
})

// ✅ Better: Use CSS animations for infinite loops
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## Resources

### Scripts
- `animation_generator.py` - Generate Anime.js animation boilerplate (8 types)
- `timeline_builder.py` - Build complex timeline sequences

### References
- `api_reference.md` - Complete Anime.js API documentation
- `stagger_guide.md` - Stagger utilities and patterns
- `timeline_guide.md` - Timeline sequencing deep dive

### Assets
- `starter_animejs/` - Vanilla JS + Vite template with examples
- `examples/` - Real-world patterns (SVG morphing, stagger grids, timelines)

## Related Skills

- **gsap-scrolltrigger** - More powerful timeline features and scroll integration
- **motion-framer** - React-specific declarative animations
- **react-spring-physics** - Physics-based spring animations
- **lightweight-3d-effects** - Simple 3D effects (Zdog, Vanta.js)

**Anime.js vs GSAP**: Use Anime.js for SVG-heavy animations, simpler projects, or when bundle size matters. Use GSAP for complex scroll-driven experiences, advanced timelines, and professional-grade control.

**Anime.js vs Framer Motion**: Use Anime.js for framework-agnostic projects or when working outside React. Use Framer Motion for React-specific declarative animations with gesture integration.