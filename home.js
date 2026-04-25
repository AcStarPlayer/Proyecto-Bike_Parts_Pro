// IMPORTACIONES
import { navBar } from "./componentes/barraNavegacion/barNav.js";
import { footer } from "./componentes/piecero/footer.js";

// NAV Y FOOTER
navBar(document.querySelector(".nav-content"), "BikePartsPro", "Sube de nivel", "./");

document.getElementById("footer").innerHTML = footer("../../");

// ================= CARRUSEL =================
document.addEventListener("DOMContentLoaded", () => {

  const contenedorCarrusel = document.getElementById("carouselTrack");
  const diapositivas = document.querySelectorAll(".slide");
  const botonSiguiente = document.getElementById("nextBtn");
  const botonAnterior = document.getElementById("prevBtn");
  const contenedorPuntos = document.getElementById("dots");

  let indiceActual = 0;

  // 🔹 CREAR PUNTOS (dots)
  diapositivas.forEach((_, i) => {
    const punto = document.createElement("span");

    if (i === 0) punto.classList.add("active");

    punto.addEventListener("click", () => {
      indiceActual = i;
      actualizarCarrusel();
    });

    contenedorPuntos.appendChild(punto);
  });

  const puntos = contenedorPuntos.querySelectorAll("span");

  // 🔹 FUNCIÓN PARA ACTUALIZAR EL CARRUSEL
  function actualizarCarrusel() {
    contenedorCarrusel.style.transform = `translateX(-${indiceActual * 100}%)`;

    puntos.forEach(p => p.classList.remove("active"));
    puntos[indiceActual].classList.add("active");
  }

  // BOTÓN SIGUIENTE
  botonSiguiente.addEventListener("click", () => {
    indiceActual = (indiceActual + 1) % diapositivas.length;
    actualizarCarrusel();
  });

  // BOTÓN ANTERIOR
  botonAnterior.addEventListener("click", () => {
    indiceActual = (indiceActual - 1 + diapositivas.length) % diapositivas.length;
    actualizarCarrusel();
  });

  // AUTO PLAY
  setInterval(() => {
    indiceActual = (indiceActual + 1) % diapositivas.length;
    actualizarCarrusel();
  }, 4000);

});


// ================= BIKE INTERACTIVA =================

// Selecciona todos los puntos interactivos
const puntosInteractivos = document.querySelectorAll(".hotspot");

// Tooltip
const tooltip = document.getElementById("tooltip");

puntosInteractivos.forEach(punto => {

  // Cuando el mouse entra
  punto.addEventListener("mouseenter", () => {
    tooltip.style.display = "block";
    tooltip.textContent = punto.dataset.info;

    tooltip.style.top = (punto.offsetTop - 30) + "px";
    tooltip.style.left = (punto.offsetLeft + 20) + "px";
  });

  // Cuando el mouse sale
  punto.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });

  // CLICK (opcional)
  punto.addEventListener("click", () => {
    alert("Ir a categoría: " + punto.dataset.info);

    // 👉 Ejemplo real:
    // window.location.href = "categoria.html?tipo=" + punto.dataset.info;
  });

});

//contador en el navbar
const nav = document.querySelector(".nav-content");

nav.innerHTML += `
  <div class="cart-icon">
    <i class="bi bi-cart3"></i>
    <span id="cart-count">0</span>
  </div>
`;

let contador = 0;

const botonesAgregar = document.querySelectorAll(".btn-add");
const contadorUI = document.getElementById("cart-count");

botonesAgregar.forEach(boton => {
  boton.addEventListener("click", () => {
    contador++;
    contadorUI.textContent = contador;

    // pequeño feedback visual
    contadorUI.style.transform = "scale(1.3)";
    setTimeout(() => {
      contadorUI.style.transform = "scale(1)";
    }, 200);
  });
});