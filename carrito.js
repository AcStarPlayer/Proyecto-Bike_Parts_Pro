  /* ------- LOGICA CARRITO DE COMPRAS-----*/


  const CLAVE_CARRITO_COMPRAS = "catalogo-carrito-compras";
let carritoCompras = obtenerCarritoComprasGuardado();

function obtenerCarritoComprasGuardado() {
  try {
    const carritoGuardado = localStorage.getItem(CLAVE_CARRITO_COMPRAS);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  } catch (error) {
    return [];
  }
}

function guardarCarritoCompras() {
  localStorage.setItem(CLAVE_CARRITO_COMPRAS, JSON.stringify(carritoCompras));
}

function formatearMonedaPesosColombianos(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(valor);
}

function obtenerCantidadTotalArticulosCarrito() {
  return carritoCompras.reduce((acumulado, item) => acumulado + item.cantidad, 0);
}

function obtenerValorTotalCarrito() {
  return carritoCompras.reduce(
    (acumulado, item) => acumulado + (item.precio * item.cantidad),
    0
  );
}

function buscarProductoEnCarritoPorSku(sku) {
  return carritoCompras.find((item) => String(item.sku) === String(sku));
}

function agregarProductoAlCarritoCompras(producto) {
  const productoExistente = buscarProductoEnCarritoPorSku(producto.sku);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carritoCompras.push({
      sku: producto.sku,
      nombre: producto.nombre,
      marca: producto.marca,
      precio: Number(producto.precio) || 0,
      cantidad: 1
    });
  }

  guardarCarritoCompras();
  renderizarCarritoCompras();
}

function eliminarProductoDelCarritoCompras(sku) {
  carritoCompras = carritoCompras.filter(
    (item) => String(item.sku) !== String(sku)
  );

  guardarCarritoCompras();
  renderizarCarritoCompras();
}

function vaciarCarritoCompras() {
  carritoCompras = [];
  guardarCarritoCompras();
  renderizarCarritoCompras();
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

function construirHtmlItemsCarrito() {
  if (!carritoCompras.length) {
    return "";
  }

  return carritoCompras.map((item) => {
    const valorTotalLinea = item.precio * item.cantidad;

    return `
      <li class="item-producto-carrito">
        <div class="informacion-item-carrito">
          <div class="encabezado-item-carrito">
            <p class="nombre-item-carrito">${item.nombre}</p>
            <span class="indicador-cantidad-item-carrito">x${item.cantidad}</span>
          </div>

          <div class="detalles-item-carrito">
            <span>Marca: ${item.marca || "Sin marca"}</span>
            <span>SKU: ${item.sku}</span>
            <span>Unitario: ${formatearMonedaPesosColombianos(item.precio)}</span>
          </div>

          <p class="total-linea-item-carrito">
            ${formatearMonedaPesosColombianos(valorTotalLinea)}
          </p>
        </div>

        <div class="acciones-item-carrito">
          <button
            type="button"
            class="boton-eliminar-item-carrito"
            data-sku-eliminar="${item.sku}"
          >
            Eliminar
          </button>
        </div>
      </li>
    `;
  }).join("");
}

function renderizarListaCarritoCompras() {
  const listaProductosCarrito = document.getElementById("lista-productos-carrito");
  const mensajeCarritoVacio = document.getElementById("mensaje-carrito-vacio");
  const botonVaciarCarrito = document.getElementById("boton-vaciar-carrito");

  if (!listaProductosCarrito || !mensajeCarritoVacio || !botonVaciarCarrito) {
    return;
  }

  listaProductosCarrito.innerHTML = construirHtmlItemsCarrito();

  const carritoEstaVacio = carritoCompras.length === 0;
  mensajeCarritoVacio.style.display = carritoEstaVacio ? "block" : "none";
  botonVaciarCarrito.style.display = carritoEstaVacio ? "none" : "inline-flex";

  listaProductosCarrito
    .querySelectorAll("[data-sku-eliminar]")
    .forEach((botonEliminar) => {
      botonEliminar.addEventListener("click", () => {
        const sku = botonEliminar.getAttribute("data-sku-eliminar");
        eliminarProductoDelCarritoCompras(sku);
      });
    });
}

function renderizarTotalCarritoCompras() {
  const textoTotalCarrito = document.getElementById("texto-total-carrito");
  if (!textoTotalCarrito) return;

  textoTotalCarrito.textContent = formatearMonedaPesosColombianos(
    obtenerValorTotalCarrito()
  );
}

function renderizarCarritoCompras() {
  actualizarGloboCantidadCarrito();
  renderizarListaCarritoCompras();
  renderizarTotalCarritoCompras();
}

function activarBotonesAgregarAlCarrito(listaProductosCatalogo) {
  document
    .querySelectorAll(".boton-agregar-carrito-producto")
    .forEach((botonAgregar) => {
      botonAgregar.addEventListener("click", () => {
        const skuProducto = botonAgregar.getAttribute("data-sku");
        const productoSeleccionado = listaProductosCatalogo.find(
          (producto) => String(producto.sku) === String(skuProducto)
        );

        if (!productoSeleccionado) return;

        agregarProductoAlCarritoCompras(productoSeleccionado);

        botonAgregar.classList.add("agregado");
        botonAgregar.textContent = "Agregado";

        setTimeout(() => {
          botonAgregar.classList.remove("agregado");
          botonAgregar.textContent = "Agregar al carrito";
        }, 900);
      });
    });
}

function inicializarCarritoCompras(listaProductosCatalogo) {
  const botonVaciarCarrito = document.getElementById("boton-vaciar-carrito");

  if (botonVaciarCarrito) {
    botonVaciarCarrito.addEventListener("click", vaciarCarritoCompras);
  }

  activarBotonesAgregarAlCarrito(listaProductosCatalogo);
  renderizarCarritoCompras();
}


 registrarEventoAgregarCarrito(tarjeta) {
    const botonAgregar = tarjeta.querySelector('.boton-agregar-carrito-producto');

    botonAgregar?.addEventListener('click', () => {
      const textoOriginal = 'Agregar al carrito';
      botonAgregar.textContent = 'Agregado';
      botonAgregar.classList.add('agregado');

      window.setTimeout(() => {
        botonAgregar.textContent = textoOriginal;
        botonAgregar.classList.remove('agregado');
      }, 1400);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const demoTarjetas = new TarjetaProductoTecnicaDemo();
  demoTarjetas.iniciar();
});

document.getElementById("footer").innerHTML = footer("../../");

const productos = JSON.parse(localStorage.getItem("productos") || "[]");
productos.concat(PRODUCTOS_PREDETERMINADOS);
