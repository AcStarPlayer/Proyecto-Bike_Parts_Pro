import select from "../../componentes/select/select.js";
import { getDepartamentos, getCiudades } from "../../apis/ubicacionesApi.js";
import { getClienteIdPorEmail } from "../../apis/clientesApi.js";
import { postCheckout, postEnvio } from "../../apis/ordenesApi.js";
import { getSession } from "../../autorizaciones/autorizaciones.js";
import { vaciarCarritoCompras } from "../carrito/carrito.js";

const CLAVE_CARRITO = "catalogo-carrito-compras";
const IVA = 0.19;

let clienteId = null;
let todasLasCiudades = [];
let todosDepartamentos = [];

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
    ? carrito
        .map(
          (i) => `
        <div class="resumen-linea resumen-item">
          <span>${i.nombre} <span class="resumen-cantidad">×${i.cantidad}</span></span>
          <span>${formatCOP(i.precio * i.cantidad)}</span>
        </div>`,
        )
        .join("")
    : `<p class="resumen-vacio">No hay productos en el carrito.</p>`;

  document.getElementById("resumen-subtotal").textContent = formatCOP(subtotal);
  document.getElementById("resumen-iva").textContent = formatCOP(iva);
  document.getElementById("resumen-total").textContent = formatCOP(total);
}

function manejarOpcionesPago() {
  document.querySelectorAll('input[name="pago"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      document
        .querySelectorAll(".opcion-pago")
        .forEach((o) => o.classList.remove("activa"));
      radio.closest(".opcion-pago").classList.add("activa");
    });
  });
}

function mostrarExito({ envioRegistrado = true } = {}) {
  const notaEnvio = envioRegistrado
    ? ""
    : `<p style="font-size:0.85rem;color:var(--color-gray);max-width:380px;text-align:center;">
        Los datos de envío serán confirmados por nuestro equipo.
       </p>`;

  document.getElementById("checkout-main").innerHTML = `
    <div class="container exito-compra">
      <i class="bi bi-check-circle-fill exito-icono"></i>
      <h2>¡Pedido confirmado!</h2>
      <p>Gracias por tu compra. Pronto recibirás los detalles de tu envío.</p>
      ${notaEnvio}
      <a href="../catalogo/catalogo.html" class="btn-finalizar-checkout">Volver al catálogo</a>
    </div>
  `;
}

function mostrarAlertaCheckout(mensaje, tipo = "danger") {
  let alerta = document.getElementById("alerta-checkout");
  if (!alerta) {
    alerta = document.createElement("div");
    alerta.id = "alerta-checkout";
    alerta.style.cssText =
      "margin: 1rem 0; padding: 0.85rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.92rem;";
    document.getElementById("form-checkout").prepend(alerta);
  }
  alerta.style.background = tipo === "danger" ? "#fff1f2" : "#f0fdf4";
  alerta.style.color = tipo === "danger" ? "#b91c1c" : "#15803d";
  alerta.style.border =
    tipo === "danger" ? "1px solid #fecaca" : "1px solid #bbf7d0";
  alerta.textContent = mensaje;
  alerta.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function limpiarAlertaCheckout() {
  document.getElementById("alerta-checkout")?.remove();
}

function actualizarSelectCiudad(nombreDepto) {
  const selCiudad = document.getElementById("ciudad");
  if (!selCiudad) return;

  const depto = todosDepartamentos.find(
    (d) => (d.nombre || d) === nombreDepto
  );

  const ciudadesFiltradas = todasLasCiudades.filter((c) => {
    const deptoNombre =
      c.departamento?.nombre || c.departamentoNombre || c.departamento || "";
    const deptoId =
      c.departamento?.id || c.departamentoId || null;

    if (depto?.id && deptoId) return deptoId === depto.id;
    return deptoNombre === nombreDepto;
  });

  selCiudad.innerHTML =
    '<option value="" selected disabled>Seleccione una ciudad...</option>';

  ciudadesFiltradas.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.nombre || c;
    selCiudad.appendChild(opt);
  });

  selCiudad.disabled = ciudadesFiltradas.length === 0;
}

