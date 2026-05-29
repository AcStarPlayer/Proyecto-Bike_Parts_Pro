import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";

const piezas = {};

const mapaCategorias = {
    "llantaTrasera": "ruedas",
    "llantaDelantera": "ruedas",
    "cadena": "transmision",
    "plato": "transmision",
    "marco": "estructura",
    "sillin": "estructura",
    "manubrio": "direccion"
};

const canvas = document.getElementById("canvas3d");

if (!canvas) {
  console.warn(
    "⚠️ canvas3d no existe en esta página, bicicleta.js no se inicia",
  );
  // aborta sin romper JS
  throw new Error("NO_CANVAS");
}

const tooltip = document.getElementById("tooltip");

let bicicletaModel;

let objetos = [];

let exploded = false;
const explosionData = new Map();

let hoveredObject = null;
let selectedObject = null;

let cameraTarget = new THREE.Vector3();
let cameraStart = new THREE.Vector3();
let cameraEnd = new THREE.Vector3();

let cameraAnimating = false;
let cameraStartTime = 0;
let cameraDuration = 1.2;

let particleSystem;
let particlePositions;
let particleVelocities = [];

let autoRotate = true;

if (window.__BICICLETA_3D_INIT__) {
  console.warn("⚠️ Bicicleta 3D ya inicializada");
  throw new Error("DUPLICATE_INIT");
}
window.__BICICLETA_3D_INIT__ = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color("#bfc9d1");

scene.fog = new THREE.Fog(
    0xd2bea2,
    10,
    40
);

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
        new THREE.MeshStandardMaterial({
        color: 0x8d7458,
        roughness: 1,
        metalness: 0,
        envMapIntensity: 1
    })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.7;

floor.receiveShadow = true;
floor.material.roughness = 1;
floor.material.metalness = 0;

floor.material.envMapIntensity = 1.2;

scene.add(floor);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 1.1, 3.2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x000000, 0);

const container = canvas.parentElement;

renderer.setSize(container.clientWidth, container.clientHeight);

renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";

function updateRendererSize() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  if (width === 0 || height === 0) return;

  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  if (composer) {
    composer.setSize(width, height);
  }
}

renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

renderer.toneMappingExposure = 0.92;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

controls.enablePan = false;

controls.minPolarAngle = Math.PI / 2.2;
controls.maxPolarAngle = Math.PI / 2.2;

controls.minDistance = 2.2;
controls.maxDistance = 6;

controls.target.set(0, 0.45, 0);

const hemi = new THREE.HemisphereLight(
    0xd8ffe8,
    0x29543f,
    2.8
);

scene.add(hemi);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);

keyLight.position.set(5, 8, 5);
keyLight.castShadow = false;

keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;

scene.add(keyLight);

const fill = new THREE.DirectionalLight(0xffffff, 0.8);
fill.position.set(-5, 3, 2);
scene.add(fill);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);

sunLight.position.set(10, 15, 8);

sunLight.castShadow = true;

sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;

scene.add(sunLight);

// ======================================
// SOMBRAS SUAVES PREMIUM
// ======================================

renderer.shadowMap.enabled = true;

keyLight.shadow.bias = -0.0001;
keyLight.shadow.radius = 4;

sunLight.shadow.bias = -0.0001;
sunLight.shadow.radius = 6;

//const axesHelper = new THREE.AxesHelper(5);
//scene.add(axesHelper);

const rgbeLoader = new RGBELoader();

/*rgbeLoader.load(
    'https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr',*/
rgbeLoader.load(
  "https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.encoding = THREE.sRGBEncoding;

        scene.environment = texture;
        scene.environmentIntensity = 1.4;
    }
);

const textureLoader = new THREE.TextureLoader();
const sparkTexture = textureLoader.load(
  "https://threejs.org/examples/textures/sprites/spark1.png",
);
sparkTexture.colorSpace = THREE.SRGBColorSpace;

