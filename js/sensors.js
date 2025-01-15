import { camera } from './renderer.js';

function handleOrientation(event) {
  const alpha = THREE.MathUtils.degToRad(event.alpha || 0); // Rotação no eixo Z
  const beta = THREE.MathUtils.degToRad(event.beta || 0);   // Rotação no eixo X
  const gamma = THREE.MathUtils.degToRad(event.gamma || 0); // Rotação no eixo Y

  const euler = new THREE.Euler(beta, alpha, -gamma, 'YXZ');
  camera.quaternion.setFromEuler(euler);
}

export function enableDeviceOrientation() {
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation, true);
  } else {
    alert('Seu dispositivo não suporta DeviceOrientation API.');
  }
}
