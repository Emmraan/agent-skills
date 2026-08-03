# Babylon.js - Patterns, Integrations, Performance & Pitfalls


## Common Patterns

### Pattern 1: Scene Setup with Default Environment

```javascript
const createScene = function() {
  const scene = new BABYLON.Scene(engine);

  // Quick setup
  scene.createDefaultCameraOrLight(true, true, true);
  const env = scene.createDefaultEnvironment({
    createGround: true,
    createSkybox: true,
    skyboxSize: 150,
    groundSize: 50
  });

  // Your meshes
  const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 2}, scene);
  sphere.position.y = 1;

  return scene;
};
```

### Pattern 2: Async Scene Loading

```javascript
const createScene = async function() {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

  // Load model
  const result = await BABYLON.SceneLoader.ImportMeshAsync(
    null,
    'https://assets.babylonjs.com/meshes/',
    'village.glb',
    scene
  );

  // Setup physics
  const havokInstance = await HavokPhysics();
  const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance);
  scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), havokPlugin);

  return scene;
};

createScene().then(scene => {
  engine.runRenderLoop(() => scene.render());
});
```

### Pattern 3: Interactive Picking

```javascript
scene.onPointerDown = function(evt, pickResult) {
  if (pickResult.hit) {
    console.log('Picked mesh:', pickResult.pickedMesh.name);
    console.log('Pick point:', pickResult.pickedPoint);

    // Highlight picked mesh
    pickResult.pickedMesh.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
  }
};

// Or use action manager
mesh.actionManager = new BABYLON.ActionManager(scene);
mesh.actionManager.registerAction(
  new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnPickTrigger,
    function() {
      console.log('Mesh clicked');
    }
  )
);
```

### Pattern 4: Post-Processing Effects

```javascript
// Default pipeline
const pipeline = new BABYLON.DefaultRenderingPipeline('pipeline', true, scene, [camera]);
pipeline.samples = 4;
pipeline.fxaaEnabled = true;
pipeline.bloomEnabled = true;
pipeline.bloomThreshold = 0.8;
pipeline.bloomWeight = 0.5;
pipeline.bloomKernel = 64;

// Depth of field
pipeline.depthOfFieldEnabled = true;
pipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Low;
pipeline.depthOfField.focusDistance = 2000;
pipeline.depthOfField.focalLength = 50;

// Glow layer
const glowLayer = new BABYLON.GlowLayer('glow', scene);
glowLayer.intensity = 0.5;

// Highlight layer
const highlightLayer = new BABYLON.HighlightLayer('highlight', scene);
highlightLayer.addMesh(mesh, BABYLON.Color3.Green());
```

### Pattern 5: GUI (2D UI)

```javascript
import { AdvancedDynamicTexture, Button, TextBlock, Rectangle } from '@babylonjs/gui';

// Fullscreen UI
const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

// Button
const button = BABYLON.GUI.Button.CreateSimpleButton('button', 'Click Me');
button.width = '150px';
button.height = '40px';
button.color = 'white';
button.background = 'green';
button.onPointerUpObservable.add(() => {
  console.log('Button clicked');
});
advancedTexture.addControl(button);

// Text
const text = new BABYLON.GUI.TextBlock();
text.text = 'Hello World';
text.color = 'white';
text.fontSize = 24;
advancedTexture.addControl(text);

// 3D mesh UI
const plane = BABYLON.MeshBuilder.CreatePlane('plane', {size: 2}, scene);
const advancedTexture3D = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
const button3D = BABYLON.GUI.Button.CreateSimpleButton('button3D', 'Click Me');
advancedTexture3D.addControl(button3D);
```

### Pattern 6: Shadow Mapping

```javascript
const light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(-1, -2, -1), scene);
light.position = new BABYLON.Vector3(20, 40, 20);

// Create shadow generator
const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
shadowGenerator.useExponentialShadowMap = true;
shadowGenerator.usePoissonSampling = true;

// Add shadow casters
shadowGenerator.addShadowCaster(sphere);
shadowGenerator.addShadowCaster(box);

// Enable shadow receiving
ground.receiveShadows = true;
```