const carbonTexture = textureLoader.load(
  "https://threejs.org/examples/textures/carbon/Carbon.png",
);
const carbonNormal = textureLoader.load(
  "https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg",
);

const metalTexture = textureLoader.load(
  "https://threejs.org/examples/textures/metal.jpg",
);

carbonTexture.colorSpace = THREE.SRGBColorSpace;
metalTexture.colorSpace = THREE.SRGBColorSpace;

const rubberTexture = textureLoader.load(
  "https://threejs.org/examples/textures/terrain/grasslight-big.jpg",
);

metalTexture.colorSpace = THREE.SRGBColorSpace;
rubberTexture.colorSpace = THREE.SRGBColorSpace;

const logoTexture = textureLoader.load(
    "img/logo.svg"
);

const logoMaterial = new THREE.MeshBasicMaterial({

    map: logoTexture,

    transparent: true,

    opacity: 0.22
    
});

const logoPlane = new THREE.Mesh(

    new THREE.PlaneGeometry(2.5, 2.5),

    logoMaterial
);

logoPlane.position.set(0, 1.4, -8);

scene.add(logoPlane);

const loader = new GLTFLoader();

const MODEL_PATH = location.pathname.includes("index")
  ? "bicicleta/models/bicicleta.glb"
  : "../bicicleta/models/bicicleta.glb";

loader.load(
    MODEL_PATH,

  (gltf) => {
    console.log("✅ GLB cargado");
    console.log(gltf.scene);

    const bicicleta = gltf.scene;

    bicicletaModel = bicicleta;

    bicicleta.position.set(0, -0.6, 0);

    bicicleta.scale.set(0.9, 0.9, 0.9);

    bicicleta.rotation.y = Math.PI / 2;

    scene.add(bicicleta);

    const box = new THREE.Box3().setFromObject(bicicleta);
    const center = box.getCenter(new THREE.Vector3());

    controls.target.copy(center);
    camera.lookAt(center);

    console.log(bicicleta);

        bicicleta.traverse(child => {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

        objetos.push(child);

                piezas[child.name] = child;
            }
        });
    },

  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
  },

    (error) => {

        console.error("❌ ERROR GLB:", error);

    }
);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.06,
  0.15,
  0.9
);

composer.addPass(bloomPass);

const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera,
);

composer.addPass(outlinePass);

outlinePass.edgeStrength = 5;
outlinePass.edgeGlow = 1;
outlinePass.edgeThickness = 2;
outlinePass.visibleEdgeColor.set(0x00ff88);
outlinePass.hiddenEdgeColor.set(0x003322);

updateRendererSize();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function updateOutline() {
  const selected = [];

  if (hoveredObject) selected.push(hoveredObject);
  if (selectedObject) selected.push(selectedObject);

  outlinePass.selectedObjects = selected;
}

function explodeModel() {
  exploded = !exploded;

  explosionData.forEach((data, obj) => {
    const distance = exploded ? 2 : 0;

    obj.userData.targetPosition = data.originalPosition
      .clone()
      .add(data.direction.clone().multiplyScalar(distance));

    obj.userData.delay = data.delay;
    obj.userData.startPosition = obj.position.clone();
    obj.userData.startTime = performance.now();
  });
}

