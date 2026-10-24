# WebGL Effect Recipes

Each recipe is a starting point, not a finished art direction. Keep the fallback and the disposal path in the implementation.

## 1. Shader Gradient Background (Three.js)

A full-screen plane with a fragment shader is often enough. Do not build a scene graph for this.

```javascript
import * as THREE from 'three'

const uniforms = {
  uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2(1, 1) },
  uMouse: { value: new THREE.Vector2(0.5, 0.5) },
}

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    varying vec2 vUv;

    vec3 palette(float t) {
      vec3 a = vec3(0.08, 0.08, 0.10);
      vec3 b = vec3(0.55, 0.35, 0.65);
      vec3 c = vec3(1.0, 0.9, 0.7);
      return a + b * cos(6.28318 * (c * t + uTime * 0.05));
    }

    void main() {
      vec2 uv = vUv;
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      vec2 p = (uv - 0.5) * aspect;

      float d = length(p - (uMouse - 0.5) * aspect);
      float glow = smoothstep(0.55, 0.0, d);

      vec3 color = palette(uv.x + uv.y * 0.4);
      color += glow * vec3(0.25, 0.10, 0.05);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
})

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
```

Drive `uTime` from the render loop and update `uResolution` on resize.

## 2. Image Displacement on Hover (Three.js)

```glsl
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uStrength;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * aspect;
  vec2 m = (uMouse - 0.5) * aspect;

  float dist = length(p - m);
  float influence = smoothstep(0.45, 0.0, dist) * uStrength;

  vec2 direction = normalize(p - m + 0.0001);
  vec2 offset = direction * influence * 0.12;

  // Sample the three channels with different offsets for a subtle RGB split.
  float r = texture2D(uTexture, uv + offset * 1.02).r;
  float g = texture2D(uTexture, uv + offset).g;
  float b = texture2D(uTexture, uv + offset * 0.98).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
```

```javascript
const uniforms = {
  uTexture: { value: texture },
  uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  uStrength: { value: 0 },
  uResolution: { value: new THREE.Vector2(width, height) },
}

// pointermove, normalized to the plane
el.addEventListener('pointermove', (event) => {
  const rect = el.getBoundingClientRect()
  uniforms.uMouse.value.set(
    (event.clientX - rect.left) / rect.width,
    1 - (event.clientY - rect.top) / rect.height
  )
})

// enter/leave with GSAP for a soft strength change
el.addEventListener('pointerenter', () => {
  gsap.to(uniforms.uStrength, { value: 1, duration: 0.4 })
})
el.addEventListener('pointerleave', () => {
  gsap.to(uniforms.uStrength, { value: 0, duration: 0.6 })
})
```

Use `texture.colorSpace = THREE.SRGBColorSpace` for color textures.

## 3. Liquid / Fabric Distortion

Use a low-frequency noise offset driven by time and pointer position.

```glsl
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec2 uv = vUv;
  float n = noise(uv * 3.0 + uTime * 0.08);

  vec2 pointer = (uMouse - 0.5);
  vec2 offset = vec2(
    sin(uv.y * 6.0 + uTime * 0.6),
    cos(uv.x * 5.0 + uTime * 0.5)
  ) * 0.006;

  offset += pointer * 0.02 * smoothstep(0.0, 0.7, n);

  gl_FragColor = texture2D(uTexture, uv + offset);
}
```

For a more cloth-like feel, layer two noise frequencies and tie the amplitude to pointer distance.

## 4. RGB Split / Chromatic Aberration

```glsl
uniform sampler2D uTexture;
uniform float uAmount;
varying vec2 vUv;

void main() {
  vec2 dir = vUv - 0.5;
  float r = texture2D(uTexture, vUv + dir * uAmount).r;
  float g = texture2D(uTexture, vUv).g;
  float b = texture2D(uTexture, vUv - dir * uAmount).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}
```

Animate `uAmount` on hover or scroll velocity, but clamp it. Values above roughly `0.02` start to look like a broken screen rather than an effect.

## 5. Particle Field (Three.js Points)

```javascript
const count = 4000
const positions = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
  const radius = 2 + Math.random() * 3
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)

  positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
  positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
  positions[i * 3 + 2] = radius * Math.cos(phi)
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({
  size: 0.012,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.7,
  depthWrite: false,
})

const points = new THREE.Points(geometry, material)
scene.add(points)

renderer.setAnimationLoop((time) => {
  points.rotation.y = time * 0.0001
  renderer.render(scene, camera)
})
```

