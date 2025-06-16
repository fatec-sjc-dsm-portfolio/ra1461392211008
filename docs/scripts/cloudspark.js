window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const moveAmount = scrollY * 1.4;
  
    document.getElementById('left').style.transform = `translate(-${moveAmount}px, -100%)`;
    document.getElementById('right').style.transform = `translate(${moveAmount}px, -100%)`;
  });
  