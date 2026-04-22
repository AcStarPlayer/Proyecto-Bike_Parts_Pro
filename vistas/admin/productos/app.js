import { navBar } from "../../../componentes/barraNavegacion/barNav.js";
import crearFormulario from "../../../componentes/formulario/formulario.js";
import { validarInput } from "../../../componentes/input/input.js";
import { footer } from "../../../componentes/piecero/footer.js";

document.querySelector(".nav-content").innerHTML = navBar(
  "BikePartsPro",
  "Panel Admin",
  "../../../",
);

const campos = [
  { titulo: "SKU", tipo: "codigo", placeholder: "Ej: BPP-001", required: true },
  {
    titulo: "Nombre",
    tipo: "text",
    placeholder: "Ej: Llanta MTB 29",
    required: true,
  },
  {
    titulo: "Precio",
    tipo: "number",
    placeholder: "Ej: 150000",
    required: true,
  },
  {
    titulo: "Imagen",
    tipo: "imagen",
    placeholder: "https://ejemplo.com/imagen.jpg",
    required: true,
  },
  {
    titulo: "Colores",
    tipo: "text",
    placeholder: "Ej: Rojo, Azul, Negro",
    required: true,
  },
  { titulo: "Stock", tipo: "number", placeholder: "Ej: 20", required: true },
];

document.getElementById("contenedor-form").innerHTML = crearFormulario(
  null,
  campos,
  "Registrar producto",
);

let imagenCount = 0;

function agregarFilaImagen() {
  const idx = imagenCount++;
  const lista = document.getElementById("imagenes-lista");

  const fila = document.createElement("div");
  fila.className = "imagen-fila mb-2";
  fila.dataset.idx = idx;
  fila.innerHTML = `
    <div class="d-flex align-items-center gap-2 mb-1">
      <div class="form-check form-check-inline mb-0">
        <input class="form-check-input" type="radio" name="imagen-tipo-${idx}" id="imagen-tipo-url-${idx}" value="url" checked>
        <label class="form-check-label" for="imagen-tipo-url-${idx}">Enlace</label>
      </div>
      <div class="form-check form-check-inline mb-0">
        <input class="form-check-input" type="radio" name="imagen-tipo-${idx}" id="imagen-tipo-archivo-${idx}" value="archivo">
        <label class="form-check-label" for="imagen-tipo-archivo-${idx}">Archivo</label>
      </div>
      <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-imagen ms-auto">
        <i class="bi bi-trash"></i>
      </button>
    </div>
    <input class="fs-input imagen-url w-100" type="url" placeholder="https://ejemplo.com/imagen.jpg" />
    <input class="fs-input imagen-archivo w-100" type="file" accept="image/*" style="display:none" />
  `;

  lista.appendChild(fila);

  fila.querySelectorAll(`input[name="imagen-tipo-${idx}"]`).forEach((radio) => {
    radio.addEventListener("change", () => {
      const esArchivo = radio.value === "archivo" && radio.checked;
      fila.querySelector(".imagen-url").style.display = esArchivo ? "none" : "";
      fila.querySelector(".imagen-archivo").style.display = esArchivo
        ? ""
        : "none";
    });
  });

  fila.querySelector(".btn-eliminar-imagen").addEventListener("click", () => {
    fila.remove();
    actualizarBotonesEliminar();
  });

  actualizarBotonesEliminar();
}

function actualizarBotonesEliminar() {
  const filas = document.querySelectorAll(".imagen-fila");
  filas.forEach((f) => {
    f.querySelector(".btn-eliminar-imagen").style.display =
      filas.length > 1 ? "" : "none";
  });
}

agregarFilaImagen();
document
  .getElementById("btn-agregar-imagen")
  .addEventListener("click", agregarFilaImagen);

function marcarError(input) {
  input.style.border = "2px solid red";
}
function limpiarError(input) {
  input.style.border = "1px solid #cbd5e1";
}

function leerArchivo(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(archivo);
  });
}

const camposValidables = campos.filter((c) => c.tipo !== "imagen");

document
  .getElementById("formulario")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    document.querySelectorAll(".fs-input, .fs-textarea").forEach(limpiarError);
    const errorEl = document.getElementById("error");
    errorEl.textContent = "";

    for (const campo of camposValidables) {
      const id = campo.titulo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
      const elemento = document.getElementById(id);
      const resultado = validarInput(elemento, campo.tipo);
      if (!resultado.valido) {
        marcarError(elemento);
        errorEl.textContent = resultado.mensaje;
        return;
      }
    }

    const imagenes = [];
    for (const fila of document.querySelectorAll(".imagen-fila")) {
      const idx = fila.dataset.idx;
      const tipo = fila.querySelector(
        `input[name="imagen-tipo-${idx}"]:checked`,
      ).value;
      if (tipo === "url") {
        const urlInput = fila.querySelector(".imagen-url");
        try {
          new URL(urlInput.value.trim());
          imagenes.push(urlInput.value.trim());
        } catch {
          marcarError(urlInput);
          errorEl.textContent = "Una URL de imagen no es válida";
          return;
        }
      } else {
        const fileInput = fila.querySelector(".imagen-archivo");
        if (!fileInput.files.length) {
          marcarError(fileInput);
          errorEl.textContent = "Selecciona una imagen en cada fila";
          return;
        }
        imagenes.push(await leerArchivo(fileInput.files[0]));
      }
    }

    const producto = {
      id: Date.now(),
      sku: document.getElementById("sku").value.trim(),
      nombre: document.getElementById("nombre").value.trim(),
      precio: Number(document.getElementById("precio").value),
      imagenes,
      colores: document
        .getElementById("colores")
        .value.split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      stock: Number(document.getElementById("stock").value),
    };

    const productos = JSON.parse(localStorage.getItem("productos") || "[]");
    productos.push(producto);
    localStorage.setItem("productos", JSON.stringify(productos));

    document.getElementById("formulario").reset();
    document.getElementById("imagenes-lista").innerHTML = "";
    agregarFilaImagen();

    document.getElementById("alerta").innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="bi bi-check-circle me-2"></i>
        Producto <strong>${producto.nombre}</strong> registrado con ${imagenes.length} imagen(es).
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  });

document.getElementById("footer").innerHTML = footer("../../../");
