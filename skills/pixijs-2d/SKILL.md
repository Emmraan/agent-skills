---
name: pixijs-2d
description: Fast, lightweight 2D rendering engine for creating interactive graphics, particle effects, and canvas-based applications using WebGL/WebGPU. Use this skill when building 2D games, particle systems, interactive canvases, sprite animations, or UI overlays on 3D scenes. Triggers on tasks involving PixiJS, 2D rendering, sprite sheets, particle effects, filters, or high-performance canvas graphics. Alternative to Canvas2D with WebGL acceleration for rendering thousands of sprites at 60 FPS.
license: MIT
metadata:
  author: freshtechbro
  version: 1.0.0
---

# PixiJS 2D Rendering Skill

Fast, lightweight 2D rendering engine for creating interactive graphics, particle effects, and canvas-based applications using WebGL/WebGPU.

---

## When to Use This Skill

Trigger this skill when you encounter:
- "Create 2D particle effects" or "animated particles"
- "2D sprite animation" or "sprite sheet handling"
- "Interactive canvas graphics" or "2D game"
- "UI overlays on 3D scenes" or "HUD layer"
- "Draw shapes programmatically" or "vector graphics API"
- "Optimize rendering performance" or "thousands of sprites"
- "Apply visual filters" or "blur/displacement effects"
- "Lightweight 2D engine" or "alternative to Canvas2D"

**Use PixiJS for**: High-performance 2D rendering (up to 100,000+ sprites), particle systems, interactive UI, 2D games, data visualization with WebGL acceleration.

**Don't use for**: 3D graphics (use Three.js/R3F), simple animations (use Motion/GSAP), basic DOM manipulation.

---

## Core Concepts

### 1. Application & Renderer

The entry point for PixiJS applications:

```javascript
import { Application } from 'pixi.js';

const app = new Application();

await app.init({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
  antialias: true,  // Smooth edges
  resolution: window.devicePixelRatio || 1
});

document.body.appendChild(app.canvas);
```

**Key Properties**:
- `app.stage`: Root container for all display objects
- `app.renderer`: WebGL/WebGPU renderer instance
- `app.ticker`: Update loop for animations
- `app.screen`: Canvas dimensions

---

### 2. Sprites & Textures

Core visual elements loaded from images:

```javascript
import { Assets, Sprite } from 'pixi.js';

// Load texture
const texture = await Assets.load('path/to/image.png');

// Create sprite
const sprite = new Sprite(texture);
sprite.anchor.set(0.5);  // Center pivot
sprite.position.set(400, 300);
sprite.scale.set(2);  // 2x scale
sprite.rotation = Math.PI / 4;  // 45 degrees
sprite.alpha = 0.8;  // 80% opacity
sprite.tint = 0xff0000;  // Red tint

app.stage.addChild(sprite);
```

**Quick Creation**:
```javascript
const sprite = Sprite.from('path/to/image.png');
```

---

### 3. Graphics API

Draw vector shapes programmatically:

```javascript
import { Graphics } from 'pixi.js';

const graphics = new Graphics();

// Rectangle
graphics.rect(50, 50, 100, 100).fill('blue');

// Circle with stroke
graphics.circle(200, 100, 50).fill('red').stroke({ width: 2, color: 'white' });

// Complex path
graphics
  .moveTo(300, 100)
  .lineTo(350, 150)
  .lineTo(250, 150)
  .closePath()
  .fill({ color: 0x00ff00, alpha: 0.5 });

app.stage.addChild(graphics);
```

**SVG Support**:
```javascript
graphics.svg('<svg><path d="M 100 350 q 150 -300 300 0" /></svg>');
```

---

### 4. ParticleContainer

Optimized container for rendering thousands of sprites:

```javascript
import { ParticleContainer, Particle, Texture } from 'pixi.js';

const texture = Texture.from('particle.png');

const container = new ParticleContainer({
  dynamicProperties: {
    position: true,   // Allow position updates
    scale: false,     // Static scale
    rotation: false,  // Static rotation
    color: false      // Static color
  }
});

// Add 10,000 particles
for (let i = 0; i < 10000; i++) {
  const particle = new Particle({
    texture,
    x: Math.random() * 800,
    y: Math.random() * 600
  });

  container.addParticle(particle);
}

app.stage.addChild(container);
```

**Performance**: Up to 10x faster than regular Container for static properties.

---

### 5. Filters

Apply per-pixel effects using WebGL shaders:

```javascript
import { BlurFilter, DisplacementFilter, ColorMatrixFilter } from 'pixi.js';

// Blur
const blurFilter = new BlurFilter({ strength: 8, quality: 4 });
sprite.filters = [blurFilter];

// Multiple filters
sprite.filters = [
  new BlurFilter({ strength: 4 }),
  new ColorMatrixFilter()  // Color transforms
];

// Custom filter area for performance
sprite.filterArea = new Rectangle(0, 0, 200, 100);
```

**Available Filters**:
- `BlurFilter`: Gaussian blur
- `ColorMatrixFilter`: Color transformations (sepia, grayscale, etc.)
- `DisplacementFilter`: Warp/distort pixels
- `AlphaFilter`: Flatten alpha across children
- `NoiseFilter`: Random grain effect
- `FXAAFilter`: Anti-aliasing

---

### 6. Text Rendering

Display text with styling:

```javascript
import { Text, BitmapText, TextStyle } from 'pixi.js';

// Standard Text
const style = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 36,
  fill: '#ffffff',
  stroke: { color: '#000000', width: 4 },
  filters: [new BlurFilter()]  // Bake filter into texture
});

const text = new Text({ text: 'Hello PixiJS!', style });
text.position.set(100, 100);

// BitmapText (faster for dynamic text)
const bitmapText = new BitmapText({
  text: 'Score: 0',
  style: { fontFamily: 'MyBitmapFont', fontSize: 24 }
});
```

**Performance Tip**: Use `BitmapText` for frequently changing text (scores, counters).

---

## Patterns & Reference

The full common patterns, integration recipes, performance guidance, and pitfall fixes for this library live in [references/patterns.md](references/patterns.md). Read the section relevant to the current task instead of the whole file; each section is self-contained with runnable examples.

## Resources

- scripts/ - automation and generator utilities for this library.
- references/ - API reference and pattern docs (see patterns.md for the moved patterns sections).
- assets/ - starter templates and examples.