import { navBar } from "../../../componentes/barraNavegacion/barNav.js";
import crearFormulario, { validarFormulario } from "../../../componentes/formulario/formulario.js";
import { footer } from "../../../componentes/pieDePagina/footer.js";
import alertas from "../../../componentes/alertas/alertas.js";
import { postProducto } from "../../../apis/productosApi.js";

navBar("Panel Admin", "../../../");

const CATEGORIAS_API = {
  "Transmisión":        "TRANSMISION",
  "Frenos":             "FRENOS",
  "Dirección y Control": "DIRECCION",
  "Ruedas":             "RUEDAS",
  "Estructura":         "ESTRUCTURA",
};

const campos = [
  {
    titulo: "SKU",
    tipo: "codigo",
    placeholder: "Ej: BPP-001",
    mensajePersonalizado: "El SKU es obligatorio para el inventario",
    required: true,
  },
  {
    titulo: "Nombre",
    tipo: "text",
    placeholder: "Ej: Llanta MTB 29",
    mensajePersonalizado: "Escribe un nombre válido para el producto",
    required: true,
  },
  {
    titulo: "Marca",
    tipo: "text",
    placeholder: "Ej: Shimano",
    mensajePersonalizado: "Ingresa una marca válida",
    required: true,
  },
  {
    titulo: "Precio",
    tipo: "number",
    placeholder: "Ej: 150000",
    mensajePersonalizado: "El precio debe ser un valor numérico",
    required: true,
  },
  {
    titulo: "Descripcion",
    tipo: "full-text",
    placeholder: "Ej: Cadena Shimano de alta resistencia para MTB y ruta",
    mensajePersonalizado: "La descripción debe ser más detallada (mínimo 10 caracteres)",
    required: true,
  },
  {
    titulo: "Stock",
    tipo: "number",
    placeholder: "Ej: 20",
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
 
document.getElementById("contenedor-form").innerHTML = crearFormulario(
  null,
  campos,
  "Registrar producto",
  htmlWidgetImagenes(),
);
 
document.getElementById("footer").innerHTML = footer("../../../");
 
let imagenCount = 0;
 
function limpiarErroresCampos() {
  document.querySelectorAll(".error-campo").forEach(el => el.remove());
}
 
function mostrarErrorCampo(idCampo, mensaje) {
 
  const campo = document.getElementById(idCampo);
 
  if (!campo) return;
 
  const siguiente = campo.nextElementSibling;
 
  if (
    siguiente &&
    siguiente.classList.contains("error-campo")
  ) {
    return;
  }
 
  campo.style.borderColor = "#dc3545";
 
  const error = document.createElement("small");
 
  error.className = "error-campo";
 
  error.style.color = "#dc3545";
 
  error.style.display = "block";
 
  error.style.marginTop = "4px";
 
  error.textContent = mensaje;
 
  campo.insertAdjacentElement("afterend", error);
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
    if (!imagenValida) {
 
    const error = document.createElement("small");
 
    error.className = "error-campo";
 
    error.style.color = "#dc3545";
 
    error.style.display = "block";
 
    error.style.marginTop = "4px";
 
    error.textContent =
      "Agrega al menos una imagen válida";
 
    listaImagenes.appendChild(error);
 
    errores.push("error");
  }
 
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
 
function construirPayloadProducto(imagenes) {
  const sku = document.getElementById("sku").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const marca = document.getElementById("marca").value.trim();
  const precio = Number(document.getElementById("precio").value);
  const descripcion = document.getElementById("descripcion").value.trim();
  const stock = Number(document.getElementById("stock").value);
  const categoriaLabel = document.getElementById("categoria").value;
  const categoria = CATEGORIAS_API[categoriaLabel] || categoriaLabel.toUpperCase();

  return {
    sku,
    nombre,
    marca,
    precio,
    stock,
    categoria,
    descripcion,
    imagenes: imagenes.map((url, i) => ({ url, principal: i === 0 })),
  };
}
 
function resetFormulario() {
  document.getElementById("formulario").reset();
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
document.getElementById("btn-agregar-imagen").addEventListener("click", agregarFilaImagen);
 
agregarFilaImagen();
 
document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();
 
  const alertaEl = document.getElementById("alerta-contenedor");
  alertaEl.innerHTML = "";
 
  limpiarErroresCampos();
 
  document
    .querySelectorAll(
      "#formulario input, #formulario textarea, #formulario select"
    )
    .forEach(el => {
      el.style.borderColor = "";
    });
 
  try {
    let hayErrores = false;
 
    campos.forEach(campo => {
 
      const id = campo.titulo.toLowerCase();
 
      const input = document.getElementById(id);
 
      if (!input) return;
 
      const valor = input.value?.trim();
 
      if (campo.required && !valor) {
 
        mostrarErrorCampo(
          id,
          campo.mensajePersonalizado
        );
 
        hayErrores = true;
      }
 
      if (
        id === "descripcion" &&
        valor &&
        valor.length < 10
      ) {
 
        mostrarErrorCampo(
          id,
          campo.mensajePersonalizado
        );
 
        hayErrores = true;
      }
 
      if (
        id === "categoria" &&
        valor &&
        (
          valor === "Seleccione..." ||
          valor === "Seleccionar..."
        )
      )
 
      {
 
        mostrarErrorCampo(
          id,
          campo.mensajePersonalizado
        );
 
        hayErrores = true;
      }
 
    });
 
    const erroresWidgets = validarWidgets();
 
    if (erroresWidgets.length > 0) {
      hayErrores = true;
    }
 
    if (hayErrores) {
      return;
    }
    const imagenes = await obtenerImagenes();
    const payload = construirPayloadProducto(imagenes);

    const res = await postProducto(payload);

    if (!res) {
      alertaEl.innerHTML = alertas("Sesión expirada. Vuelve a iniciar sesión.", "danger");
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.mensaje || data.message || `Error ${res.status} al registrar el producto.`);
    }

    resetFormulario();
    alertaEl.innerHTML = alertas("Producto registrado correctamente en el catálogo.", "success");
    setTimeout(() => { alertaEl.innerHTML = ""; }, 3000);

  } catch (error) {
    alertaEl.innerHTML = alertas(error.message || "No fue posible registrar el producto.", "danger");
  }
});