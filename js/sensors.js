import { camera } from './renderer.js';

let isMobile = false;

// Detectar se o dispositivo suporta DeviceOrientation
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (event) => {
    isMobile = true;
    handleOrientation(event);
  });
} else {
  console.warn('DeviceOrientationEvent não suportado. Usando interação de mouse.');
}

// Função para manipular o acelerômetro (dispositivos móveis)
function handleOrientation(event) {
  if (!isMobile) return;

  const alpha = THREE.MathUtils.degToRad(event.alpha || 0); // Rotação no eixo Z
  const beta = THREE.MathUtils.degToRad(event.beta || 0);   // Rotação no eixo X
  const gamma = THREE.MathUtils.degToRad(event.gamma || 0); // Rotação no eixo Y

  const euler = new THREE.Euler(beta, alpha, -gamma, 'YXZ');
  camera.quaternion.setFromEuler(euler);
}

// Função para manipular o mouse (computadores)
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function handleMouseMove(event) {
  if (!isDragging) return;

  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };

  const rotationSpeed = 0.005; // Ajuste a velocidade de rotação

  // Atualizar a rotação da câmera
  camera.rotation.y -= deltaX * rotationSpeed;
  camera.rotation.x -= deltaY * rotationSpeed;
}

// Funções para mouse
function handleMouseDown(event) {
  isDragging = true;
  previousMousePosition = { x: event.clientX, y: event.clientY };
}

function handleMouseUp() {
  isDragging = false;
}

// Adicionar eventos para dispositivos não móveis
if (!isMobile) {
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
}

export function enableDeviceInteraction() {
  if (isMobile) {
    console.log('Usando acelerômetro.');
  } else {
    console.log('Usando controle de mouse.');
  }
}
