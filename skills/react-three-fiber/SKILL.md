---
name: react-three-fiber
description: Build declarative 3D scenes with React Three Fiber (R3F) - a React renderer for Three.js. Use when building interactive 3D experiences in React applications with component-based architecture, state management, and reusable abstractions. Ideal for product configurators, portfolios, games, data visualization, and immersive web experiences.
license: MIT
metadata:
  author: freshtechbro
  version: 1.0.0
---

# React Three Fiber

## Overview

React Three Fiber (R3F) is a React renderer for Three.js that brings declarative, component-based 3D development to React applications. Instead of imperatively creating and managing Three.js objects, you build 3D scenes using JSX components that map directly to Three.js objects.

**When to Use This Skill**:
- Building 3D experiences within React applications
- Creating interactive product configurators or showcases
- Developing 3D portfolios, galleries, or storytelling experiences
- Building games or simulations in React
- Adding 3D elements to existing React projects
- When you need state management and React hooks with 3D graphics
- When working with React frameworks (Next.js, Gatsby, Remix)

**Key Benefits**:
- **Declarative**: Write 3D scenes like React components
- **React Integration**: Full access to hooks, context, state management
- **Reusability**: Create and share 3D component libraries
- **Performance**: Automatic render optimization and reconciliation
- **Ecosystem**: Works with Drei helpers, Zustand, Framer Motion, etc.
- **TypeScript Support**: Full type safety for Three.js objects

---

## Core Concepts

### 1. Canvas Component

The `<Canvas>` component sets up a Three.js scene, camera, renderer, and render loop.

```jsx
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      {/* 3D content goes here */}
    </Canvas>
  )
}
```

**Canvas Props**:
- `camera` - Camera configuration (position, fov, near, far)
- `gl` - WebGL renderer settings
- `dpr` - Device pixel ratio (default: [1, 2])
- `shadows` - Enable shadow mapping (default: false)
- `frameloop` - "always" (default), "demand", or "never"
- `flat` - Disable color management for simpler colors
- `linear` - Use linear color space instead of sRGB

### 2. Declarative 3D Objects

Three.js objects are created using JSX with kebab-case props:

```jsx
// THREE.Mesh + THREE.BoxGeometry + THREE.MeshStandardMaterial
<mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="hotpink" />
</mesh>
```

**Prop Mapping**:
- `position` → `object.position.set(x, y, z)`
- `rotation` → `object.rotation.set(x, y, z)`
- `scale` → `object.scale.set(x, y, z)`
- `args` → Constructor arguments for geometry/material
- `attach` → Attach to parent property (e.g., `attach="material"`)

**Shorthand Notation**:
```jsx
// Full notation
<mesh position={[1, 2, 3]} />

// Axis-specific (dash notation)
<mesh position-x={1} position-y={2} position-z={3} />
```

### 3. useFrame Hook

Execute code on every frame (animation loop):

```jsx
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function RotatingBox() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    // Rotate mesh on every frame
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta * 0.5

    // Access scene state
    const time = state.clock.elapsedTime
    meshRef.current.position.y = Math.sin(time) * 2
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
```

**useFrame Parameters**:
- `state` - Scene state (camera, scene, gl, clock, etc.)
- `delta` - Time since last frame (for frame-rate independence)
- `xrFrame` - XR frame data (for VR/AR)

**Important**: Never use `setState` inside `useFrame` - it causes unnecessary re-renders!

### 4. useThree Hook

Access scene state and methods:

```jsx
import { useThree } from '@react-three/fiber'

function CameraInfo() {
  const { camera, gl, scene, size, viewport } = useThree()

  // Selective subscription (only re-render on size change)
  const size = useThree((state) => state.size)

  // Get state non-reactively
  const get = useThree((state) => state.get)
  const freshState = get() // Latest state without triggering re-render

  return null
}
```

**Available State**:
- `camera` - Default camera
- `scene` - Three.js scene
- `gl` - WebGL renderer
- `size` - Canvas dimensions
- `viewport` - Viewport dimensions in 3D units
- `clock` - Three.js clock
- `pointer` - Normalized mouse coordinates
- `invalidate()` - Manually trigger render
- `setSize()` - Manually resize canvas

### 5. useLoader Hook

Load assets with automatic caching and Suspense integration:

```jsx
import { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextureLoader } from 'three'

function Model() {
  const gltf = useLoader(GLTFLoader, '/model.glb')
  return <primitive object={gltf.scene} />
}

function TexturedMesh() {
  const texture = useLoader(TextureLoader, '/texture.jpg')
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

function App() {
  return (
    <Canvas>
      <Suspense fallback={<LoadingIndicator />}>
        <Model />
        <TexturedMesh />
      </Suspense>
    </Canvas>
  )
}
```

**Loading Multiple Assets**:
```jsx
const [texture1, texture2, texture3] = useLoader(TextureLoader, [
  '/tex1.jpg',
  '/tex2.jpg',
  '/tex3.jpg'
])
```

**Loader Extensions**:
```jsx
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

useLoader(GLTFLoader, '/model.glb', (loader) => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')
  loader.setDRACOLoader(dracoLoader)
})
```

**Pre-loading**:
```jsx
// Pre-load assets before component mounts
useLoader.preload(GLTFLoader, '/model.glb')
```

---

## Patterns & Reference

The full common patterns, integration recipes, performance guidance, and pitfall fixes for this library live in [references/patterns.md](references/patterns.md). Read the section relevant to the current task instead of the whole file; each section is self-contained with runnable examples.

## Resources

- scripts/ - automation and generator utilities for this library.
- references/ - API reference and pattern docs (see patterns.md for the moved patterns sections).
- assets/ - starter templates and examples.