function createExplosionParticles(position) {
  const count = 120;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = [];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = position.x;
    positions[i * 3 + 1] = position.y;
    positions[i * 3 + 2] = position.z;

    velocities.push({
      x: (Math.random() - 0.5) * 0.4,
      y: Math.random() * 0.8,
      z: (Math.random() - 0.5) * 0.4,
    });
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    map: sparkTexture,
    size: 0.15,
    color: 0x00ff99,
    transparent: true,
    alphaTest: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  particleSystem = new THREE.Points(geometry, material);
  particleSystem.userData.velocities = velocities;

  scene.add(particleSystem);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function moveCameraTo(targetObj) {
  const box = new THREE.Box3().setFromObject(targetObj);
  const center = box.getCenter(new THREE.Vector3());

  cameraStart.copy(camera.position);

  cameraEnd.copy(center).add(new THREE.Vector3(2, 2, 3));
  cameraTarget.copy(center);

  cameraAnimating = true;
  cameraStartTime = performance.now();

  controls.enabled = false;
}

window.addEventListener("mousemove", (e) => {
  autoRotate = false;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hit = raycaster.intersectObjects(objetos, false);

  if (hit.length > 0) {
    hoveredObject = hit[0].object;

    tooltip.style.display = "block";
    tooltip.style.left = e.clientX + "px";
    tooltip.style.top = e.clientY + "px";
    tooltip.innerText = hoveredObject.name;
  } else {
    hoveredObject = null;
    tooltip.style.display = "none";

    autoRotate = true;
  }

  updateOutline();
});

window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const hit = raycaster.intersectObjects(objetos, false);

  if (hit.length > 0) {
    selectedObject = hit[0].object;
    explodeModel();
    moveCameraTo(selectedObject);

    if (selectedObject.material) {
      const mats = Array.isArray(selectedObject.material)
        ? selectedObject.material
        : [selectedObject.material];

      mats.forEach((m) => {
        m.emissive = new THREE.Color(0x00ff88);

        m.emissiveIntensity = 3;
      });
    }

    const pos = new THREE.Vector3();
    selectedObject.getWorldPosition(pos);
    createExplosionParticles(pos);

    const titulo = document.getElementById("titulo");
    const descripcion = document.getElementById("descripcion");

    if (titulo && descripcion && selectedObject) {
      titulo.innerText = selectedObject.name;
      descripcion.innerText = "Ver productos";
    }

    const categoria = mapaCategorias[selectedObject.name];
    let urlParams ="";
    if (categoria !== undefined) {
      urlParams = `?cat=${categoria}`;
    }
    setTimeout(() => {
        window.location.href = `vistas/catalogo/catalogo.html${urlParams}`;
      }, 1200);
  }

  updateOutline();
});

window.addEventListener("resize", () => {
  if (composer) updateRendererSize();
});

function animate() {
  requestAnimationFrame(animate);

  if (bicicletaModel && autoRotate) {
    bicicletaModel.rotation.y += 0.0015;
  }

  objetos.forEach((obj) => {
    if (obj.userData.targetPosition) {
      if (!obj.userData.startTime) {
        obj.userData.startTime = performance.now();
      }

      const elapsed = (performance.now() - obj.userData.startTime) / 1000;

      if (elapsed > (obj.userData.delay || 0)) {
        const duration = 1.2;
        const start = obj.userData.startTime || performance.now();

        const t = Math.min((performance.now() - start) / (duration * 1000), 1);
        const eased = easeInOutCubic(t);

        obj.position.lerpVectors(
          obj.userData.startPosition,
          obj.userData.targetPosition,
          eased,
        );
      }
    }
  });

  if (cameraAnimating) {
    const elapsed =
      (performance.now() - cameraStartTime) / (cameraDuration * 1000);
    const t = Math.min(elapsed, 1);
    const eased = easeInOutCubic(t);

    camera.position.lerpVectors(cameraStart, cameraEnd, eased);
    controls.target.lerp(cameraTarget, eased);

    if (t === 1) {
      cameraAnimating = false;
      controls.enabled = true;
    }
  }

  controls.update();

  if (particleSystem) {
    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.userData.velocities;

    for (let i = 0; i < velocities.length; i++) {
      velocities[i].y -= 0.015;

      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      positions[i * 3 + 2] += velocities[i].z;
    }

    particleSystem.material.opacity *= 0.96;

    particleSystem.material.size *= 0.98;

    if (particleSystem.material.opacity < 0.05) {
      scene.remove(particleSystem);
      particleSystem = null;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  composer.render();
}

animate();
