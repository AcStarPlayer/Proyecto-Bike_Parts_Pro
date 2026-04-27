import tarjetasConImagen from "../../componentes/tarjetas/tarjetasConImagen/tarjetasConImagen.js";
import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/pieDePagina/footer.js";
import { botones } from "../../componentes/botones/botones.js";
import { productosPredeterminados } from "../../apis/productos.js";
import { inicializarBotonesCarrito } from "../carrito/carrito-events.js";

navBar("Sube de nivel", "../../");

const productos = JSON.parse(localStorage.getItem("productos") || "[]");
localStorage.setItem("productos", JSON.stringify(productosPredeterminados));

// RENDER
const catalogoDiv = document.getElementById("catalogo");

let html = "";

productos.forEach((producto) => {
  let acciones = botones("Agregar al carrito", "primary");

  html += `
    <div class="col-sm-6 col-md-4 col-lg-3">
      ${tarjetasConImagen(
        producto.titulo,
        `${producto.precio.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        producto.descripcion,
        producto.imagen,
        acciones,
        "xxs",
        "start",
      )}
    </div>
  `;
});

catalogoDiv.innerHTML = html;

inicializarBotonesCarrito();

// FOOTER
document.getElementById("footer").innerHTML = footer("../../");