### Pattern 7: Particle Systems

```javascript
const particleSystem = new BABYLON.ParticleSystem('particles', 2000, scene);
particleSystem.particleTexture = new BABYLON.Texture('particle.png', scene);

// Emitter
particleSystem.emitter = new BABYLON.Vector3(0, 5, 0);
particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0);
particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0);

// Colors
particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

// Size
particleSystem.minSize = 0.1;
particleSystem.maxSize = 0.5;

// Life time
particleSystem.minLifeTime = 0.3;
particleSystem.maxLifeTime = 1.5;

// Emission rate
particleSystem.emitRate = 1500;

// Direction
particleSystem.direction1 = new BABYLON.Vector3(-1, 8, 1);
particleSystem.direction2 = new BABYLON.Vector3(1, 8, -1);

// Gravity
particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

// Start
particleSystem.start();
```

## Integration Patterns

### Pattern 1: React Integration

```jsx
import { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';

function BabylonScene() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize
    const engine = new BABYLON.Engine(canvasRef.current, true);
    engineRef.current = engine;

    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;

    // Setup scene
    const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current, true);

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 2}, scene);

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Resize handler
    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100vh' }}
    />
  );
}
```

### Pattern 2: WebXR (VR/AR)

```javascript
const createScene = async function() {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

  const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 2}, scene);
  sphere.position.y = 1;

  const env = scene.createDefaultEnvironment();

  // Enable WebXR
  const xrHelper = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [env.ground],
    disableTeleportation: false
  });

  // XR controller input
  xrHelper.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
      const trigger = motionController.getMainComponent();
      trigger.onButtonStateChangedObservable.add(() => {
        if (trigger.pressed) {
          console.log('Trigger pressed');
        }
      });
    });
  });

  return scene;
};
```

### Pattern 3: Node Material (Visual Shader Editor)

```javascript
// Create from snippet
const nodeMaterial = await BABYLON.NodeMaterial.ParseFromSnippetAsync('#SNIPPET_ID', scene);

// Apply to mesh
nodeMaterial.build();
mesh.material = nodeMaterial;

// Or create programmatically
const nodeMaterial = new BABYLON.NodeMaterial('node', scene);

const positionInput = new BABYLON.InputBlock('position');
positionInput.setAsAttribute('position');

const worldPos = new BABYLON.TransformBlock('worldPos');
nodeMaterial.addOutputNode(worldPos);
```

## Performance Optimization

### 1. Mesh Optimization

```javascript
// Merge meshes with same material
const merged = BABYLON.Mesh.MergeMeshes(
  [mesh1, mesh2, mesh3],
  true,  // disposeSource
  true,  // allow32BitsIndices
  undefined,
  false, // multiMultiMaterials
  true   // preserveSerializationHelper
);

// Instances (for repeated meshes)
const instance1 = mesh.createInstance('instance1');
const instance2 = mesh.createInstance('instance2');
instance1.position.x = 5;
instance2.position.x = -5;

// Thin instances (even more efficient)
const buffer = new Float32Array(16 * count); // 16 floats per matrix
mesh.thinInstanceSetBuffer('matrix', buffer, 16);

// Freeze meshes (static meshes)
mesh.freezeWorldMatrix();

// Freeze materials
material.freeze();

// Simplify meshes (LOD)
const simplified = mesh.simplify(
  [
    { quality: 0.8, distance: 10 },
    { quality: 0.4, distance: 50 },
    { quality: 0.2, distance: 100 }
  ],
  true,  // parallelProcessing
  BABYLON.SimplificationType.QUADRATIC
);
```

### 2. Scene Optimization

