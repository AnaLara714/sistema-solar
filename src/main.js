const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 15, 85);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const textureLoader = new THREE.TextureLoader();

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
    { nome: "Mercurio", textura: "8k_mercury.jpg", raio: 0.6, distancia: 8 },
    { nome: "Venus", textura: "8k_venus.jpg", raio: 0.9, distancia: 11 },
    { nome: "Terra", textura: "8k_earth.jpg", raio: 1, distancia: 14 },
    { nome: "Lua", textura: "8k_moon.jpg", raio: 0.27, distancia: 15.5 },
    { nome: "Marte", textura: "8k_mars.jpg", raio: 0.8, distancia: 17 },
    { nome: "Jupiter", textura: "8k_jupiter.jpg", raio: 2.5, distancia: 21 },
    {
      nome: "Saturno",
      textura: "8k_saturn.jpg",
      raio: 2.2,
      distancia: 26,
      anel: true,
    },
    { nome: "Urano", textura: "2k_uranus.jpg", raio: 1.5, distancia: 31 },
    { nome: "Netuno", textura: "2k_neptune.jpg", raio: 1.5, distancia: 36 },
  ];

  dadosPlanetas.forEach((p) => {
    const textura = textureLoader.load(`./assets/textures/${p.textura}`);
    const geometria = new THREE.SphereGeometry(p.raio, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: textura });
    const planeta = new THREE.Mesh(geometria, material);
    planeta.position.x = p.distancia;
    scene.add(planeta);
    planetas.push({ mesh: planeta, ...p });

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
      ring.position.copy(planeta.position);
      scene.add(ring);
    }
  });
}

createPlanets();

function animate() {
  requestAnimationFrame(animate);

  sun.rotation.y += 0.001;

  renderer.render(scene, camera);
}

animate();
