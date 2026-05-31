import tarjetasConImagen from "../../componentes/tarjetas/tarjetasConImagen/tarjetasConImagen.js";
import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/pieDePagina/footer.js";
import { botones } from "../../componentes/botones/botones.js";
import { paginacion, cambiarPagina } from "../../componentes/paginacion/paginacion.js";
import { filtrarProductos } from "../../apis/productos.js";
import { getProductos, getProductosFiltrados } from "../../apis/productosApi.js";
import { agregarProductoAlCarritoCompras } from "../carrito/carrito.js";
import { inicializarBotonesCarrito } from "../carrito/carrito-events.js";
import { categorias } from "../../apis/categorias.js";
import { mostrarFichaTecnicaConProducto } from "../producto/app.js";
import cargador, { mostrarCargador, ocultarCargador } from "../../componentes/cargador/cargador.js";

navBar("Sube de nivel", "../../");

let navbarCatalogo = document.getElementById("navbar-catalogo");
navbarCatalogo.innerHTML = `
  <div class="container-fluid py-2 bg-white" style="border-bottom: 1px solid var(--color-border);">
    <div class="d-flex align-items-center gap-5">
      <h3 class="m-0 fw-bold ms-3">Catálogo</h3>
      <div class="input-group" style="max-width: 620px;">
        <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
        <input id="busqueda" type="text" class="form-control" placeholder="Busca tu repuesto..." autocomplete="off">
      </div>
    </div>
  </div>
`;

mostrarCargador();
const productos = await getProductos();
ocultarCargador();

const productosIndexados = {};
productos.forEach(p => { productosIndexados[p.id] = p; });

let paginaActual = 1;
let categoriaActual = null;
let palabraActual = "";
const params = new URLSearchParams(window.location.search);
categoriaActual = params.get("cat") || null;
const productosPorPagina = 10;
let listaActual = filtrarProductos(productos, { categoria: categoriaActual, nombre: palabraActual });

let timerBusqueda = null;
document.getElementById("busqueda").addEventListener("input", (e) => {
  clearTimeout(timerBusqueda);
  timerBusqueda = setTimeout(() => {
    palabraActual = e.target.value.trim();
    buscarYRenderizar();
  }, 400);
});

function renderizar() {
  const inicio = (paginaActual - 1) * productosPorPagina;
  const pagina = listaActual.slice(inicio, inicio + productosPorPagina);

  document.getElementById("catalogo").innerHTML = pagina.map(producto => {
    const imagenUrl = producto.imagenes?.[0]?.url || "";
    const descripcion = producto.modeloProducto?.descripcion || producto.descripcion || "";
    const acciones = `
      ${botones(`<i class="bi bi-search"></i> Ficha Técnica`, "ficha-tecnica", "button", `data-id="${producto.id}"`)}
      ${botones(`<i class="bi bi-cart-plus" style="font-size: 18px;"></i> Agregar al carrito`, "primary boton-agregar-carrito-producto", "button", `data-sku="${producto.sku}"`, `data-id="${producto.id}"`)}
    `;
    return `
      <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
        ${tarjetasConImagen(
          producto.nombre,
          descripcion,
          producto.precio.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          imagenUrl,
          acciones,
          "xxs",
          "start",
          producto.categoria,
        )}
      </div>
    `;
  }).join("");

  document.querySelector("#paginacion").innerHTML = paginacion(
    Math.ceil(listaActual.length / productosPorPagina),
    paginaActual
  );
  inicializarBotonesCarrito();
}

async function buscarYRenderizar() {
  paginaActual = 1;
  document.querySelector("#paginacion").innerHTML = "";
  document.getElementById("catalogo").innerHTML = `
    <div class="w-100 d-flex flex-column align-items-center justify-content-center py-5">
      ${cargador()}
      <p class="cargador-mensaje mt-2">Buscando repuestos...</p>
    </div>
  `;
  const resultado = await getProductosFiltrados({ categoria: categoriaActual, palabra: palabraActual });
  listaActual = resultado ?? filtrarProductos(productos, { categoria: categoriaActual, nombre: palabraActual });
  renderizar();
  renderizarCategorias();
}

function renderizarCategorias() {
  const filtrosDiv = document.getElementById("filtros");
  filtrosDiv.innerHTML = categorias.map(categoria => {
    const activa = categoriaActual === categoria.key || (categoria.key === "todos" && categoriaActual === null);
    return `
      <button type="button" class="list-group-item list-group-item-action d-flex align-items-center gap-2 ${activa ? "active" : ""}" data-key="${categoria.key}">
        <i class="${categoria.icon}"></i>
        <span>${categoria.name.toUpperCase()}</span>
      </button>
    `;
  }).join("");
}

document.addEventListener("click", (e) => {
  const card = e.target.closest("#filtros [data-key]");
  if (card) {
    categoriaActual = card.dataset.key === "todos" ? null : card.dataset.key;
    buscarYRenderizar();
    return;
  }

  const btnFicha = e.target.closest(".btn-ficha-tecnica");
  if (btnFicha) {
    const producto_id = parseInt(btnFicha.getAttribute("data-id"));
    const producto = productosIndexados[producto_id];
    if (!producto) return;
    document.getElementById("modalFichaTecnica")?.remove();
    document.body.insertAdjacentHTML("beforeend", mostrarFichaTecnicaConProducto(producto));
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
    const producto = productosIndexados[id];
    if (!producto) return;
    agregarProductoAlCarritoCompras({ nombre: producto.nombre, sku: producto.sku, precio: producto.precio, cantidad });
    bootstrap.Modal.getOrCreateInstance(modal).hide();
    return;
  }

  const link = e.target.closest(".page-link");
  if (!link) return;
  e.preventDefault();
  const totalPaginas = Math.ceil(listaActual.length / productosPorPagina);
  const nuevaPagina = cambiarPagina(link, { paginaActual, totalPaginas });
  paginaActual = nuevaPagina;
  renderizar();
});

renderizar();
renderizarCategorias();

document.getElementById("footer").innerHTML = footer("../../");
