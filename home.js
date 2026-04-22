document.addEventListener("DOMContentLoaded", () => {

  const track = document.getElementById("carouselTrack");
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const dotsContainer = document.getElementById("dots");

  let index = 0;

  // Crear dots
  slides.forEach((_, i) => {
    const dot = document.createElement("span");

    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      index = i;
      updateCarousel();
    });

    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("span");

  // Función para actualizar
  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
  }

  // Botón siguiente
  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateCarousel();
  });

  // Botón anterior
  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  // Autoplay
  setInterval(() => {
    index = (index + 1) % slides.length;
    updateCarousel();
  }, 4000);

});

// ================= BIKE INTERACTIVA =================

const hotspots = document.querySelectorAll(".hotspot");
const tooltip = document.getElementById("tooltip");

hotspots.forEach(hotspot => {

  hotspot.addEventListener("mouseenter", () => {
    tooltip.style.display = "block";
    tooltip.textContent = hotspot.dataset.info;

    tooltip.style.top = (hotspot.offsetTop - 30) + "px";
    tooltip.style.left = (hotspot.offsetLeft + 20) + "px";
  });

  hotspot.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });

  // CLICK (opcional)
  hotspot.addEventListener("click", () => {
    alert("Ir a categoría: " + hotspot.dataset.info);

    // ejemplo real:
    // window.location.href = "categoria.html?tipo=" + hotspot.dataset.info;
  });

});