# Babylon.js - Core Concepts

(Full concept detail moved here so SKILL.md stays within the 500-line spec.)


### 1. Engine and Scene Initialization

**Basic Setup**
```javascript
// Get canvas element
const canvas = document.getElementById('renderCanvas');

// Create engine
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true
});

// Create scene
const scene = new BABYLON.Scene(engine);

// Render loop
engine.runRenderLoop(() => {
  scene.render();
});

// Handle resize
window.addEventListener('resize', () => {
  engine.resize();
});
```

**ES6/TypeScript Setup**
```typescript
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const engine = new Engine(canvas);
const scene = new Scene(engine);

// Camera setup
const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);
camera.setTarget(Vector3.Zero());
camera.attachControl(canvas, true);

// Lighting
const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
light.intensity = 0.7;

// Create mesh
const sphere = CreateSphere('sphere1', { segments: 16, diameter: 2 }, scene);
sphere.position.y = 2;

// Render
engine.runRenderLoop(() => {
  scene.render();
});
```

**Scene Configuration Options**
```javascript
const scene = new BABYLON.Scene(engine, {
  // Optimize for large mesh counts
  useGeometryUniqueIdsMap: true,
  useMaterialMeshMap: true,
  useClonedMeshMap: true
});
```

### 2. Camera Systems

**Free Camera (FPS-style)**
```javascript
const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

// Movement settings
camera.speed = 0.5;
camera.angularSensibility = 2000;
camera.keysUp = [87]; // W
camera.keysDown = [83]; // S
camera.keysLeft = [65]; // A
camera.keysRight = [68]; // D
```

**Arc Rotate Camera (Orbit)**
```javascript
const camera = new BABYLON.ArcRotateCamera(
  'camera',
  -Math.PI / 2,        // alpha (horizontal rotation)
  Math.PI / 2.5,       // beta (vertical rotation)
  15,                  // radius (distance)
  new BABYLON.Vector3(0, 0, 0), // target
  scene
);
camera.attachControl(canvas, true);

// Constraints
camera.lowerRadiusLimit = 5;
camera.upperRadiusLimit = 50;
camera.lowerBetaLimit = 0.1;
camera.upperBetaLimit = Math.PI / 2;
```

**Universal Camera (Advanced)**
```javascript
const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(0, 5, -10), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

// Collision detection
camera.checkCollisions = true;
camera.applyGravity = true;
camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
```

### 3. Lighting Systems

**Hemispheric Light (Ambient)**
```javascript
const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;
light.diffuse = new BABYLON.Color3(1, 1, 1);
light.specular = new BABYLON.Color3(1, 1, 1);
light.groundColor = new BABYLON.Color3(0, 0, 0);
```

**Directional Light (Sun-like)**
```javascript
const light = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -2, -1), scene);
light.position = new BABYLON.Vector3(20, 40, 20);
light.intensity = 0.5;

// Shadow setup
const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
shadowGenerator.useExponentialShadowMap = true;
```

**Point Light (Omni-directional)**
```javascript
const light = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 10, 0), scene);
light.intensity = 0.7;
light.diffuse = new BABYLON.Color3(1, 0, 0);
light.specular = new BABYLON.Color3(0, 1, 0);

// Range and falloff
light.range = 100;
light.radius = 0.1;
```

**Spot Light (Focused)**
```javascript
const light = new BABYLON.SpotLight(
  'spotLight',
  new BABYLON.Vector3(0, 10, 0),      // position
  new BABYLON.Vector3(0, -1, 0),      // direction
  Math.PI / 3,                        // angle
  2,                                  // exponent
  scene
);
light.intensity = 0.8;
```

**Light Optimization (Include Only Specific Meshes)**
```javascript
// Only affect specific meshes
light.includedOnlyMeshes = [mesh1, mesh2, mesh3];

// Or exclude specific meshes
light.excludedMeshes = [mesh4, mesh5];
```

### 4. Mesh Creation

