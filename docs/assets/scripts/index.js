let count = 1
document.getElementById("rad1").checked = true;

setInterval(function(){
    nextImg()
},2000)

function nextImg(){
    count++
    if(count>4){
        count=1
    }

    document.getElementById("rad"+count).checked = true;
    console.log("rad"+count)
}



var TrandingSlider = new Swiper('.tranding-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 2.5,
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