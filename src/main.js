import * as THREE from "https://unpkg.com/three@0.112/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 45);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(50, 50, 50);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const textureLoader = new THREE.TextureLoader();

const starTexture = textureLoader.load(
  "./assets/textures/8k_stars_milky_way.jpg"
);
scene.background = starTexture;

const fundoGeometry = new THREE.SphereGeometry(500, 64, 64);
const fundoMaterial = new THREE.MeshBasicMaterial({
  map: starTexture,
  side: THREE.BackSide,
  opacity: 0.5,
  transparent: true,
  color: 0xffffff, 
});
const fundo = new THREE.Mesh(fundoGeometry, fundoMaterial);
scene.add(fundo);

function createSun() {
  const sunTexture = textureLoader.load("./assets/textures/8k_sun.jpg");
  const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
  const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);
  return sun;
}

const sun = createSun();

const planetas = [];

function createPlanets() {
  const dadosPlanetas = [
    {
      nome: "Mercurio",
      textura: "8k_mercury.jpg",
      raio: 0.6,
      distancia: 8,
      velocidadeRotacao: 0.004,
      velocidadeTranslacao: 0.04,
    },
    {
      nome: "Venus",
      textura: "8k_venus.jpg",
      raio: 0.9,
      distancia: 11,
      velocidadeRotacao: 0.002,
      velocidadeTranslacao: 0.015,
    },
    {
      nome: "Terra",
      textura: "8k_earth.jpg",
      raio: 1,
      distancia: 14,
      velocidadeRotacao: 0.01,
      velocidadeTranslacao: 0.01,
    },
    {
      nome: "Marte",
      textura: "8k_mars.jpg",
      raio: 0.8,
      distancia: 17,
      velocidadeRotacao: 0.009,
      velocidadeTranslacao: 0.008,
    },
    {
      nome: "Jupiter",
      textura: "8k_jupiter.jpg",
      raio: 2.5,
      distancia: 21,
      velocidadeRotacao: 0.022,
      velocidadeTranslacao: 0.006,
    },
    {
      nome: "Saturno",
      textura: "8k_saturn.jpg",
      raio: 2.2,
      distancia: 26,
      anel: true,
      velocidadeRotacao: 0.018,
      velocidadeTranslacao: 0.004,
    },
    {
      nome: "Urano",
      textura: "2k_uranus.jpg",
      raio: 1.5,
      distancia: 31,
      velocidadeRotacao: 0.015,
      velocidadeTranslacao: 0.002,
    },
    {
      nome: "Netuno",
      textura: "2k_neptune.jpg",
      raio: 1.5,
      distancia: 36,
      velocidadeRotacao: 0.014,
      velocidadeTranslacao: 0.0015,
    },
  ];

  dadosPlanetas.forEach((p) => {
    const textura = textureLoader.load(`./assets/textures/${p.textura}`);
    const geometria = new THREE.SphereGeometry(p.raio, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: textura });
    const planeta = new THREE.Mesh(geometria, material);

    const planetaGroup = new THREE.Group();
    planetaGroup.add(planeta);

    if (p.anel) {
      const ringGeometry = new THREE.RingGeometry(
        p.raio + 0.4,
        p.raio + 1.5,
        64
      );
      const ringTexture = textureLoader.load(
        "./assets/textures/saturn_ring.png"
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;

      planetaGroup.add(ring);
    }

    planetaGroup.position.x = p.distancia;

    scene.add(planetaGroup);

    planetas.push({
      mesh: planeta,
      group: planetaGroup,
      anguloOrbital: Math.random() * Math.PI * 2,
      ...p,
    });

    if (p.nome === "Terra") {
      const moonTexture = textureLoader.load("./assets/textures/8k_moon.jpg");
      const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
      const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    
      const moonGroup = new THREE.Group();
      moonGroup.add(moon);
      moon.position.x = 0.3

      planetaGroup.add(moonGroup);

      planetas.push({
        mesh: moon,
        group: moonGroup,
        anguloOrbital: Math.random() * Math.PI * 2,
        velocidadeRotacao: 0.005,
        velocidadeTranslacao: 0.04,
        isMoon: true,
      });
    }
    
  });
}

createPlanets();

function animate() {
  requestAnimationFrame(animate);

  sun.rotation.y += 0.001;

  planetas.forEach((planeta) => {
    planeta.mesh.rotation.y += planeta.velocidadeRotacao;

    planeta.anguloOrbital += planeta.velocidadeTranslacao;
    if (planeta.isMoon) {
      planeta.group.position.x = Math.cos(planeta.anguloOrbital) * 1.5;
      planeta.group.position.z = Math.sin(planeta.anguloOrbital) * 1.5;
    } else {
      planeta.group.position.x =
        Math.cos(planeta.anguloOrbital) * planeta.distancia;
      planeta.group.position.z =
        Math.sin(planeta.anguloOrbital) * planeta.distancia;
    }
  });

  renderer.render(scene, camera);
}

animate();
