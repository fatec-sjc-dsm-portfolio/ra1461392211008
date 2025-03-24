document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM carregado, inicializando scripts...");


  const projetosSlider = new Swiper('.projetos-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: -2,
      stretch: 0,
      depth: 400,
      modifier: 1,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });
  console.log("Swiper inicializado com sucesso:", projetosSlider);

  // Efeito de luz
  const light = document.querySelector("#hex-grid .light");

  if (light) {
    console.log("Elemento .light encontrado, configurando movimento...");


    const lightSize = 200;
    const offset = lightSize / 2;
    document.addEventListener('mousemove', function (e) {

      const newLeft = e.clientX - offset;
      const newTop = e.clientY - offset;

      // Aplica a nova posição
      light.style.left = `${newLeft}px`;
      light.style.top = `${newTop}px`;

    });

    light.style.left = `${initialLeft}px`;
    light.style.top = `${initialTop}px`;
  }
});