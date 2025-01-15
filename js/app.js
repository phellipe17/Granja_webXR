import { renderer, scene, camera } from './renderer.js';
import { enableDeviceInteraction } from './sensors.js';
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

    // Ocultar o botão e iniciar os recursos
    document.getElementById('info').style.display = 'none';
    playVideo();
    enableDeviceInteraction(); // Ativar interação
    animate();
  } catch (error) {
    console.error('Erro ao iniciar a experiência:', error);
  }
});

function animate() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}
