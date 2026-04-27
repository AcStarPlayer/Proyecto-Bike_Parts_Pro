import { productosPredeterminados } from "../../apis/productos.js";
import {
  agregarProductoAlCarritoCompras,
  renderizarCarritoCompras,
  vaciarCarritoCompras,
} from "./carrito.js";

function inyectarPanelCarrito() {
  if (document.getElementById("panel-lateral-carrito-compras")) return;

  const panel = document.createElement("div");
  panel.className = "offcanvas offcanvas-end panel-lateral-carrito-compras";
  panel.tabIndex = -1;
  panel.id = "panel-lateral-carrito-compras";
  panel.setAttribute("aria-labelledby", "titulo-panel-lateral-carrito-compras");

  panel.innerHTML = `
    <div class="offcanvas-header encabezado-panel-carrito-compras">
      <div>
        <p class="subtitulo-panel-carrito">Carrito activo</p>
        <h2 id="titulo-panel-lateral-carrito-compras" class="titulo-panel-carrito">
          Tu carrito
        </h2>
      </div>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Cerrar carrito"
      ></button>
    </div>

    <div class="offcanvas-body cuerpo-panel-carrito-compras">
      <div class="barra-superior-carrito">
        <p id="mensaje-carrito-vacio" class="mensaje-carrito-vacio">
          Tu carrito está vacío.
        </p>
        <button id="boton-vaciar-carrito" class="boton-vaciar-carrito" type="button">
          Vaciar carrito
        </button>
      </div>

      <ul id="lista-productos-carrito" class="lista-productos-carrito"></ul>

      <div class="pie-carrito-compras">
        <p class="etiqueta-total-carrito">Total</p>
        <p id="texto-total-carrito" class="texto-total-carrito">$0</p>
      </div>
    </div>
  `;

  document.body.appendChild(panel);
  document.getElementById("boton-vaciar-carrito").addEventListener("click", vaciarCarritoCompras);
}

export function inicializarBotonesCarrito() {
  inyectarPanelCarrito();
  renderizarCarritoCompras();

  const productosGuardados = JSON.parse(localStorage.getItem("productos") || "null");
  const listaProductosCatalogo =
    Array.isArray(productosGuardados) && productosGuardados.length
      ? productosGuardados
      : productosPredeterminados;

  document
    .querySelectorAll(".boton-agregar-carrito-producto")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const skuProducto = btn.getAttribute("data-sku");

        const producto = listaProductosCatalogo.find(
          (item) => String(item.sku) === String(skuProducto)
        );

        if (!producto) return;

        agregarProductoAlCarritoCompras({
          nombre: producto.nombre || producto.titulo || "Producto",
          sku: producto.sku,
          precio: Number(producto.precio) || 0,
          marca: producto.marca || ""
        });

        btn.classList.add("agregado");
        btn.textContent = "Agregado";

        setTimeout(() => {
          btn.classList.remove("agregado");
          btn.textContent = "Agregar al carrito";
        }, 900);
      });
    });
}
