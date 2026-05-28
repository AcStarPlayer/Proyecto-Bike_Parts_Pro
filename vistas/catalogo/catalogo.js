import tarjetasConImagen from "../../componentes/tarjetas/tarjetasConImagen/tarjetasConImagen.js";
import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/pieDePagina/footer.js";
import { botones } from "../../componentes/botones/botones.js";
import {
  paginacion,
  cambiarPagina,
} from "../../componentes/paginacion/paginacion.js";
import { productosPredeterminados, filtrarProductos } from "../../apis/productos.js";
import { inicializarBotonesCarrito } from "../carrito/carrito-events.js";
import { categorias } from "../../apis/categorias.js";

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
let categoriaActual = null;
const productosPorPagina = 10;

function catalogo(categoria = null, nombreProducto = null) {
  const catalogoDiv = document.getElementById("catalogo");

  const filtrados = filtrarProductos(productos, { categoria, nombre: nombreProducto });

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

function renderizarCategorias() {
  const filtrosDiv = document.getElementById("filtros");
  let html = "";

  for (const categoria of categorias) {
    const activa = categoriaActual === categoria.key || (categoria.key === "todos" && categoriaActual === null);
    html += `
  <div class="card border-0 text-center categoria-mini shadow-sm mx-2 ${activa ? "categoria-activa" : ""}"
       data-key="${categoria.key}" role="button">
    <div class="card-body d-flex justify-content-center align-items-center flex-column h-100 p-2">
      <i class="${categoria.icon} categoria-icon fs-4"></i>
      <div class="small mt-1 categoria-text lh-1 text-wrap">
        ${categoria.name}
      </div>
    </div>
  </div>
    `;
  }

  filtrosDiv.innerHTML = html;
}

document.addEventListener("click", (e) => {
  const card = e.target.closest(".categoria-mini");
  if (card) {
    const key = card.dataset.key;
    categoriaActual = key === "todos" ? null : key;
    paginaActual = 1;
    renderizar(categoriaActual);
    renderizarCategorias();
    return;
  }

  const link = e.target.closest(".page-link");
  if (!link) return;

  e.preventDefault();

  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  const nuevaPagina = cambiarPagina(link, {
    paginaActual,
    totalPaginas,
  });

  paginaActual = nuevaPagina;

  renderizar(categoriaActual);
});

renderizar();
renderizarCategorias();

document.getElementById("footer").innerHTML = footer("../../");
