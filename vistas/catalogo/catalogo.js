import tarjetasConImagen from "../../componentes/tarjetas/tarjetasConImagen/tarjetasConImagen.js";
import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/pieDePagina/footer.js";
import { botones } from "../../componentes/botones/botones.js";
import {
  paginacion,
  cambiarPagina,
} from "../../componentes/paginacion/paginacion.js";
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

let paginaActual = 1;
const productosPorPagina = 10;

function filtrarProducto(producto, categoria, nombreProducto) {
  const tieneCategoria = categoria !== null;
  const tieneNombre = nombreProducto && nombreProducto.trim() !== "";

  if (!tieneCategoria && !tieneNombre) return true;

  const matchCategoria = !tieneCategoria || producto.categoria === categoria;

  const matchNombre =
    !tieneNombre ||
    producto.titulo.toLowerCase().includes(nombreProducto.toLowerCase());

  return matchCategoria && matchNombre;
}

function catalogo(categoria = null, nombreProducto = null) {
  const catalogoDiv = document.getElementById("catalogo");

  const filtrados = productos.filter((p) =>
    filtrarProducto(p, categoria, nombreProducto),
  );

  const inicio = (paginaActual - 1) * productosPorPagina;
  const paginaProductos = filtrados.slice(inicio, inicio + productosPorPagina);

  let html = "";

  paginaProductos.forEach((producto) => {
    let acciones = botones(
      `<i class="bi bi-cart-plus" style="font-size: 18px;"></i> Agregar al carrito`,
      "primary boton-agregar-carrito-producto",
      "button",
      `data-sku="${producto.sku}"`,
    );

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
        producto.categoria,
      )}
    </div>
  `;
  });

  catalogoDiv.innerHTML = html;
  return filtrados.length;
}

function renderizar(categoria = null, nombreProducto = null) {
  const totalProductos = catalogo(categoria, nombreProducto);
  const totalPaginas = Math.ceil(totalProductos / productosPorPagina);

  document.querySelector("#paginacion").innerHTML = paginacion(
    totalPaginas,
    paginaActual,
  );

  inicializarBotonesCarrito();
}

document.addEventListener("click", (e) => {
  const link = e.target.closest(".page-link");
  if (!link) return;

  e.preventDefault();

  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  const nuevaPagina = cambiarPagina(link, {
    paginaActual,
    totalPaginas,
  });

  paginaActual = nuevaPagina;

  renderizar();
});

renderizar();

document.getElementById("footer").innerHTML = footer("../../");
