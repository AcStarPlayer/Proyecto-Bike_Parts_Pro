import { navBar } from "../../../componentes/barraNavegacion/barNav.js";
import crearFormulario from "../../../componentes/formulario/formulario.js";
import { validarInput } from "../../../componentes/input/input.js";
import { footer } from "../../../componentes/piecero/footer.js";

document.querySelector(".nav-content").innerHTML = navBar(
  "BikePartsPro",
  "Panel Admin",
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
    titulo: "Imagenes",
    tipo: "text",
    placeholder: "https://img1.jpg, https://img2.jpg, https://img3.jpg",
    required: false,
  },
  {
    titulo: "Colores",
    tipo: "text",
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
];

document.getElementById("contenedor-form").innerHTML = crearFormulario(
  null,
  campos,
  "Registrar producto"
);

function marcarError(input) {
  if (!input) return;
  input.style.border = "2px solid red";
}

function limpiarError(input) {
  if (!input) return;
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