For tens of thousands of particles, use `InstancedMesh` or a GPU-driven shader instead of per-point animation.

## 6. 3D Product Viewer with Scroll-Driven Camera (R3F)

```jsx
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function ScrollCamera({ progress }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 5))

  useFrame(() => {
    const p = progress.current
    target.current.set(
      THREE.MathUtils.lerp(0, 1.5, p),
      THREE.MathUtils.lerp(0, 0.4, p),
      THREE.MathUtils.lerp(5, 2.2, p)
    )
    camera.position.lerp(target.current, 0.08)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export function Product({ progress }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 40 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <Suspense fallback={null}>
        <ProductModel />
      </Suspense>
      <ScrollCamera progress={progress} />
    </Canvas>
  )
}
```

Update `progress.current` from ScrollTrigger:

```javascript
const progress = { current: 0 }

ScrollTrigger.create({
  trigger: '.product-section',
  start: 'top top',
  end: '+=150%',
  scrub: true,
  onUpdate: (self) => {
    progress.current = self.progress
  },
})
```

This avoids React state updates on every frame.

## 7. Postprocessing (R3F)

```jsx
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'

<EffectComposer>
  <Bloom intensity={0.6} luminanceThreshold={0.2} mipmapBlur />
  <Noise opacity={0.035} />
</EffectComposer>
```

Rules:

- Enable postprocessing only on the high tier.
- Disable MSAA when the composer handles antialiasing.
- Render at a lower resolution if GPU time is high.
- Test on mobile with the effect disabled and enabled.

## 8. DOM-to-WebGL Image Planes (Curtains.js)

The value of Curtains is that existing `<img>` elements become shader planes without rebuilding the DOM in a canvas.

```javascript
import { Curtains, Plane } from 'curtainsjs'

const curtains = new Curtains({
  container: 'canvas-container',
  pixelRatio: Math.min(window.devicePixelRatio, 2),
})

const planes = [...document.querySelectorAll('.curtains-image')].map((img) => {
  return new Plane(curtains, img, {
    vertexShader: `
      attribute vec3 aVertexPosition;
      attribute vec2 aTextureCoord;
      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;
      varying vec2 vUv;
      void main() {
        vUv = aTextureCoord;
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
      }
    `,
    fragmentShader: `
      precision mediump float;
      uniform sampler2D uSampler;
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        uv.x += sin(uv.y * 8.0 + uTime) * 0.004;
        gl_FragColor = texture2D(uSampler, uv);
      }
    `,
    uniforms: {
      uTime: { name: 'uTime', type: '1f', value: 0 },
    },
  })

  return img
})

curtains.onRender(() => {
  planes.forEach((plane) => {
    plane.uniforms.uTime.value += 0.016
  })
})
```

Keep the original images visible until the planes are ready, and restore them if WebGL fails.

## 9. Static Poster Fallback

The fallback should look like a deliberate composition, not an apology.

```html
<picture class="scene-fallback">
  <source media="(min-width: 1024px)" srcset="/hero-desktop.avif" />
  <img src="/hero-mobile.avif" alt="" width="1600" height="900" />
</picture>
```

```javascript
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!hasWebGL() || reduceMotion) {
  document.querySelector('.scene').hidden = true
  document.querySelector('.scene-fallback').hidden = false
} else {
  import('./scene.js').then(({ init }) => init())
}
```

For a video fallback, use `muted`, `playsinline`, `loop`, `autoplay`, and `preload="metadata"`; pause it under reduced motion.

## 10. Context Loss and Disposal

```javascript
renderer.domElement.addEventListener('webglcontextlost', (event) => {
  event.preventDefault()
  renderer.setAnimationLoop(null)
  document.querySelector('.scene-fallback')?.removeAttribute('hidden')
})

renderer.domElement.addEventListener('webglcontextrestored', () => {
  // Rebuild GPU resources and restart the loop.
})

function disposeScene(scene) {
  scene.traverse((object) => {
    if (object.geometry) object.geometry.dispose()

    if (object.material) {
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      materials.forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value && value.isTexture) value.dispose()
        })
        material.dispose()
      })
    }
  })
}
```

## 11. Debug Checklist

- Set `renderer.info.render.calls` and `renderer.info.memory` in a temporary overlay.
- Check shader compile errors in the console before blaming the animation.
- Confirm the canvas size matches its container after resize and after route changes.
- Confirm only one renderer exists.
- Confirm textures are not re-uploaded every frame.
- Confirm the loop stops when the canvas is offscreen.
- Test with WebGL disabled, reduced motion, and 4x CPU throttling.
