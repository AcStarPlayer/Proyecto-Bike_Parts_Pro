import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

import { EffectComposer } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/OutlinePass.js';

import { RGBELoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/RGBELoader.js';

import { TextureLoader } from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const piezas = {};

const mapaCategorias = {
    "llantaTrasera": "ruedas",
    "llantaDelantera": "ruedas",
    "cadena": "transmision",
    "plato": "transmision",
    "marco": "marco",
    "sillin": "sillin",
    "manubrio": "manubrio"
};

const canvas = document.getElementById("canvas3d");
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

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd9c7a3);

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

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

camera.position.set(3.2, 1.1, 6.8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

renderer.setSize(380, 300);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.useLegacyLights = false;

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.physicallyCorrectLights = true;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.4;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

controls.enablePan = false;

controls.minPolarAngle = Math.PI / 2.2;
controls.maxPolarAngle = Math.PI / 2.2;

controls.minDistance = 4;
controls.maxDistance = 7;

controls.target.set(0, 0.45, 0);

const hemi = new THREE.HemisphereLight(
    0xd8ffe8,
    0x29543f,
    2.8
);

scene.add(hemi);

const keyLight = new THREE.DirectionalLight(0xd8ffea, 4);

keyLight.position.set(5, 8, 5);
keyLight.castShadow = true;

keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;

scene.add(keyLight);

const fill = new THREE.DirectionalLight(0xffe2b8, 2);
fill.position.set(-5, 3, 2);
scene.add(fill);

const sunLight = new THREE.DirectionalLight(0xfff2d6, 6);

sunLight.position.set(10, 15, 8);

sunLight.castShadow = true;

sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;

scene.add(sunLight);

const rgbeLoader = new RGBELoader();

/*rgbeLoader.load(
    'https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr',*/
rgbeLoader.load(
    'https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr',    
    (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.encoding = THREE.sRGBEncoding;

        scene.environment = texture;
        scene.environmentIntensity = 1.8;
    }
);

const textureLoader = new TextureLoader();
const sparkTexture = textureLoader.load(
    'https://threejs.org/examples/textures/sprites/spark1.png'
);
sparkTexture.colorSpace = THREE.SRGBColorSpace;

const carbonTexture = textureLoader.load('https://threejs.org/examples/textures/carbon/Carbon.png');
const carbonNormal = textureLoader.load('https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg');

const metalTexture = textureLoader.load('https://threejs.org/examples/textures/metal.jpg');

carbonTexture.colorSpace = THREE.SRGBColorSpace;
metalTexture.colorSpace = THREE.SRGBColorSpace;

const rubberTexture = textureLoader.load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');

metalTexture.colorSpace = THREE.SRGBColorSpace;
rubberTexture.colorSpace = THREE.SRGBColorSpace;

const loader = new GLTFLoader();

//loader.load('./sports_bike/scene.gltf', (gltf) => {
loader.load('./models/bicicleta.glb', (gltf) => {
    //const scene = gltf.scene;
    const bicicleta = gltf.scene;
    bicicletaModel = bicicleta;
    bicicleta.position.y = 0.15;

    bicicleta.scale.set(1.6,1.6,1.6);
    // vista frontal
    bicicleta.rotation.y = Math.PI / 2;

    scene.add(bicicleta);

    bicicleta.traverse(child => {
        if (child.isMesh) {
            
            child.castShadow = true;
            child.receiveShadow = true;

            //
            if (child.material) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];

                mats.forEach(m => {
                    m.needsUpdate = true;

                    m.envMapIntensity = 0.8;
                    m.roughness = Math.min(m.roughness ?? 0.5, 0.8);

                    if (m.map) {
                        m.map.colorSpace = THREE.SRGBColorSpace;
                        m.map.encoding = THREE.sRGBEncoding;
                        m.color.set(0xffffff); // 🔥 CLAVE
                    } else {
                        console.warn("⚠️ Material sin textura:", child.name);
                    }

                    const name = child.name.toLowerCase();

                    if (name.includes("llanta")) {

                        m.color.setHex(0x444444);

                        m.roughness = 0.7;
                        m.metalness = 0.25;

                        //m.envMapIntensity = 2.5;
                        
                        m.roughness = 0.95;
                        m.metalness = 0.05;
                        m.envMapIntensity = 0.8;
                    }

                    else if (name.includes("marco")) {

                        m.roughness = 0.35;
                        m.metalness = 0.6;

                    }

                    else if (
                        name.includes("cadena") ||
                        name.includes("plato")
                    ) {

                        m.roughness = 0.4;
                        m.metalness = 1.0;

                    }

                    else if (name.includes("sillin")) {

                        m.color.setHex(0x111111);
                        m.roughness = 0.9;
                        m.metalness = 0.1;
                    }

                    else {

                        m.roughness = Math.min(m.roughness ?? 0.5, 0.8);
                        m.metalness = m.metalness ?? 0.2;
                    }

                    m.side = THREE.DoubleSide;

                    m.clearcoat = 0.25;
                    m.clearcoatRoughness = 0.8;

                    m.toneMapped = true;
                    m.envMapIntensity = 0.8;

                });
            }

            objetos.push(child);
            piezas[child.name] = child;
        }
    });

    const center = new THREE.Box3().setFromObject(bicicleta).getCenter(new THREE.Vector3());

    bicicleta.traverse(child => {
        if (child.isMesh) {

            const worldPos = new THREE.Vector3();
            child.getWorldPosition(worldPos);

            const direction = worldPos.clone().sub(center).normalize();

            explosionData.set(child, {
                direction,
                originalPosition: child.position.clone(),
                delay: Math.random() * 0.3 // 🔥 efecto escalonado
            });
        }
    });
});

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.05, 
    0.1,
    0.9
);

