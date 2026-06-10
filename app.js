const slider = document.getElementById("slider");
const salida = document.getElementById("salida");

slider.addEventListener("change", (e) => {
  salida.textContent = e.detail.value;
});
