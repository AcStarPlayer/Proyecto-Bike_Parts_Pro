import { isAuthenticated } from "../../autorizaciones/autorizaciones.js";

const CLAVE_CARRITO_COMPRAS = "catalogo-carrito-compras";
let carritoCompras = obtenerCarritoComprasGuardado();

function obtenerCarritoComprasGuardado() {
  try {
    const carritoGuardado = localStorage.getItem(CLAVE_CARRITO_COMPRAS);
    if (!carritoGuardado) return [];
    const carrito = JSON.parse(carritoGuardado);
    if (carrito.length > 0 && carrito[0].id == null) return [];
    return carrito;
  } catch (error) {
    return [];
  }
}

function guardarCarritoCompras() {
  localStorage.setItem(CLAVE_CARRITO_COMPRAS, JSON.stringify(carritoCompras));
}

function cerrarPanelCarritoSiVacio() {
  if (carritoCompras.length > 0) return;
  const panel = document.getElementById("panel-lateral-carrito-compras");
  if (!panel) return;
  const offcanvas = window.bootstrap?.Offcanvas?.getInstance(panel);
  if (offcanvas) offcanvas.hide();
}

function actualizarEstadoCarrito() {
  guardarCarritoCompras();
  renderizarCarritoCompras();
  if (carritoCompras.length === 0) cerrarPanelCarritoSiVacio();
}

function formatearMonedaPesosColombianos(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

function obtenerCantidadTotalArticulosCarrito() {
  return carritoCompras.reduce(
    (acumulado, item) => acumulado + item.cantidad,
    0,
  );
}

function obtenerValorTotalCarrito() {
  return carritoCompras.reduce(
    (acumulado, item) => acumulado + item.precio * item.cantidad,
    0,
  );
}

function buscarProductoEnCarritoById(id) {
  return carritoCompras.find((item) => String(item.id) === String(id));
}

export function agregarProductoAlCarritoCompras(producto) {
  const cantidad = Number(producto.cantidad) || 1;
  const productoExistente = buscarProductoEnCarritoById(producto.id);

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    carritoCompras.push({
      id: producto.id,
      sku: producto.sku,
      nombre: producto.nombre || producto.titulo || "Producto",
      marca: producto.marca || "",
      precio: Number(producto.precio) || 0,
      cantidad,
    });
  }

  actualizarEstadoCarrito();
}

function eliminarProductoDelCarritoCompras(id) {
  carritoCompras = carritoCompras.filter(
    (item) => String(item.id) !== String(id),
  );

  actualizarEstadoCarrito();
}

function actualizarGloboCantidadCarrito() {
  const globoCantidadCarrito = document.getElementById("globo-cantidad-carrito");
  if (!globoCantidadCarrito) return;

  const cantidadTotal = obtenerCantidadTotalArticulosCarrito();
  globoCantidadCarrito.textContent = cantidadTotal;

  if (cantidadTotal > 0) {
    globoCantidadCarrito.classList.remove("oculta");
  } else {
    globoCantidadCarrito.classList.add("oculta");
  }
}

function cambiarCantidadProducto(id, operacion) {
  const producto = buscarProductoEnCarritoById(id);
  if (!producto) return;

  if (operacion === "sumar") {
    producto.cantidad += 1;
  } else if (operacion === "restar") {
    producto.cantidad -= 1;
    if (producto.cantidad < 1) {
      eliminarProductoDelCarritoCompras(id);
      return;
    }
  }

  actualizarEstadoCarrito();
}

function construirHtmlItemsCarrito() {
  if (!carritoCompras.length) return "";

  return carritoCompras
    .map((item) => {
      const valorTotalLinea = item.precio * item.cantidad;

      return `
      <li class="item-producto-carrito">
        <div class="encabezado-item-carrito">
          <p class="nombre-item-carrito">${item.nombre}</p>

          <div class="controles-cantidad">
            <button class="btn-cantidad-menos" data-id-disminuir="${item.id}">-</button>
            <span class="indicador-cantidad-item-carrito">${item.cantidad}</span>
            <button class="btn-cantidad-mas" data-id-aumentar="${item.id}">+</button>
          </div>
        </div>

        <div class="detalles-item-carrito">
          <span>Marca: ${item.marca || "Sin marca"}</span>
          <span>SKU: ${item.sku}</span>
          <span>Unitario: ${formatearMonedaPesosColombianos(item.precio)}</span>
        </div>

        <div class="informacion-total-item-carrito">
          <p class="total-linea-item-carrito">
            ${formatearMonedaPesosColombianos(valorTotalLinea)}
          </p>
          <div class="acciones-item-carrito">
            <button type="button" class="boton-eliminar-item-carrito" data-id-eliminar="${item.id}">
              Eliminar
            </button>
          </div>
        </div>
      </li>
    `;
    })
    .join("");
}

