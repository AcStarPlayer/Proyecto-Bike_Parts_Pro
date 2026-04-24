import { navBar } from "../../../componentes/barraNavegacion/barNav.js";
import crearFormulario from "../../../componentes/formulario/formulario.js";
import { validarInput } from "../../../componentes/input/input.js";
import { footer } from "../../../componentes/piecero/footer.js";

document.querySelector(".nav-content").innerHTML = navBar(
  "BikePartsPro",
  "Panel Admin",
<<<<<<< HEAD
  "../../../"
);

const CLAVEALMACENAMIENTOPRODUCTOS = "bikePartsPro-productos-tecnicos";

const campos = [
  {
    titulo: "SKU",
    tipo: "text",
    placeholder: "Ej: BPP-001",
    required: false,
  },
  {
    titulo: "Marca",
    tipo: "text",
    placeholder: "Ej: Shimano",
    required: true,
  },
=======
  "../../../",
);

const campos = [
  { titulo: "SKU", tipo: "codigo", placeholder: "Ej: BPP-001", required: true },
>>>>>>> main
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
<<<<<<< HEAD
    titulo: "Imagenes",
    tipo: "text",
    placeholder: "https://img1.jpg, https://img2.jpg, https://img3.jpg",
    required: false,
=======
    titulo: "Imagen",
    tipo: "imagen",
    placeholder: "https://ejemplo.com/imagen.jpg",
    required: true,
>>>>>>> main
  },
  {
    titulo: "Colores",
    tipo: "text",
<<<<<<< HEAD
    placeholder: "Ej: Negro, Gris, Rojo",
    required: true,
  },
  {
    titulo: "Sistema",
    tipo: "text",
    placeholder: "Ej: Transmisión",
    required: true,
  },
  {
    titulo: "Stock",
    tipo: "number",
    placeholder: "Ej: 20",
    required: true,
  },
=======
    placeholder: "Ej: Rojo, Azul, Negro",
    required: true,
  },
  { titulo: "Stock", tipo: "number", placeholder: "Ej: 20", required: true },
>>>>>>> main
];

document.getElementById("contenedor-form").innerHTML = crearFormulario(
  null,
  campos,
<<<<<<< HEAD
  "Registrar producto"
);

function marcarError(input) {
  if (!input) return;
  input.style.border = "2px solid red";
}

function limpiarError(input) {
  if (!input) return;
=======
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
>>>>>>> main
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

<<<<<<< HEAD
function obtenerCodigoColor(nombre) {
  const mapa = {
    negro: "#111111",
    gris: "#6b7280",
    rojo: "#ef4444",
    azul: "#2563eb",
    verde: "#35c96b",
    plata: "#c0c0c0",
    blanco: "#f5f5f5",
    amarillo: "#eab308",
    naranja: "#f97316",
    morado: "#7c3aed",
    rosado: "#ec4899",
    cafe: "#8b5e3c",
    marron: "#8b5e3c",
    dorado: "#d4a017",
  };

  return mapa[nombre.trim().toLowerCase()] || "#cccccc";
}

function obtenerColoresNormalizados(valorColores) {
  return valorColores
    .split(",")
    .map((color) => color.trim())
    .filter(Boolean)
    .map((color) => ({
      nombre: color,
      codigo: obtenerCodigoColor(color),
    }));
}

function obtenerImagenesDesdeTexto(valor) {
  return valor
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

function validarUrlsImagenes(urls) {
  if (!urls.length) {
    return {
      valido: false,
      mensaje: "Debes ingresar al menos una URL de imagen o seleccionar archivos locales",
    };
  }

  for (const url of urls) {
    try {
      new URL(url);
    } catch {
      return {
        valido: false,
        mensaje: `URL de imagen inválida: ${url}`,
      };
    }
  }

  return { valido: true, mensaje: "" };
}

function crearSelectorTipoImagen() {
  const inputImagenes = document.getElementById("imagenes");
  if (!inputImagenes || document.getElementById("selector-tipo-imagen")) return;

  const grupoCampo = inputImagenes.closest(".fs-field") || inputImagenes.parentElement;

  const selector = document.createElement("div");
  selector.id = "selector-tipo-imagen";
  selector.className = "selector-tipo-imagen";
  selector.innerHTML = `
    <label class="selector-tipo-imagen__titulo">Origen de imágenes</label>
    <div class="selector-tipo-imagen__opciones">
      <label class="selector-tipo-imagen__opcion">
        <input type="radio" name="imagen-tipo" id="imagen-tipo-url" value="url" checked>
        <span>URLs</span>
      </label>
      <label class="selector-tipo-imagen__opcion">
        <input type="radio" name="imagen-tipo" id="imagen-tipo-archivo" value="archivo">
        <span>Archivos locales</span>
      </label>
    </div>
  `;

  grupoCampo.parentElement.insertBefore(selector, grupoCampo);

  const inputArchivo = document.createElement("input");
  inputArchivo.type = "file";
  inputArchivo.id = "imagen-archivo";
  inputArchivo.accept = "image/*";
  inputArchivo.multiple = true;
  inputArchivo.className = inputImagenes.className;
  inputArchivo.style.display = "none";

  inputImagenes.insertAdjacentElement("afterend", inputArchivo);

  document.querySelectorAll('input[name="imagen-tipo"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const esArchivo = radio.value === "archivo" && radio.checked;
      inputImagenes.style.display = esArchivo ? "none" : "";
      inputArchivo.style.display = esArchivo ? "" : "none";
      limpiarError(inputImagenes);
      limpiarError(inputArchivo);
    });
  });
}

