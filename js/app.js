import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js';
import { VRButton } from 'https://cdn.jsdelivr.net/npm/three@0.128/examples/jsm/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true; // Ativa o WebXR
document.body.appendChild(renderer.domElement);

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Configuração do vídeo
const video = document.createElement('video');
video.src = 'assets/Ex_video_360.mp4'; // Caminho do vídeo
video.crossOrigin = 'anonymous';
video.loop = true;
video.muted = true; // Necessário para autoplay
video.playsInline = true;
video.play().catch(console.error);

const videoTexture = new THREE.VideoTexture(video);
const material = new THREE.MeshBasicMaterial({ map: videoTexture });
const geometry = new THREE.SphereGeometry(500, 60, 40);
geometry.scale(-1, 1, 1); // Inverter a esfera para visualização interna

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.set(0, 0, 0);

document.getElementById('startButton').addEventListener('click', () => {
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  const container = document.getElementById('container');
  container.classList.add('hidden');



  if (isMobile) { 
    // Verifica se DeviceOrientationEvent está definido
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        console.log('Entrou no iOS ou navegador que exige permissão para DeviceOrientation');
        DeviceOrientationEvent.requestPermission()
            .then((permissionState) => {
                if (permissionState === 'granted') {
                    enterFullScreen();
                    enableDeviceOrientation();
                    playVideo();
                } else {
                    console.warn('Permissão negada para DeviceOrientation.');
                }
            })
            .catch((error) => {
                console.error('Erro ao solicitar permissão para DeviceOrientation:', error);
            });
    } else {
        console.log('Entrou no Android ou navegador que não requer permissão explícita');
        enterFullScreen();
        enableDeviceOrientation();
        playVideo();
    }
} else {
    // Desktop: entra em modo de tela cheia
    console.log('Modo desktop ativado.');
    enterFullScreen();
    enableMouseControls();
    playVideo();
}


  // Iniciar o vídeo e renderização
  // document.getElementById('startButton').style.display = 'none'; // Oculta o botão
  animate();
});

function playVideo() {
  video.play().then(() => {
    console.log('Vídeo está sendo reproduzido.');
  }).catch((error) => {
    console.error('Erro ao tentar reproduzir o vídeo:', error);
  });
}

function enterFullScreen() {
  const body = document.body;
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.webkitRequestFullscreen) {
    body.webkitRequestFullscreen();
  } else if (body.msRequestFullscreen) {
    body.msRequestFullscreen();
  } else {
    console.warn('Fullscreen API não é suportada.');
  }
}

function enableMouseControls() {
  window.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
  });

  window.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    previousMousePosition = { x: event.clientX, y: event.clientY };

    const rotationSpeed = 0.005;
    camera.rotation.y -= deltaX * rotationSpeed;
    camera.rotation.x -= deltaY * rotationSpeed;

    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x)); // Limitar rotação
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function enableDeviceOrientation() {
  const overlay = document.getElementById('overlay'); // Pega o elemento do overlay
  const betaOffset = THREE.MathUtils.degToRad(90);
  if (typeof DeviceOrientationEvent !== 'undefined') {
    console.log('DeviceOrientationEvent é suportado.');

    window.addEventListener('deviceorientation', (event) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        const alpha = event.alpha.toFixed(2); // Rotação no eixo Z
        const beta = event.beta.toFixed(2) +betaOffset;   // Rotação no eixo X
        const gamma = event.gamma.toFixed(2); // Rotação no eixo Y

        // Atualiza o texto do overlay com os valores do acelerômetro
        overlay.innerHTML = `
          <strong>Valores do Acelerômetro:</strong><br>
          Alpha (Z): ${alpha}°<br>
          Beta (X): ${beta}°<br>
          Gamma (Y): ${gamma}°
        `;

        // Atualiza a rotação da câmera
        const euler = new THREE.Euler(
          THREE.MathUtils.degToRad(beta),
          THREE.MathUtils.degToRad(alpha),
          -THREE.MathUtils.degToRad(gamma),
          'YXZ'
        );
        camera.quaternion.setFromEuler(euler);
      } else {
        console.warn('Os dados do DeviceOrientation não estão disponíveis.');
        overlay.innerHTML = 'Dados do acelerômetro não disponíveis.';
      }
    });
  } else {
    console.warn('DeviceOrientationEvent não é suportado neste navegador.');
    overlay.innerHTML = 'DeviceOrientation não suportado.';
  }
}



function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}