**Built-in Shapes**
```javascript
// Box
const box = BABYLON.MeshBuilder.CreateBox('box', {
  size: 2,
  width: 2,
  height: 2,
  depth: 2
}, scene);

// Sphere
const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {
  diameter: 2,
  segments: 32,
  diameterX: 2,
  diameterY: 2,
  diameterZ: 2,
  arc: 1,
  slice: 1
}, scene);

// Cylinder
const cylinder = BABYLON.MeshBuilder.CreateCylinder('cylinder', {
  height: 3,
  diameter: 2,
  tessellation: 24
}, scene);

// Plane
const plane = BABYLON.MeshBuilder.CreatePlane('plane', {
  size: 5,
  width: 5,
  height: 5
}, scene);

// Ground
const ground = BABYLON.MeshBuilder.CreateGround('ground', {
  width: 10,
  height: 10,
  subdivisions: 2
}, scene);

// Ground from heightmap
const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap('ground', 'heightmap.png', {
  width: 100,
  height: 100,
  subdivisions: 100,
  minHeight: 0,
  maxHeight: 10
}, scene);

// Torus
const torus = BABYLON.MeshBuilder.CreateTorus('torus', {
  diameter: 3,
  thickness: 1,
  tessellation: 16
}, scene);

// TorusKnot
const torusKnot = BABYLON.MeshBuilder.CreateTorusKnot('torusKnot', {
  radius: 2,
  tube: 0.6,
  radialSegments: 64,
  tubularSegments: 8,
  p: 2,
  q: 3
}, scene);
```

**Mesh Transformations**
```javascript
// Position
mesh.position = new BABYLON.Vector3(0, 5, 10);
mesh.position.x = 5;
mesh.position.y = 2;

// Rotation (radians)
mesh.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
mesh.rotation.y = Math.PI / 4;

// Scaling
mesh.scaling = new BABYLON.Vector3(2, 2, 2);
mesh.scaling.x = 1.5;

// Look at
mesh.lookAt(new BABYLON.Vector3(0, 0, 0));

// Parent-child relationships
childMesh.parent = parentMesh;
```

**Mesh Properties**
```javascript
// Visibility
mesh.isVisible = true;
mesh.visibility = 0.5; // 0 = invisible, 1 = fully visible

// Picking
mesh.isPickable = true;
mesh.checkCollisions = true;

// Culling
mesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;

// Receive shadows
mesh.receiveShadows = true;
```

### 5. Materials

**Standard Material**
```javascript
const material = new BABYLON.StandardMaterial('material', scene);

// Colors
material.diffuseColor = new BABYLON.Color3(1, 0, 1);
material.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
material.emissiveColor = new BABYLON.Color3(0, 0, 0);
material.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

// Textures
material.diffuseTexture = new BABYLON.Texture('diffuse.png', scene);
material.specularTexture = new BABYLON.Texture('specular.png', scene);
material.emissiveTexture = new BABYLON.Texture('emissive.png', scene);
material.ambientTexture = new BABYLON.Texture('ambient.png', scene);
material.bumpTexture = new BABYLON.Texture('normal.png', scene);
material.opacityTexture = new BABYLON.Texture('opacity.png', scene);

// Properties
material.alpha = 0.8;
material.backFaceCulling = true;
material.wireframe = false;
material.specularPower = 64;

// Apply to mesh
mesh.material = material;
```

**PBR Material (Physically Based Rendering)**
```javascript
const pbr = new BABYLON.PBRMaterial('pbr', scene);

// Metallic workflow
pbr.albedoColor = new BABYLON.Color3(1, 1, 1);
pbr.albedoTexture = new BABYLON.Texture('albedo.png', scene);
pbr.metallic = 1.0;
pbr.roughness = 0.5;
pbr.metallicTexture = new BABYLON.Texture('metallic.png', scene);

// Or specular workflow
pbr.albedoTexture = new BABYLON.Texture('albedo.png', scene);
pbr.reflectivityTexture = new BABYLON.Texture('reflectivity.png', scene);

// Environment
pbr.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData('environment.dds', scene);

// Other maps
pbr.bumpTexture = new BABYLON.Texture('normal.png', scene);
pbr.ambientTexture = new BABYLON.Texture('ao.png', scene);
pbr.emissiveTexture = new BABYLON.Texture('emissive.png', scene);

mesh.material = pbr;
```

**Multi-Materials**
```javascript
const multiMat = new BABYLON.MultiMaterial('multiMat', scene);
multiMat.subMaterials.push(material1);
multiMat.subMaterials.push(material2);
multiMat.subMaterials.push(material3);

mesh.material = multiMat;
mesh.subMeshes = [];
mesh.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, indicesCount1, mesh));
mesh.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, indicesCount1, indicesCount2, mesh));
```

### 6. Model Loading

**GLTF/GLB Import**
```javascript
// Append to scene
BABYLON.SceneLoader.Append('path/to/', 'model.gltf', scene, function(scene) {
  console.log('Model loaded');
});

// Import mesh
BABYLON.SceneLoader.ImportMesh('', 'path/to/', 'model.gltf', scene, function(meshes) {
  const mesh = meshes[0];
  mesh.position.y = 5;
});

// Async version
const result = await BABYLON.SceneLoader.ImportMeshAsync(
  null,  // all meshes
  'https://assets.babylonjs.com/meshes/',
  'village.glb',
  scene
);
console.log('Loaded meshes:', result.meshes);

// Load from binary
const result = await BABYLON.SceneLoader.AppendAsync(
  '',
  'data:' + arrayBuffer,
  scene
);
```

