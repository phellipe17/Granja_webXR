document.getElementById('startButton').addEventListener('click', () => {
    // Solicita o modo de tela cheia
    const body = document.body;
    if (body.requestFullscreen) {
      body.requestFullscreen();
    } else if (body.webkitRequestFullscreen) { // Para navegadores baseados em WebKit (Safari)
      body.webkitRequestFullscreen();
    } else if (body.msRequestFullscreen) { // Para IE/Edge
      body.msRequestFullscreen();
    }
  
    // Oculta o botão e inicia os recursos necessários
    document.getElementById('info').style.display = 'none';
    enableDeviceOrientation();
    playVideo();
    animate();
  });
  