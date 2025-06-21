// cria a cena e a câmera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// posiciona a câmera
camera.position.z = 20;

// cria o renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// adiciona as luzes
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const sun = createSun();

function createSun() {
  const textureLoader = new THREE.TextureLoader();
  const sunTexture = textureLoader.load("./assets/textures/8k_sun.jpg");

  const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
    lightMap: sunTexture,
    lightMapIntensity: 5,
  });

  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  return sun;
}

function animate() {
  requestAnimationFrame(animate);

  sun.rotation.y += 0.001;

  renderer.render(scene, camera);
}

animate();