**Asset Manager (Batch Loading)**
```javascript
const assetsManager = new BABYLON.AssetsManager(scene);

// Add mesh task
const meshTask = assetsManager.addMeshTask('model', '', 'path/to/', 'model.gltf');
meshTask.onSuccess = function(task) {
  task.loadedMeshes[0].position = new BABYLON.Vector3(0, 0, 0);
};

// Add texture task
const textureTask = assetsManager.addTextureTask('texture', 'texture.png');
textureTask.onSuccess = function(task) {
  material.diffuseTexture = task.texture;
};

// Load all
assetsManager.onFinish = function(tasks) {
  console.log('All assets loaded');
  engine.runRenderLoop(() => scene.render());
};

assetsManager.load();
```

### 7. Physics Engine

**Havok Physics Setup**
```javascript
// Import Havok
import HavokPhysics from '@babylonjs/havok';

// Initialize
const havokInstance = await HavokPhysics();
const havokPlugin = new BABYLON.HavokPlugin(true, havokInstance);

// Enable physics
scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), havokPlugin);

// Create physics aggregate for mesh
const sphereAggregate = new BABYLON.PhysicsAggregate(
  sphere,
  BABYLON.PhysicsShapeType.SPHERE,
  { mass: 1, restitution: 0.75 },
  scene
);

// Ground (static)
const groundAggregate = new BABYLON.PhysicsAggregate(
  ground,
  BABYLON.PhysicsShapeType.BOX,
  { mass: 0 }, // mass 0 = static
  scene
);
```

**Physics Shapes**
```javascript
// Available shapes
BABYLON.PhysicsShapeType.SPHERE
BABYLON.PhysicsShapeType.BOX
BABYLON.PhysicsShapeType.CAPSULE
BABYLON.PhysicsShapeType.CYLINDER
BABYLON.PhysicsShapeType.CONVEX_HULL
BABYLON.PhysicsShapeType.MESH
BABYLON.PhysicsShapeType.HEIGHTFIELD
```

**Physics Body Control**
```javascript
// Get body
const body = aggregate.body;

// Apply force
body.applyForce(
  new BABYLON.Vector3(0, 10, 0),    // force
  new BABYLON.Vector3(0, 0, 0)      // point of application
);

// Apply impulse
body.applyImpulse(
  new BABYLON.Vector3(0, 5, 0),
  new BABYLON.Vector3(0, 0, 0)
);

// Set velocity
body.setLinearVelocity(new BABYLON.Vector3(0, 5, 0));
body.setAngularVelocity(new BABYLON.Vector3(0, 1, 0));

// Properties
body.setMassProperties({ mass: 2 });
body.setCollisionCallbackEnabled(true);
```

### 8. Animations

**Direct Animation**
```javascript
// Animate property
BABYLON.Animation.CreateAndStartAnimation(
  'anim',
  mesh,
  'position.y',
  30,                    // FPS
  120,                   // total frames
  mesh.position.y,       // from
  10,                    // to
  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
);
```

**Animation Class**
```javascript
const animation = new BABYLON.Animation(
  'myAnimation',
  'position.x',
  30,
  BABYLON.Animation.ANIMATIONTYPE_FLOAT,
  BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
);

// Keyframes
const keys = [
  { frame: 0, value: 0 },
  { frame: 30, value: 10 },
  { frame: 60, value: 0 }
];
animation.setKeys(keys);

// Attach to mesh
mesh.animations.push(animation);

// Start
scene.beginAnimation(mesh, 0, 60, true);
```

**Animation Groups**
```javascript
const animationGroup = new BABYLON.AnimationGroup('group', scene);
animationGroup.addTargetedAnimation(animation1, mesh1);
animationGroup.addTargetedAnimation(animation2, mesh2);

// Control
animationGroup.play();
animationGroup.pause();
animationGroup.stop();
animationGroup.speedRatio = 2.0;

// Events
animationGroup.onAnimationEndObservable.add(() => {
  console.log('Animation complete');
});
```

**Skeleton Animations (from imported models)**
```javascript
// Get skeleton from imported model
const skeleton = result.skeletons[0];

// Get animation ranges
const ranges = skeleton.getAnimationRanges();

// Play animation range
scene.beginAnimation(skeleton, 0, 100, true);

// Or use animation groups
result.animationGroups[0].play();
result.animationGroups[0].setWeightForAllAnimatables(0.5);
```