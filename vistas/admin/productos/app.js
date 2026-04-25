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
  { titulo: "Marca", tipo: "text", placeholder: "Ej: Shimano", required: true },
  {
    titulo: "Precio",
    tipo: "number",
    placeholder: "Ej: 150000",
    required: true,
  },
  { titulo: "Imagen", tipo: "imagen", required: true },
  { titulo: "Colores", tipo: "colores", required: true },
  { titulo: "Stock", tipo: "number", placeholder: "Ej: 20", required: true },
  {
    titulo: "Categoría",
    tipo: "select",
    required: true,
    options: ["Transmisión", "Dirección y Control", "Frenos"],
  },
];

document.getElementById("contenedor-form").innerHTML = crearFormulario(
  null,
  campos,
  "Registrar producto",
);

document.getElementById("footer").innerHTML = footer("../../../");

let colorCount = 0;
let imagenCount = 0;

function validarCamposTexto() {
  for (const campo of campos.filter(
    (c) => c.tipo !== "imagen" && c.tipo !== "colores",
  )) {
    const id = campo.titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const elemento = document.getElementById(id);
    const resultado = validarInput(elemento, campo.tipo);

    if (!resultado.valido) {
      marcarError(elemento);
      return false;
    }
  }
  return true;
}

function obtenerColores() {
  return [...document.querySelectorAll(".color-fila")].map((f) => ({
    codigo: f.querySelector(".color-picker").value,
    nombre: f.querySelector(".color-nombre").value.trim(),
  }));
}

async function obtenerImagenes() {
  const imagenes = [];

  for (const fila of document.querySelectorAll(".imagen-fila")) {
    const tipo = fila.querySelector("input[type=radio]:checked").value;

    if (tipo === "url") {
      imagenes.push(fila.querySelector(".imagen-url").value.trim());
    } else {
      const file = fila.querySelector(".imagen-archivo").files[0];
      imagenes.push(await leerArchivo(file));
    }
  }

  return imagenes;
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

  const radios = fila.querySelectorAll(`input[name="imagen-tipo-${idx}"]`);

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const esArchivo = fila.querySelector(`input[value="archivo"]`).checked;

      fila.querySelector(".imagen-url").style.display = esArchivo ? "none" : "";
      fila.querySelector(".imagen-archivo").style.display = esArchivo
        ? ""
        : "none";
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
  return {
    id: Date.now(),
    sku: document.getElementById("sku").value.trim(),
    nombre: document.getElementById("nombre").value.trim(),
    marca: document.getElementById("marca").value.trim(),
    precio: Number(document.getElementById("precio").value),
    stock: Number(document.getElementById("stock").value),
    sistema: document.getElementById("categoria").value,
    colores,
    imagenes,
  };
}

function guardarProducto(producto) {
  const productos = JSON.parse(localStorage.getItem("productos") || "[]");
  productos.push(producto);
  localStorage.setItem("productos", JSON.stringify(productos));
}

function resetFormulario() {
  document.getElementById("formulario").reset();
  document.getElementById("colores-lista").innerHTML = "";
  document.getElementById("imagenes-lista").innerHTML = "";
  colorCount = 0;
  imagenCount = 0;
  agregarFilaColor();
  agregarFilaImagen();
}

function marcarError(input) {
  input.style.border = "2px solid red";
}

function limpiarError(input) {
  input.style.border = "1px solid #cbd5e1";
}

function leerArchivo(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

agregarFilaColor();
document
  .getElementById("btn-agregar-color")
  .addEventListener("click", agregarFilaColor);

agregarFilaImagen();
document
  .getElementById("btn-agregar-imagen")
  .addEventListener("click", agregarFilaImagen);

document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  document.querySelectorAll(".fs-input").forEach(limpiarError);

  const errorEl = document.getElementById("error");
  errorEl.textContent = "";

  if (!validarCamposTexto()) {
    errorEl.textContent = "Revisa los campos obligatorios";
    return;
  }

  const colores = obtenerColores();

  if (!colores.length) {
    errorEl.textContent = "Agrega al menos un color";
    return;
  }

  const imagenes = await obtenerImagenes();

  const producto = construirProducto(colores, imagenes);

  guardarProducto(producto);

  resetFormulario();

  errorEl.textContent = "";
  errorEl.innerHTML = `
    <div class="alert alert-success mt-2" role="alert">
      Producto registrado correctamente
    </div>
`;
  setTimeout(() => {
    errorEl.textContent = "";
  }, 3000);
});
