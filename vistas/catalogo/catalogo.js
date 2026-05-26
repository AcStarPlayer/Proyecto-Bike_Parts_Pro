import tarjetasConImagen from "../../componentes/tarjetas/tarjetasConImagen/tarjetasConImagen.js";
import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/pieDePagina/footer.js";
import { botones } from "../../componentes/botones/botones.js";
import { productosPredeterminados } from "../../apis/productos.js";
import { inicializarBotonesCarrito } from "../carrito/carrito-events.js";

navBar("Sube de nivel", "../../");

const productosGuardados = JSON.parse(
  localStorage.getItem("productos") || "null",
);
const productos =
  Array.isArray(productosGuardados) && productosGuardados.length
    ? productosGuardados
    : productosPredeterminados;

if (!productosGuardados || !productosGuardados.length) {
  localStorage.setItem("productos", JSON.stringify(productosPredeterminados));
}

const catalogoDiv = document.getElementById("catalogo");

let html = "";

productos.forEach((producto) => {
  let acciones = botones(
    `<i class="bi bi-cart-plus" style="font-size: 18px;"></i> Agregar al carrito`,
    "primary boton-agregar-carrito-producto",
    "button",
    `data-sku="${producto.sku}"`,
  );

  console.log(producto.categoria);

  html += `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      ${tarjetasConImagen(
        producto.titulo,
        producto.descripcion,
        `${producto.precio.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        producto.imagen,
        acciones,
        "xxs",
        "start",
        producto.categoria
      )}
    </div>
  `;
});

catalogoDiv.innerHTML = html;

inicializarBotonesCarrito();

document.getElementById("footer").innerHTML = footer("../../");