```javascript
// Scene optimizer
const options = new BABYLON.SceneOptimizerOptions();
options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1));
options.addOptimization(new BABYLON.ShadowsOptimization(1));
options.addOptimization(new BABYLON.PostProcessesOptimization(2));
options.addOptimization(new BABYLON.LensFlaresOptimization(3));
options.addOptimization(new BABYLON.ParticlesOptimization(4));
options.addOptimization(new BABYLON.TextureOptimization(5, 512));
options.addOptimization(new BABYLON.RenderTargetsOptimization(6));
options.addOptimization(new BABYLON.MergeMeshesOptimization(7));

const optimizer = new BABYLON.SceneOptimizer(scene, options);
optimizer.start();

// Octree (spatial partitioning)
const octree = scene.createOrUpdateSelectionOctree();

// Frustum culling
scene.blockMaterialDirtyMechanism = true;

// Skip pointer move picking
scene.skipPointerMovePicking = true;

// Freeze active meshes
scene.freezeActiveMeshes();
```

### 3. Rendering Optimization

```javascript
// Hardware scaling
engine.setHardwareScalingLevel(0.5); // Render at half resolution

// Adaptive quality
scene.onBeforeRenderObservable.add(() => {
  const fps = engine.getFps();
  if (fps < 30) {
    // Reduce quality
    engine.setHardwareScalingLevel(2);
  } else if (fps > 55) {
    // Increase quality
    engine.setHardwareScalingLevel(1);
  }
});

// Incremental loading
scene.useDelayedTextureLoading = true;

// Culling strategy
mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
```

### 4. Texture Optimization

```javascript
// Compressed textures
const texture = new BABYLON.Texture('texture.dds', scene);

// Mipmaps
texture.updateSamplingMode(BABYLON.Texture.TRILINEAR_SAMPLINGMODE);

// Anisotropic filtering
texture.anisotropicFilteringLevel = 4;

// KTX2 compression
const texture = new BABYLON.Texture('texture.ktx2', scene);
```

## Common Pitfalls

### Pitfall 1: Memory Leaks

**Problem**: Not disposing resources
```javascript
// ❌ Bad - memory leak
function createAndRemoveMesh() {
  const mesh = BABYLON.MeshBuilder.CreateBox('box', {}, scene);
  scene.removeMesh(mesh);
}
```

**Solution**: Properly dispose
```javascript
// ✅ Good
function createAndRemoveMesh() {
  const mesh = BABYLON.MeshBuilder.CreateBox('box', {}, scene);
  mesh.dispose();
}

// Dispose entire scene
scene.dispose();

// Dispose engine
engine.dispose();
```

### Pitfall 2: Performance Issues with Too Many Draw Calls

**Problem**: Each mesh = one draw call
```javascript
// ❌ Bad - 1000 draw calls
for (let i = 0; i < 1000; i++) {
  const box = BABYLON.MeshBuilder.CreateBox('box' + i, {}, scene);
  box.position.x = i;
}
```

**Solution**: Use instances or merge
```javascript
// ✅ Good - 1 draw call
const box = BABYLON.MeshBuilder.CreateBox('box', {}, scene);
for (let i = 0; i < 1000; i++) {
  const instance = box.createInstance('instance' + i);
  instance.position.x = i;
}
```

### Pitfall 3: Blocking the Main Thread

**Problem**: Heavy computations blocking render
```javascript
// ❌ Bad - blocks rendering
function createManyMeshes() {
  for (let i = 0; i < 10000; i++) {
    const mesh = BABYLON.MeshBuilder.CreateSphere('sphere' + i, {}, scene);
  }
}
```

**Solution**: Use async/incremental loading
```javascript
// ✅ Good - incremental
async function createManyMeshes() {
  for (let i = 0; i < 10000; i++) {
    const mesh = BABYLON.MeshBuilder.CreateSphere('sphere' + i, {}, scene);

    if (i % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
```

### Pitfall 4: Incorrect Camera Controls

