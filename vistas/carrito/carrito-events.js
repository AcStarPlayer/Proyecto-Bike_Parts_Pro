import { productosPredeterminados } from "../../apis/productos.js";
import {
  agregarProductoAlCarritoCompras,
  renderizarCarritoCompras,
  vaciarCarritoCompras,
  finalizarCompraCarrito,
} from "./carrito.js";

let timerToastCarrito = null;

function inyectarPanelCarrito() {
  if (document.getElementById("panel-lateral-carrito-compras")) return;

  const panel = document.createElement("div");
  panel.className = "offcanvas offcanvas-end panel-lateral-carrito-compras";
  panel.tabIndex = -1;
  panel.id = "panel-lateral-carrito-compras";
  panel.setAttribute("aria-labelledby", "titulo-panel-lateral-carrito-compras");
  panel.setAttribute("data-bs-backdrop", "true");
  panel.setAttribute("data-bs-scroll", "false");
  panel.innerHTML = `
    <div class="offcanvas-header encabezado-panel-carrito-compras">
      <div>
        <p class="subtitulo-panel-carrito">Carrito activo</p>
        <h2 id="titulo-panel-lateral-carrito-compras" class="titulo-panel-carrito">Tu carrito</h2>
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar carrito"></button>
    </div>

    <div class="offcanvas-body cuerpo-panel-carrito-compras">
      <div class="barra-superior-carrito">
        <p id="mensaje-carrito-vacio" class="mensaje-carrito-vacio">Tu carrito está vacío.</p>
        <button id="boton-vaciar-carrito" class="boton-vaciar-carrito" type="button">Vaciar carrito</button>
      </div>

      <ul id="lista-productos-carrito" class="lista-productos-carrito"></ul>

      <div class="pie-carrito-compras">
        <p class="etiqueta-total-carrito">Total</p>
        <p id="texto-total-carrito" class="texto-total-carrito">$0</p>
      </div>

      <div id="contenedor-finalizar-compra-carrito"></div>
    </div>
  `;

  document.body.appendChild(panel);

  panel.addEventListener("show.bs.offcanvas", () => {
    const botonFlotante = document.getElementById("boton-flotante-carrito");
    if (botonFlotante) {
      botonFlotante.style.opacity = "0";
      botonFlotante.style.pointerEvents = "none";
    }
  });

  panel.addEventListener("hide.bs.offcanvas", () => {
    const botonFlotante = document.getElementById("boton-flotante-carrito");
    if (botonFlotante) {
      botonFlotante.style.opacity = "1";
      botonFlotante.style.pointerEvents = "auto";
    }
  });

  document.getElementById("boton-vaciar-carrito")?.addEventListener("click", vaciarCarritoCompras);

  document.addEventListener("click", (event) => {
    const btnFinalizar = event.target.closest("#boton-finalizar-compra-carrito");
    if (btnFinalizar) {
      finalizarCompraCarrito();
    }
  });
}

function getCatalogoProductos() {
  const productosGuardados = JSON.parse(localStorage.getItem("productos") || "null");
  return Array.isArray(productosGuardados) && productosGuardados.length
    ? productosGuardados
    : productosPredeterminados;
}

function mostrarToastCarrito(mensaje = "Producto agregado al carrito") {
  let toast = document.getElementById("toast-carrito-agregado");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-carrito-agregado";
    toast.className = "toast-carrito-agregado";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = mensaje;
  toast.classList.add("visible");

  clearTimeout(timerToastCarrito);
  timerToastCarrito = setTimeout(() => {
    toast.classList.remove("visible");
  }, 1800);
}

function setAgregarButtonIdle(btn) {
  if (!btn) return;
  btn.classList.remove("agregado");
  btn.removeAttribute("aria-disabled");
  btn.disabled = false;
  btn.textContent = btn.dataset.labelOriginal || "Agregar al carrito";
  delete btn.dataset.uiState;
}

function setAgregarButtonAdded(btn) {
  if (!btn) return;
  if (!btn.dataset.labelOriginal) {
    btn.dataset.labelOriginal = btn.textContent || "Agregar al carrito";
  }

  btn.dataset.uiState = "added";
  btn.classList.add("agregado");
  btn.textContent = "Agregado";
  btn.disabled = true;
  btn.setAttribute("aria-disabled", "true");
}

function manejarClickAgregar(btn) {
  if (btn.dataset.uiState === "added") return;

  const skuProducto = btn.getAttribute("data-sku");
  const catalogo = getCatalogoProductos();
  const producto = catalogo.find((item) => String(item.sku) === String(skuProducto));

  if (!producto) return;

  agregarProductoAlCarritoCompras({
    nombre: producto.nombre || producto.titulo || "Producto",
    sku: producto.sku,
    precio: Number(producto.precio || 0),
    marca: producto.marca || "",
  });

  setAgregarButtonAdded(btn);
  mostrarToastCarrito("Producto agregado al carrito");

  setTimeout(() => {
    if (!document.body.contains(btn)) return;
    setAgregarButtonIdle(btn);
  }, 1800);
}

export function inicializarBotonesCarrito() {
  inyectarPanelCarrito();
  renderizarCarritoCompras();

  document.addEventListener("click", (event) => {
    const btnAgregar = event.target.closest(".boton-agregar-carrito-producto");
    if (btnAgregar) {
      manejarClickAgregar(btnAgregar);
      return;
    }

    const btnVaciar = event.target.closest("#boton-vaciar-carrito");
    if (btnVaciar) {
      vaciarCarritoCompras();
    }
  });
}