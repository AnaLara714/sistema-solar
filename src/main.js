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
    { nome: "Mercurio", textura: "8k_mercury.jpg", raio: 0.6, distancia: 8, velocidadeRotacao: 0.004 },
    { nome: "Venus", textura: "8k_venus.jpg", raio: 0.9, distancia: 11, velocidadeRotacao: 0.002 },
    { nome: "Terra", textura: "8k_earth.jpg", raio: 1, distancia: 14, velocidadeRotacao: 0.010 },
    { nome: "Lua", textura: "8k_moon.jpg", raio: 0.27, distancia: 15.5, velocidadeRotacao: 0.001 },
    { nome: "Marte", textura: "8k_mars.jpg", raio: 0.8, distancia: 17, velocidadeRotacao: 0.009 },
    { nome: "Jupiter", textura: "8k_jupiter.jpg", raio: 2.5, distancia: 21, velocidadeRotacao: 0.022 },
    {
        nome: "Saturno",
        textura: "8k_saturn.jpg",
        raio: 2.2,
        distancia: 26,
        anel: true,
        velocidadeRotacao: 0.018 },
    { nome: "Urano", textura: "2k_uranus.jpg", raio: 1.5, distancia: 31, velocidadeRotacao: 0.015 },
    { nome: "Netuno", textura: "2k_neptune.jpg", raio: 1.5, distancia: 36, velocidadeRotacao: 0.014 },
];

dadosPlanetas.forEach((p) => {

    const textura = textureLoader.load(`./assets/textures/${p.textura}`);
    const geometria = new THREE.SphereGeometry(p.raio, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: textura });
    const planeta = new THREE.Mesh(geometria, material);

    // Grupo "pai" do planeta e de seus anéis
    const planetaGroup = new THREE.Group();
    planetaGroup.add(planeta);

    // Verifica se o planeta tem um anel
    if (p.anel) {
        const ringGeometry = new THREE.RingGeometry(p.raio + 0.4, p.raio + 1.5, 64);
        const ringTexture = textureLoader.load("./assets/textures/saturn_ring.png");
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

    // Referência do MESH (p/rotação) e do GRUPO (p/ translação)
    planetas.push({ mesh: planeta, group: planetaGroup, ...p });
});
}

createPlanets();

  function animate() {
    requestAnimationFrame(animate);

    sun.rotation.y += 0.001;

    planetas.forEach(planeta => {
        planeta.mesh.rotation.y += planeta.velocidadeRotacao;
    });

    renderer.render(scene, camera);
}

animate();