crearSelectorTipoImagen();

const camposValidables = campos.filter((campo) => campo.titulo !== "Imagenes");

document.getElementById("formulario").addEventListener("submit", async function (e) {
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

  const inputImagenes = document.getElementById("imagenes");
  const inputArchivo = document.getElementById("imagen-archivo");
  const tipoImagen = document.querySelector('input[name="imagen-tipo"]:checked')?.value || "url";

  let imagenes = [];

  if (tipoImagen === "url") {
    imagenes = obtenerImagenesDesdeTexto(inputImagenes.value);
    const validacion = validarUrlsImagenes(imagenes);

    if (!validacion.valido) {
      marcarError(inputImagenes);
      errorEl.textContent = validacion.mensaje;
      return;
    }
  } else {
    if (!inputArchivo || !inputArchivo.files.length) {
      marcarError(inputArchivo);
      errorEl.textContent = "Debes seleccionar al menos una imagen local";
      return;
    }

    try {
      imagenes = await Promise.all(
        Array.from(inputArchivo.files).map((archivo) => leerArchivo(archivo))
      );
    } catch {
      marcarError(inputArchivo);
      errorEl.textContent = "No fue posible procesar las imágenes locales";
      return;
    }
  }

  const colores = obtenerColoresNormalizados(
    document.getElementById("colores").value
  );

  if (!colores.length) {
    marcarError(document.getElementById("colores"));
    errorEl.textContent = "Debes ingresar al menos un color";
    return;
  }

  const producto = {
    id: `producto-${Date.now()}`,
    sku: document.getElementById("sku").value.trim(),
    marca: document.getElementById("marca").value.trim(),
    nombre: document.getElementById("nombre").value.trim(),
    precio: Number(document.getElementById("precio").value),
    imagenes,
    colores,
    stock: Number(document.getElementById("stock").value),
    sistema: document.getElementById("sistema").value.trim(),
  };

  const productos = JSON.parse(
    localStorage.getItem(CLAVEALMACENAMIENTOPRODUCTOS) || "[]"
  );

  productos.push(producto);

  localStorage.setItem(
    CLAVEALMACENAMIENTOPRODUCTOS,
    JSON.stringify(productos)
  );

  document.getElementById("formulario").reset();

  if (inputArchivo) {
    inputArchivo.value = "";
    inputArchivo.style.display = "none";
  }

  if (inputImagenes) {
    inputImagenes.style.display = "";
  }

  const radioUrl = document.getElementById("imagen-tipo-url");
  if (radioUrl) radioUrl.checked = true;

  document.getElementById("alerta").innerHTML = `
    <div class="alert alert-success" role="alert">
      Producto registrado correctamente.
    </div>
  `;
});


const contenedorFooter = document.getElementById("footer");
if (contenedorFooter) {
  contenedorFooter.innerHTML = footer();
}
=======
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
>>>>>>> main
