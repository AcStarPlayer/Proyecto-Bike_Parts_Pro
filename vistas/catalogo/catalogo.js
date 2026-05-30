import tarjetasConImagen from "../../componentes/tarjetas/tarjetasConImagen/tarjetasConImagen.js";
import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/pieDePagina/footer.js";
import { botones } from "../../componentes/botones/botones.js";
import {
  paginacion,
  cambiarPagina,
} from "../../componentes/paginacion/paginacion.js";
import { productosPredeterminados, filtrarProductos } from "../../apis/productos.js";
import { agregarProductoAlCarritoCompras } from "../carrito/carrito.js";
import { inicializarBotonesCarrito } from "../carrito/carrito-events.js";
import { categorias } from "../../apis/categorias.js";
import { mostrarFichaTecnica } from "../producto/app.js";

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
const params = new URLSearchParams(window.location.search);

categoriaActual = params.get("cat") || null;
const productosPorPagina = 10;

function catalogo(categoria = null, nombreProducto = null) {
  const catalogoDiv = document.getElementById("catalogo");

  const filtrados = filtrarProductos(productos, { categoria, nombre: nombreProducto });

  const inicio = (paginaActual - 1) * productosPorPagina;
  const paginaProductos = filtrados.slice(inicio, inicio + productosPorPagina);

  let html = "";

  paginaProductos.forEach((producto) => {
    let acciones = `
    ${botones(
      `<i class="bi bi-search"></i> Ficha Técnica`,
      "ficha-tecnica",
      "button",
      `data-id="${producto.id}"`
    )}
    ${botones(
      `<i class="bi bi-cart-plus" style="font-size: 18px;"></i> Agregar al carrito`,
      "primary boton-agregar-carrito-producto",
      "button",
      `data-sku="${producto.sku}"`,
      `data-id="${producto.id}"`,
    )}`;

    html += `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      ${tarjetasConImagen(
        producto.nombre,
        producto.modeloProducto.descripcion,
        `${producto.precio.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        producto.imagenes[0]["url"],
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
  const btnFicha = e.target.closest(".btn-ficha-tecnica");
  if (btnFicha) {
    const producto_id = btnFicha.getAttribute("data-id");
    document.getElementById("modalFichaTecnica")?.remove();
    document.body.insertAdjacentHTML("beforeend", mostrarFichaTecnica(producto_id));
    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalFichaTecnica")).show();
    return;
  }

  const btnCantidad = e.target.closest(".btn-modal-cantidad");
  if (btnCantidad) {
    const display = btnCantidad.closest(".input-group").querySelector(".cantidad-modal-valor");
    const stock = parseInt(btnCantidad.dataset.stock ?? btnCantidad.closest(".input-group").querySelector("[data-stock]").dataset.stock);
    let cantidad = parseInt(display.textContent);
    if (btnCantidad.dataset.accion === "sumar") cantidad = Math.min(cantidad + 1, stock);
    else cantidad = Math.max(cantidad - 1, 1);
    display.textContent = cantidad;
    return;
  }

  const btnAgregarModal = e.target.closest(".boton-agregar-carrito-modal");
  if (btnAgregarModal) {
    const modal = document.getElementById("modalFichaTecnica");
    const cantidad = parseInt(modal.querySelector(".cantidad-modal-valor").textContent);
    const id = parseInt(btnAgregarModal.dataset.id);
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    agregarProductoAlCarritoCompras({
      nombre: producto.nombre,
      sku: producto.modeloProducto?.sku,
      precio: producto.precio,
      cantidad,
    });
    bootstrap.Modal.getOrCreateInstance(modal).hide();
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

renderizar(categoriaActual);
renderizarCategorias();

document.getElementById("footer").innerHTML = footer("../../");