**Problem**: Camera not responding
```javascript
// ❌ Bad - forgot attachControl
const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, BABYLON.Vector3.Zero(), scene);
```

**Solution**: Always attach controls
```javascript
// ✅ Good
const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);
```

### Pitfall 5: Not Handling Async Operations

**Problem**: Using scene before it's ready
```javascript
// ❌ Bad
BABYLON.SceneLoader.ImportMesh('', 'path/', 'model.gltf', scene);
const mesh = scene.getMeshByName('meshName'); // null!
```

**Solution**: Use callbacks or async/await
```javascript
// ✅ Good
const result = await BABYLON.SceneLoader.ImportMeshAsync('', 'path/', 'model.gltf', scene);
const mesh = scene.getMeshByName('meshName');

// Or with callback
BABYLON.SceneLoader.ImportMesh('', 'path/', 'model.gltf', scene, function(meshes) {
  const mesh = meshes[0];
});
```

### Pitfall 6: Physics Not Working

**Problem**: Forgot to enable physics or create aggregates
```javascript
// ❌ Bad
const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {}, scene);
sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 1}, scene);
// Error: Physics not enabled!
```

**Solution**: Enable physics first, use aggregates
```javascript
// ✅ Good
const havokInstance = await HavokPhysics();
const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance);
scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), havokPlugin);

const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {}, scene);
const aggregate = new BABYLON.PhysicsAggregate(
  sphere,
  BABYLON.PhysicsShapeType.SPHERE,
  {mass: 1},
  scene
);
```

## Advanced Topics

### 1. Custom Shaders

```javascript
BABYLON.Effect.ShadersStore['customVertexShader'] = `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 worldViewProjection;
  varying vec2 vUV;

  void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);
    vUV = uv;
  }
`;

BABYLON.Effect.ShadersStore['customFragmentShader'] = `
  precision highp float;
  varying vec2 vUV;
  uniform sampler2D textureSampler;

  void main(void) {
    gl_FragColor = texture2D(textureSampler, vUV);
  }
`;

const shaderMaterial = new BABYLON.ShaderMaterial('shader', scene, {
  vertex: 'custom',
  fragment: 'custom'
}, {
  attributes: ['position', 'uv'],
  uniforms: ['worldViewProjection']
});
```

### 2. Compute Shaders

```javascript
const computeShader = new BABYLON.ComputeShader('compute', engine, {
  computeSource: `
    #version 450
    layout (local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
    layout(std430, binding = 0) buffer OutputBuffer { vec4 data[]; } outputBuffer;

    void main() {
      uint index = gl_GlobalInvocationID.x + gl_GlobalInvocationID.y * 8u;
      outputBuffer.data[index] = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
});
```

### 3. Procedural Textures

```javascript
const noiseTexture = new BABYLON.NoiseProceduralTexture('noise', 256, scene);
noiseTexture.octaves = 4;
noiseTexture.persistence = 0.8;
noiseTexture.animationSpeedFactor = 5;

material.emissiveTexture = noiseTexture;
```

## Debugging

```javascript
// Show inspector
scene.debugLayer.show();

// Show bounding boxes
scene.forceShowBoundingBoxes = true;

// Show wireframes
material.wireframe = true;

// Log FPS
setInterval(() => {
  console.log('FPS:', engine.getFps());
}, 1000);

// Instrumentation
const instrumentation = new BABYLON.SceneInstrumentation(scene);
instrumentation.captureFrameTime = true;
console.log('Frame time:', instrumentation.frameTimeCounter.average);
```

## Resources

- [Official Documentation](https://doc.babylonjs.com/)
- [Playground](https://playground.babylonjs.com/)
- [Forum](https://forum.babylonjs.com/)
- [Examples](https://doc.babylonjs.com/examples/)
- [NPM Package](https://www.npmjs.com/package/@babylonjs/core)

## Version Notes

This skill is based on Babylon.js 7.x. For latest features, consult the official documentation.