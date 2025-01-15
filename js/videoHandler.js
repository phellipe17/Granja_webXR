import { video } from './renderer.js';

export function playVideo() {
  video.play().catch((error) => {
    console.error('Erro ao reproduzir o vídeo:', error);
  });
}
