import { navBar } from "../../../componentes/barraNavegacion/barNav.js";
import crearFormulario, { validarFormulario } from "../../../componentes/formulario/formulario.js";
import { footer } from "../../../componentes/pieDePagina/footer.js";
import alertas from "../../../componentes/alertas/alertas.js";

const datosSesionGuardada =
  JSON.parse(localStorage.getItem("sesionBikePartsPro")) || null;

const tienePermisoAdminAuxiliar =
  datosSesionGuardada &&
  datosSesionGuardada.autenticado &&
  (
    datosSesionGuardada.rol === "adminAuxiliar" ||
    datosSesionGuardada.adminAuxiliar === true
  );

if (!tienePermisoAdminAuxiliar) {
  window.location.href = "../../login/login.html";
}


navBar("Panel Admin", "../../../");

const campos = [
  {
    titulo: "SKU",
    tipo: "codigo",
    placeholder: "Ej: BPP-001",
    required: true,
    mensajePersonalizado: "El SKU es obligatorio para el inventario",
  },
  {
    titulo: "Nombre",
    tipo: "text",
    placeholder: "Ej: Llanta MTB 29",
    required: true,
    mensajePersonalizado: "Escribe un nombre válido para el producto",
  },
  {
    titulo: "Marca",
    tipo: "text",
    placeholder: "Ej: Shimano",
    required: true,
    mensajePersonalizado: "Ingresa una marca válida",
  },
  {
    titulo: "Precio",
    tipo: "number",
    placeholder: "Ej: 150000",
    required: true,
    mensajePersonalizado: "El precio debe ser un valor numérico",
  },
  {
    titulo: "Descripción",
    tipo: "full-text",
    placeholder: "Ej: Cadena Shimano de alta resistencia para MTB y ruta",
    required: true,
    mensajePersonalizado: "La descripción debe ser más detallada (mínimo 10 caracteres)",
  },
  {
    titulo: "Stock",
    tipo: "number",
    placeholder: "Ej: 20",
    required: true,
    mensajePersonalizado: "Ingresa la cantidad disponible en stock",
  },
  {
    titulo: "Categoría",
    tipo: "select",
    required: true,
    options: ["Transmisión", "Dirección y Control", "Frenos"],
    mensajePersonalizado: "Debes seleccionar una categoría",
  },
];

function htmlWidgetImagenes() {
  return `
    <div class="fs-field">
      <label class="fs-label">Imagen</label>
      <div id="imagenes-lista"></div>
      <button type="button" id="btn-agregar-imagen" class="btn btn-outline-secondary btn-sm mt-2">
        <i class="bi bi-plus-circle me-1"></i>Agregar imagen
      </button>
    </div>
  `;
}

function htmlWidgetColores() {
  return `
    <div class="fs-field">
      <label class="fs-label">Colores</label>
      <div id="colores-lista"></div>
      <button type="button" id="btn-agregar-color" class="btn btn-outline-secondary btn-sm mt-2">
        <i class="bi bi-plus-circle me-1"></i>Agregar color
      </button>
    </div>
  `;
}

document.getElementById("contenedor-form").innerHTML = crearFormulario(
  null,
  campos,
  "Registrar producto",
  htmlWidgetImagenes() + htmlWidgetColores(),
);

document.getElementById("footer").innerHTML = footer("../../../");

let imagenCount = 0;

function obtenerColores() {
  return [...document.querySelectorAll(".color-fila")]
    .map((f) => ({
      codigo: f.querySelector(".color-picker").value,
      nombre: f.querySelector(".color-nombre").value.trim(),
    }))
    .filter((color) => color.codigo);
}

async function obtenerImagenes() {
  const imagenes = [];

  for (const fila of document.querySelectorAll(".imagen-fila")) {
    const tipo = fila.querySelector("input[type=radio]:checked").value;

    if (tipo === "url") {
      const url = fila.querySelector(".imagen-url").value.trim();
      if (!url) throw new Error("Debes ingresar al menos una URL como imagen.");
      imagenes.push(url);
    } else {
      const file = fila.querySelector(".imagen-archivo").files[0];
      if (!file) throw new Error("Debes seleccionar un archivo de imagen.");
      imagenes.push(await leerArchivo(file));
    }
  }

  return imagenes;
}

function validarWidgets() {
  const errores = [];

  const listaImagenes = document.getElementById("imagenes-lista");
  let imagenValida = false;
  listaImagenes.querySelectorAll(".imagen-fila").forEach((fila) => {
    const radio = fila.querySelector("input[type=radio]:checked");
    if (!radio) return;
    if (radio.value === "url") {
      if (fila.querySelector(".imagen-url")?.value.trim()) imagenValida = true;
    } else {
      if (fila.querySelector(".imagen-archivo")?.files.length > 0) imagenValida = true;
    }
  });
  listaImagenes.style.outline = imagenValida ? "" : "1px solid red";
  if (!imagenValida) errores.push("Agrega al menos una imagen válida");

  const listaColores = document.getElementById("colores-lista");
  const tieneColores = listaColores.querySelectorAll(".color-fila").length > 0;
  listaColores.style.outline = tieneColores ? "" : "1px solid red";
  if (!tieneColores) errores.push("Agrega al menos un color");

  return errores;
}