async function inicializarSelectsUbicacion() {
  const contenedorDepto = document.getElementById("contenedor-departamento");
  const contenedorCiudad = document.getElementById("contenedor-ciudad");
  if (!contenedorDepto || !contenedorCiudad) return;

  contenedorDepto.innerHTML = `<div class="fs-field"><label class="fs-label">Departamento</label><p class="fs-label" style="color:var(--color-gray);font-size:0.85rem;">Cargando...</p></div>`;
  contenedorCiudad.innerHTML = `<div class="fs-field"><label class="fs-label">Ciudad</label><p class="fs-label" style="color:var(--color-gray);font-size:0.85rem;">Cargando...</p></div>`;

  const [departamentos, ciudades] = await Promise.all([
    getDepartamentos(),
    getCiudades(),
  ]);

  todosDepartamentos = departamentos;
  todasLasCiudades = ciudades;

  const nombresDepartamentos = departamentos.map((d) => d.nombre || d);

  contenedorDepto.innerHTML = select("Departamento", nombresDepartamentos);
  contenedorCiudad.innerHTML = select("Ciudad", []);

  const selDepto = document.getElementById("departamento");
  const selCiudad = document.getElementById("ciudad");

  if (selDepto) {
    selDepto.required = true;
    selDepto.classList.add("checkout-input");
    selDepto.addEventListener("change", () =>
      actualizarSelectCiudad(selDepto.value)
    );
  }

  if (selCiudad) {
    selCiudad.required = true;
    selCiudad.classList.add("checkout-input");
    selCiudad.disabled = true;
  }
}

document.getElementById("form-checkout").addEventListener("submit", async (e) => {
  e.preventDefault();
  limpiarAlertaCheckout();

  const carrito = obtenerCarrito();
  if (!carrito.length) {
    mostrarAlertaCheckout("Tu carrito está vacío. Agrega productos antes de continuar.");
    return;
  }

  if (!clienteId) {
    mostrarAlertaCheckout("No se pudo identificar tu cuenta. Recarga la página e intenta de nuevo.");
    return;
  }

  const nombreRecibe = document.getElementById("input-nombre")?.value.trim() || "";
  const direccion = document.getElementById("input-calle")?.value.trim() || "";
  const departamento = document.getElementById("departamento")?.value || "";
  const ciudadId = Number(document.getElementById("ciudad")?.value) || null;
  const complemento = document.getElementById("input-complemento")?.value.trim() || "";
  const codigoPostal = document.getElementById("input-codigo-postal")?.value.trim() || "";

  if (!departamento) {
    mostrarAlertaCheckout("Selecciona un departamento.");
    return;
  }
  if (!ciudadId) {
    mostrarAlertaCheckout("Selecciona una ciudad.");
    return;
  }

  const checkoutPayload = {
    clienteId,
    items: carrito.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
  };

  const btnSubmit = document.querySelector('[type="submit"][form="form-checkout"]');
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="bi bi-hourglass-split"></i> Procesando...';
  }

  try {
    const resCheckout = await postCheckout(checkoutPayload);

    if (!resCheckout) return;

    if (resCheckout.status === 409) {
      const data = await resCheckout.json().catch(() => ({}));
      mostrarAlertaCheckout(
        data.mensaje || "Algunos productos no tienen stock suficiente. Revisa tu carrito."
      );
      return;
    }

    if (!resCheckout.ok) {
      mostrarAlertaCheckout("Ocurrió un error al procesar tu pedido. Intenta de nuevo.");
      return;
    }

    const orden = await resCheckout.json().catch(() => ({}));
    const ordenId = orden.id ?? null;

    let envioRegistrado = false;

    const resEnvio = await postEnvio({
      nombreRecibe,
      direccion,
      complemento,
      codigoPostal,
      ciudadId,
      clienteId,
      ordenId,
    }).catch(() => null);

    if (resEnvio?.ok) {
      envioRegistrado = true;
    } else {
      console.warn(`POST /envios respondió ${resEnvio?.status ?? "error de red"}.`);
    }

    vaciarCarritoCompras();
    mostrarExito({ envioRegistrado });
  } catch {
    mostrarAlertaCheckout("No se pudo conectar con el servidor. Verifica tu conexión.");
  } finally {
    if (btnSubmit && document.contains(btnSubmit)) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<i class="bi bi-lock-fill"></i> Finalizar Compra';
    }
  }
});

async function inicializar() {
  renderResumen();
  manejarOpcionesPago();

  const sesion = getSession();
  if (sesion?.email) {
    clienteId = await getClienteIdPorEmail(sesion.email);
  }

  await inicializarSelectsUbicacion();
}

inicializar();
