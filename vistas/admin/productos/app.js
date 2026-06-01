import { navBar } from "../../../componentes/barraNavegacion/barNav.js";
import crearFormulario from "../../../componentes/formulario/formulario.js";
import { footer } from "../../../componentes/pieDePagina/footer.js";
import alertas from "../../../componentes/alertas/alertas.js";
import { postProducto } from "../../../apis/productosApi.js";
import { postModeloProducto } from "../../../apis/modelosProductoApi.js";
import { getMarcas } from "../../../apis/marcasApi.js";

navBar("Panel Admin", "../../../");

const CATEGORIAS_API = {
  "Transmisión":         "TRANSMISION",
  "Frenos":              "FRENOS",
  "Dirección y Control": "DIRECCION",
  "Ruedas":              "RUEDAS",
  "Estructura":          "ESTRUCTURA",
};

const campos = [
  {
    titulo: "SKU",
    tipo: "codigo",
    placeholder: "Ej: SH1234",
    mensajePersonalizado: "El SKU es obligatorio para el inventario",
    required: true,
  },
  {
    titulo: "Nombre",
    tipo: "text",
    placeholder: "Ej: Cassette Shimano Deore 11v",
    mensajePersonalizado: "Escribe un nombre válido para el producto",
    required: true,
  },
  {
    titulo: "Descripcion",
    tipo: "full-text",
    placeholder: "Ej: Cassette 11 velocidades 11-51T para MTB",
    mensajePersonalizado: "La descripción debe ser más detallada (mínimo 10 caracteres)",
    required: true,
  },
  {
    titulo: "Precio",
    tipo: "number",
    placeholder: "Ej: 185000",
    mensajePersonalizado: "El precio debe ser un valor numérico",
    required: true,
  },
  {
    titulo: "Stock",
    tipo: "number",
    placeholder: "Ej: 8",
    mensajePersonalizado: "Ingresa la cantidad disponible en stock",
    required: true,
  },
  {
    titulo: "Categoria",
    tipo: "select",
    required: true,
    options: Object.keys(CATEGORIAS_API),
    mensajePersonalizado: "Debes seleccionar una categoría",
  },
];

function htmlMarcaSelect() {
  return `
    <div class="fs-field">
      <label class="fs-label" for="select-marca">Marca</label>
      <select id="select-marca" name="select-marca" class="fs-input form-control" required disabled>
        <option value="" selected disabled>Cargando marcas...</option>
      </select>
    </div>
  `;
}

document.getElementById("contenedor-form").innerHTML = crearFormulario(
  null,
  campos,
  "Registrar producto",
  htmlMarcaSelect(),
);

document.getElementById("footer").innerHTML = footer("../../../");

// ── INSERTAR MARCA DESPUÉS DE "NOMBRE" ───────────────────────

function insertarMarcaEnOrden() {
  const campNombre = document.getElementById("nombre")?.closest(".fs-field");
  const marcaField = document.getElementById("select-marca")?.closest(".fs-field");
  if (campNombre && marcaField) {
    campNombre.insertAdjacentElement("afterend", marcaField);
  }
}

async function cargarMarcas() {
  const sel = document.getElementById("select-marca");
  if (!sel) return;

  const marcas = await getMarcas();
  sel.innerHTML = '<option value="" selected disabled>Selecciona una marca</option>';
  marcas.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.nombre || m;
    sel.appendChild(opt);
  });
  sel.disabled = false;
}

insertarMarcaEnOrden();
cargarMarcas();

// ── VALIDACIÓN ────────────────────────────────────────────────

function limpiarErrores() {
  document.querySelectorAll(".error-campo").forEach((el) => el.remove());
  document.querySelectorAll("#formulario input, #formulario textarea, #formulario select")
    .forEach((el) => { el.style.borderColor = ""; });
}

function marcarError(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  if (!campo) return;
  if (campo.nextElementSibling?.classList.contains("error-campo")) return;
  campo.style.borderColor = "#dc3545";
  const span = document.createElement("small");
  span.className = "error-campo";
  span.style.cssText = "color:#dc3545;display:block;margin-top:4px;";
  span.textContent = mensaje;
  campo.insertAdjacentElement("afterend", span);
}

function validar() {
  let ok = true;

  campos.forEach((c) => {
    const id = c.titulo.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const el = document.getElementById(id);
    if (!el) return;
    const val = el.value?.trim();
    if (c.required && !val) { marcarError(id, c.mensajePersonalizado); ok = false; }
    if (id === "descripcion" && val && val.length < 10) {
      marcarError(id, c.mensajePersonalizado); ok = false;
    }
  });

  if (!document.getElementById("select-marca")?.value) {
    marcarError("select-marca", "Debes seleccionar una marca");
    ok = false;
  }

  return ok;
}

// ── SUBMIT: DOS PASOS ─────────────────────────────────────────

document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const alertaEl = document.getElementById("alerta-contenedor");
  alertaEl.innerHTML = "";
  limpiarErrores();

  if (!validar()) return;

  const btnSubmit = e.target.querySelector("[type=submit]");
  const textoOriginal = btnSubmit?.innerHTML;

  try {
    // ── Paso 1: crear modelo del producto ──────────────────
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Creando modelo...";
    }

    const modeloPayload = {
      sku:         document.getElementById("sku").value.trim(),
      nombre:      document.getElementById("nombre").value.trim(),
      descripcion: document.getElementById("descripcion").value.trim(),
      marcaId:     Number(document.getElementById("select-marca").value),
    };

    const resModelo = await postModeloProducto(modeloPayload);

    if (!resModelo) {
      alertaEl.innerHTML = alertas("Sesión expirada. Vuelve a iniciar sesión.", "danger");
      return;
    }
    if (!resModelo.ok) {
      const d = await resModelo.json().catch(() => ({}));
      throw new Error(d.mensaje || d.message || `Error ${resModelo.status} al crear el modelo.`);
    }

    const modelo = await resModelo.json();

    // ── Paso 2: crear el producto ──────────────────────────
    if (btnSubmit) btnSubmit.textContent = "Creando producto...";

    const categoriaLabel = document.getElementById("categoria").value;
    const productoPayload = {
      nombre:         document.getElementById("nombre").value.trim(),
      precio:         Number(document.getElementById("precio").value),
      stock:          Number(document.getElementById("stock").value),
      categoria:      CATEGORIAS_API[categoriaLabel] || categoriaLabel.toUpperCase(),
      modeloProducto: { id: modelo.id },
    };

    const resProducto = await postProducto(productoPayload);

    if (!resProducto) {
      alertaEl.innerHTML = alertas("Sesión expirada. Vuelve a iniciar sesión.", "danger");
      return;
    }
    if (!resProducto.ok) {
      const d = await resProducto.json().catch(() => ({}));
      throw new Error(d.mensaje || d.message || `Error ${resProducto.status} al crear el producto.`);
    }

    document.getElementById("formulario").reset();
    alertaEl.innerHTML = alertas("Producto registrado correctamente en el catálogo.", "success");
    setTimeout(() => { alertaEl.innerHTML = ""; }, 3000);

  } catch (err) {
    alertaEl.innerHTML = alertas(err.message || "No fue posible registrar el producto.", "danger");
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = textoOriginal;
    }
  }
});
