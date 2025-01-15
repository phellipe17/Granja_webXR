import { renderer, scene, camera } from './renderer.js';
import { enableDeviceInteraction } from './sensors.js';
import { playVideo } from './videoHandler.js';

// Função para detectar se é um dispositivo móvel
function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

// Evento de clique no botão
document.getElementById('startButton').addEventListener('click', async () => {
  try {
    // Verifique se é um dispositivo móvel
    const mobile = isMobileDevice();

    if (mobile) {
      // Modo de tela cheia no navegador do celular
      const body = document.body;
      if (body.requestFullscreen) {
        await body.requestFullscreen();
      } else if (body.webkitRequestFullscreen) {
        await body.webkitRequestFullscreen();
      } else if (body.msRequestFullscreen) {
        await body.msRequestFullscreen();
      } else {
        console.warn('Fullscreen API não suportada neste navegador.');
      }
    } else {
      // Para desktop, ajuste a tela do navegador
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
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