composer.addPass(bloomPass);

const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
);

composer.addPass(outlinePass);

outlinePass.edgeStrength = 5;
outlinePass.edgeGlow = 1;
outlinePass.edgeThickness = 2;
outlinePass.visibleEdgeColor.set(0x00ff88);
outlinePass.hiddenEdgeColor.set(0x003322);

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

        obj.userData.targetPosition = data.originalPosition.clone().add(
            data.direction.clone().multiplyScalar(distance)
        );

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
            y: (Math.random()) * 0.8,
            z: (Math.random() - 0.5) * 0.4
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        map: sparkTexture,          
        size: 0.15,
        color: 0x00ff99,
        transparent: true,
        alphaTest: 0.5,
        blending: THREE.AdditiveBlending, 
        depthWrite: false
    });

    particleSystem = new THREE.Points(geometry, material);
    particleSystem.userData.velocities = velocities;

    scene.add(particleSystem);
}

function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
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

            mats.forEach(m => {

                m.emissive = new THREE.Color(0x00ff88);

                m.emissiveIntensity = 3;

            });
        }

        const pos = new THREE.Vector3();
        selectedObject.getWorldPosition(pos);
        createExplosionParticles(pos);

        document.getElementById("titulo").innerText = selectedObject.name;
        document.getElementById("descripcion").innerText = "Ver productos";

        const categoria = mapaCategorias[selectedObject.name] || "otros";

        setTimeout(() => {
            window.location.href = "/categoria/" + categoria;
        }, 1200);
    }

    updateOutline();
});

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnExplode").addEventListener("click", () => {
        explodeModel();
    });
});

window.addEventListener("resize", () => {

    const width = 380;
    const height = 300;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);

});

function animate() {
    requestAnimationFrame(animate);

    if (bicicletaModel && autoRotate) {
        bicicletaModel.rotation.y += 0.0015;
    }

    objetos.forEach(obj => {

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
                    eased
                );
            }
        }
    });

    if (cameraAnimating) {

        const elapsed = (performance.now() - cameraStartTime) / (cameraDuration * 1000);
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