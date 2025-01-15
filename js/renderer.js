import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true;

document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(500, 60, 40);
geometry.scale(-1, 1, 1);

const video = document.createElement('video');
video.src = 'assets/Ex_video_360.mp4';
video.crossOrigin = 'anonymous';
video.loop = true;
video.muted = true; // Necessário para autoplay em navegadores
video.play().catch((error) => console.error('Erro ao reproduzir o vídeo:', error));

const videoTexture = new THREE.VideoTexture(video);
const material = new THREE.MeshBasicMaterial({ map: videoTexture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.set(0, 0, 0);

export { renderer, scene, camera, video };
