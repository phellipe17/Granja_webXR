import { renderer, scene, camera } from './renderer.js';
import { enableDeviceOrientation } from './sensors.js';
import { playVideo } from './videoHandler.js';

document.getElementById('startButton').addEventListener('click', async () => {
  try {
    // Entrar no modo de tela cheia
    const body = document.body;
    if (body.requestFullscreen) {
      await body.requestFullscreen();
    } else if (body.webkitRequestFullscreen) {
      await body.webkitRequestFullscreen();
    } else if (body.msRequestFullscreen) {
      await body.msRequestFullscreen();
    }

    // Ajustar o tamanho do renderizador para tela cheia
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Ocultar o botão e iniciar os recursos
    document.getElementById('info').style.display = 'none';
    enableDeviceOrientation();
    playVideo();
    animate(); // Inicia o loop de renderização
  } catch (error) {
    console.error('Erro ao entrar no modo de tela cheia:', error);
  }
});

function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}
