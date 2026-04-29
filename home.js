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