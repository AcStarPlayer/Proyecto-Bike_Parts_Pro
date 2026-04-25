
import tarjetasConImagen from "../../componentes/tarjetas/tarjetasConImagen/tarjetasConImagen.js";
import { navBar } from "../../componentes/barraNavegacion/barNav.js";
navBar(document.querySelector(".nav-content"), "BikePartsPro", "Sube de nivel", "../../");


// NAVBAR
navBar(
  document.querySelector(".nav-content"),
  "BikePartsPro",
  "Catálogo",
  "../../"
);

// PRODUCTOS (10)
const productos = [
  {
    titulo: "Cadena Shimano",
    precio: "$45.000",
    descripcion: "Alta resistencia MTB",
    imagen: "../../img2/tensor1.webp"
  },
  {
    titulo: "Frenos de disco",
    precio: "$120.000",
    descripcion: "Precisión total",
    imagen: "../../img2/tensor2.webp"
  },
  {
    titulo: "Casco Pro",
    precio: "$80.000",
    descripcion: "Ligero y seguro",
    imagen: "../../img2/silla1.webp"
  },
  {
    titulo: "Pedales aluminio",
    precio: "$60.000",
    descripcion: "Alta durabilidad",
    imagen: "../../img2/pacha2.webp"
  },
  {
    titulo: "Rin 29",
    precio: "$200.000",
    descripcion: "Resistencia extrema",
    imagen: "../../img2/pedales1.webp"
  },
  {
    titulo: "Sillín confort",
    precio: "$55.000",
    descripcion: "Mayor comodidad",
    imagen: "../../img2/pedales2.webp"
  },
  {
    titulo: "Manubrio MTB",
    precio: "$70.000",
    descripcion: "Control total",
    imagen: "../../img2/casco2.webp"
  },
  {
    titulo: "Guantes ciclismo",
    precio: "$25.000",
    descripcion: "Mejor agarre",
    imagen: "../../img2/llanta2.webp"
  },
  {
    titulo: "Bomba aire",
    precio: "$35.000",
    descripcion: "Compacta y eficiente",
    imagen: "../../img2/llanta1.webp"
  },
  {
    titulo: "Kit herramientas",
    precio: "$90.000",
    descripcion: "Todo en uno",
    imagen: "../../img2/lampara1.webp"
  },
  {
  titulo: "Cadena Shimano",
  precio: "$45.000",
  descripcion: "Alta resistencia MTB",
  imagen: "../../img2/casco.webp"
  },  

  {
  titulo: "Cadena Shimano",
  precio: "$45.000",
  descripcion: "Alta resistencia MTB",
  imagen: "../../img2/gafas1.webp"
}
  
];

// RENDER
const catalogoDiv = document.getElementById("catalogo");

let html = "";

productos.forEach((producto) => {
  const acciones = `
    <button class="btn btn-success btn-sm rounded-pill m-1">Comprar</button>
  `;

  html += `
    <div class="col-sm-6 col-md-4 col-lg-3">
      ${tarjetasConImagen(
        producto.titulo,
        producto.precio,
        producto.descripcion,
        producto.imagen,
        acciones,
        "sm"
      )}
    </div>
  `;
});

catalogoDiv.innerHTML = html;


// FOOTER
document.getElementById("footer").innerHTML = footer("../../");