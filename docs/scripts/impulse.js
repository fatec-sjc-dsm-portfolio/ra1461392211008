const pulseLight = document.getElementById("light");

document.addEventListener("mousemove", (event) => {
  pulseLight.style.left = `${event.pageX}px`;
  pulseLight.style.top = `${event.pageY}px`;
});