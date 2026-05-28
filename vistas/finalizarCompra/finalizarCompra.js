import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/pieDePagina/footer.js";

navBar("Finalizar compra", "../../");
document.getElementById("footer").innerHTML = footer("../../");

const CLAVE_CARRITO = "catalogo-carrito-compras";
const IVA = 0.19;

function formatCOP(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch {
    return [];
  }
}

function renderResumen() {
  const carrito = obtenerCarrito();
  const subtotal = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const iva = subtotal * IVA;
  const total = subtotal + iva;

  document.getElementById("resumen-items").innerHTML = carrito.length
    ? carrito.map(i => `
        <div class="resumen-linea resumen-item">
          <span>${i.nombre} <span class="resumen-cantidad">×${i.cantidad}</span></span>
          <span>${formatCOP(i.precio * i.cantidad)}</span>
        </div>`).join("")
    : `<p class="resumen-vacio">No hay productos en el carrito.</p>`;

  document.getElementById("resumen-subtotal").textContent = formatCOP(subtotal);
  document.getElementById("resumen-iva").textContent = formatCOP(iva);
  document.getElementById("resumen-total").textContent = formatCOP(total);
}

function manejarOpcionesPago() {
  document.querySelectorAll('input[name="pago"]').forEach(radio => {
    radio.addEventListener("change", () => {
      document.querySelectorAll(".opcion-pago").forEach(o => o.classList.remove("activa"));
      radio.closest(".opcion-pago").classList.add("activa");
    });
  });
}

function mostrarExito() {
  document.getElementById("checkout-main").innerHTML = `
    <div class="container exito-compra">
      <i class="bi bi-check-circle-fill exito-icono"></i>
      <h2>¡Pedido confirmado!</h2>
      <p>Gracias por tu compra. Pronto recibirás los detalles de tu envío.</p>
      <a href="../../index.html" class="btn-finalizar-checkout">Volver al inicio</a>
    </div>
  `;
}

document.getElementById("form-checkout").addEventListener("submit", e => {
  e.preventDefault();
  localStorage.removeItem(CLAVE_CARRITO);
  mostrarExito();
});

renderResumen();
manejarOpcionesPago();