function agregarFilaImagen() {
  const idx = imagenCount++;
  const lista = document.getElementById("imagenes-lista");

  const fila = document.createElement("div");
  fila.className = "imagen-fila mb-2";

  fila.innerHTML = `
    <div class="d-flex align-items-center gap-2 mb-1">
      <div>
        <input type="radio" name="imagen-tipo-${idx}" value="url" checked> URL
        <input type="radio" name="imagen-tipo-${idx}" value="archivo"> Archivo
      </div>
      <button type="button" class="btn btn-outline-danger btn-sm ms-auto btn-eliminar-imagen">🗑</button>
    </div>
    <input class="fs-input imagen-url w-100" type="url" placeholder="URL imagen" />
    <input class="fs-input imagen-archivo w-100" type="file" accept="image/*" style="display:none" />
  `;

  lista.appendChild(fila);

  fila.querySelectorAll(`input[name="imagen-tipo-${idx}"]`).forEach((radio) => {
    radio.addEventListener("change", () => {
      const esArchivo = fila.querySelector(`input[value="archivo"]`).checked;
      fila.querySelector(".imagen-url").style.display = esArchivo ? "none" : "";
      fila.querySelector(".imagen-archivo").style.display = esArchivo ? "" : "none";
    });
  });

  fila.querySelector(".btn-eliminar-imagen").addEventListener("click", () => {
    fila.remove();
  });
}

function agregarFilaColor() {
  const lista = document.getElementById("colores-lista");

  const fila = document.createElement("div");
  fila.className = "color-fila mb-2";

  fila.innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <input type="color" class="color-picker" value="#000000" />
      <input type="text" class="fs-input color-nombre flex-grow-1" placeholder="Nombre (opcional)" />
      <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-color">🗑</button>
    </div>
  `;

  lista.appendChild(fila);

  fila.querySelector(".btn-eliminar-color").addEventListener("click", () => {
    fila.remove();
  });
}

function construirProducto(colores, imagenes) {
  const sku = document.getElementById("sku").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const marca = document.getElementById("marca").value.trim();
  const precio = Number(document.getElementById("precio").value);
  const descripcion = document.getElementById("descripcion").value.trim();
  const stock = Number(document.getElementById("stock").value);
  const categoria = document.getElementById("categoria").value;

  return {
    id: Date.now(),
    fechaCreacion: new Date().toISOString(),
    origen: "formulario-admin",
    activo: true,
    sku,
    nombre,
    titulo: nombre,
    marca,
    precio,
    stock,
    categoria,
    sistema: categoria,
    descripcion,
    descripcionCorta: descripcion,
    imagen: imagenes[0] || "",
    imagenPrincipal: imagenes[0] || "",
    imagenes,
    colores,
  };
}

function guardarProducto(producto) {
  const productos = JSON.parse(localStorage.getItem("productos") || "[]");

  if (!Array.isArray(productos)) {
    throw new Error("El almacenamiento local de productos está corrupto.");
  }

  productos.push(producto);
  localStorage.setItem("productos", JSON.stringify(productos));
}

function resetFormulario() {
  document.getElementById("formulario").reset();
  document.getElementById("colores-lista").innerHTML = "";
  document.getElementById("imagenes-lista").innerHTML = "";
  imagenCount = 0;
  agregarFilaImagen();
}

function leerArchivo(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.getElementById("btn-agregar-color").addEventListener("click", agregarFilaColor);
document.getElementById("btn-agregar-imagen").addEventListener("click", agregarFilaImagen);

agregarFilaImagen();

document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const alertaEl = document.getElementById("alerta-contenedor");
  alertaEl.innerHTML = "";

  try {
    const errores = [...validarFormulario(campos), ...validarWidgets()];

    if (errores.length > 0) {
      const mensaje = errores.length === 1
        ? errores[0]
        : `<ul class="mb-0 ps-4" style="list-style-type:disc">${errores.map((err) => `<li class="mt-1">${err}</li>`).join("")}</ul>`;
      alertaEl.innerHTML = alertas(mensaje, "danger");
      return;
    }

    const colores = obtenerColores();
    const imagenes = await obtenerImagenes();
    const producto = construirProducto(colores, imagenes);
    guardarProducto(producto);
    resetFormulario();

    alertaEl.innerHTML = alertas("Producto registrado correctamente.", "success");

    setTimeout(() => {
      alertaEl.innerHTML = "";
    }, 3000);
  } catch (error) {
    alertaEl.innerHTML = alertas(error.message || "No fue posible registrar el producto.", "danger");
  }
});
