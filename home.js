// IMPORTACIONES
import { navBar } from "./componentes/barraNavegacion/barNav.js";
import { footer } from "./componentes/pieDePagina/footer.js";
import { inicializarBotonesCarrito } from "./vistas/carrito/carrito-events.js";

// NAV Y FOOTER
navBar("Sube de nivel", "./");

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

inicializarBotonesCarrito();

// IMPORTACIONES
import { navBar } from "./componentes/barraNavegacion/barNav.js";
import { footer } from "./componentes/pieDePagina/footer.js";
import tarjetasConImagen from "./componentes/tarjetas/tarjetasConImagen/tarjetasConImagen.js";


// NAV Y FOOTER
navBar("BikePartsPro", "Sube de nivel", "./");

document.getElementById("footer").innerHTML = footer("../../");



//  Carrusel 
document.getElementById("btnCatalogo").addEventListener("click", () => {
  document.querySelector(".repuestos-container").scrollIntoView({
    behavior: "smooth"
  });
});

//  tarjetas con img

const contenedor = document.querySelector(".repuestos-container");

const productos = [
  {
    titulo: "Pacha",
    precio: "$250.000",
    descripcion: "Alta precisión",
    imagen: "img2/1.webp"
  },
  {
    titulo: "Cadena",
    precio: "$250.000",
    descripcion: "Alta precisión",
    imagen: "img2/2.webp"
  },
  {
    titulo: "Sillín",
    precio: "$250.000",
    descripcion: "Alta precisión",
    imagen: "img2/3.webp"
  },
  {
    titulo: "Sillín",
    precio: "$250.000",
    descripcion: "Alta precisión",
    imagen: "img2/4.webp"
  },
  {
    titulo: "Sillín",
    precio: "$250.000",
    descripcion: "Alta precisión",
    imagen: "img2/5.webp"
  },
   {
    titulo: "Sillín",
    precio: "$250.000",
    descripcion: "Alta precisión",
    imagen: "img2/6.webp"
  },
   {
    titulo: "Sillín",
    precio: "$250.000",
    descripcion: "Alta precisión",
    imagen: "img2/7.webp"
  },
   {
    titulo: "Sillín",
    precio: "$250.000",
    descripcion: "Alta precisión",
    imagen: "img2/8.webp"
  },
   {
    titulo: "Sillín",
    precio: "$250.000",
    descripcion: "Alta precisión",
    imagen: "img2/9.webp"
  }
];

productos.forEach(p => {
  contenedor.innerHTML += tarjetasConImagen(
    p.titulo,
    p.precio,
    p.descripcion,
    p.imagen,
    `<a class="btn btn-success">Comprar</a>`,
    "sm"
  );
});

productos.forEach(p => {
  contenedor.innerHTML += `
    <div class="col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      ${tarjetasConImagen(
        p.titulo,
        p.precio,
        p.descripcion,
        p.imagen,
        `<a class="btn btn-success">Comprar</a>`,
        "sm"
      )}
    </div>
  `;
});