function construirHtmlBotonFinalizarCompra() {
  if (!carritoCompras.length) return "";

  return `
    <div class="acciones-finalizar-carrito">
      <button
        type="button"
        id="boton-finalizar-compra-carrito"
        class="boton-finalizar-compra-carrito"
      >
        Finalizar compra
      </button>
    </div>
  `;
}

function renderizarListaCarritoCompras() {
  const listaProductosCarrito = document.getElementById("lista-productos-carrito");
  const mensajeCarritoVacio = document.getElementById("mensaje-carrito-vacio");
  const botonVaciarCarrito = document.getElementById("boton-vaciar-carrito");
  const contenedorAccionFinalizar = document.getElementById("contenedor-finalizar-compra-carrito");

  if (!listaProductosCarrito || !mensajeCarritoVacio || !botonVaciarCarrito) {
    return;
  }

  listaProductosCarrito.innerHTML = construirHtmlItemsCarrito();

  if (contenedorAccionFinalizar) {
    contenedorAccionFinalizar.innerHTML = construirHtmlBotonFinalizarCompra();
  }

  const carritoEstaVacio = carritoCompras.length === 0;
  mensajeCarritoVacio.style.display = carritoEstaVacio ? "block" : "none";
  botonVaciarCarrito.style.display = carritoEstaVacio ? "none" : "inline-flex";

  listaProductosCarrito.querySelectorAll("[data-id-aumentar]").forEach((btn) => {
    btn.addEventListener("click", () => {
      cambiarCantidadProducto(btn.getAttribute("data-id-aumentar"), "sumar");
    });
  });

  listaProductosCarrito.querySelectorAll("[data-id-disminuir]").forEach((btn) => {
    btn.addEventListener("click", () => {
      cambiarCantidadProducto(btn.getAttribute("data-id-disminuir"), "restar");
    });
  });

  listaProductosCarrito
    .querySelectorAll("[data-id-eliminar]")
    .forEach((botonEliminar) => {
      botonEliminar.addEventListener("click", () => {
        eliminarProductoDelCarritoCompras(botonEliminar.getAttribute("data-id-eliminar"));
      });
    });
}

function renderizarTotalCarritoCompras() {
  const textoTotalCarrito = document.getElementById("texto-total-carrito");
  if (!textoTotalCarrito) return;

  textoTotalCarrito.textContent = formatearMonedaPesosColombianos(
    obtenerValorTotalCarrito(),
  );
}

function actualizarBotonFlotanteCarrito() {
  const boton = document.getElementById("boton-flotante-carrito");
  if (!boton) return;

  const cantidad = obtenerCantidadTotalArticulosCarrito();

  if (cantidad > 0) {
    boton.style.display = "flex";
  } else {
    boton.style.display = "none";
  }
}

function renderizarBotonFlotanteCarrito() {
  if (document.getElementById("boton-flotante-carrito")) return;

  const boton = document.createElement("button");

  boton.id = "boton-flotante-carrito";
  boton.className = "boton-flotante-carrito";
  boton.type = "button";

  boton.setAttribute("data-bs-toggle", "offcanvas");
  boton.setAttribute("data-bs-target", "#panel-lateral-carrito-compras");
  boton.setAttribute("aria-controls", "panel-lateral-carrito-compras");
  boton.setAttribute("aria-label", "Abrir carrito de compras");

  boton.innerHTML = `
    <span class="icono-carrito-flotante justify-content-center align-content-center"><i class="bi bi-cart2 cart-grande"></i></span>
    <span id="globo-cantidad-carrito" class="globo-cantidad-carrito oculta">0</span>
  `;

  document.body.appendChild(boton);
}

export function finalizarCompraCarrito() {
  if (carritoCompras.length === 0) return;

  const enVistas = window.location.pathname.includes("/vistas/");

  if (!isAuthenticated()) {
    const rutaLogin = enVistas
      ? "../login/login.html"
      : "vistas/login/login.html";
    window.location.href = rutaLogin;
    return;
  }

  const ruta = enVistas
    ? "../finalizarCompra/finalizarCompra.html"
    : "vistas/finalizarCompra/finalizarCompra.html";

  window.location.href = ruta;
}

export function vaciarCarritoCompras() {
  carritoCompras = [];
  actualizarEstadoCarrito();
}

export function renderizarCarritoCompras() {
  renderizarBotonFlotanteCarrito();
  actualizarGloboCantidadCarrito();
  renderizarListaCarritoCompras();
  renderizarTotalCarritoCompras();

  const botonFinalizarCompra = document.getElementById("boton-finalizar-compra-carrito");
  if (botonFinalizarCompra) {
    botonFinalizarCompra.addEventListener("click", finalizarCompraCarrito);
  }

  actualizarBotonFlotanteCarrito();
}
