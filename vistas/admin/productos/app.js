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

document.querySelectorAll('input[name="imagen-tipo"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const esArchivo = radio.value === "archivo" && radio.checked;
    document.getElementById("imagen").style.display = esArchivo ? "none" : "";
    document.getElementById("imagen-archivo").style.display = esArchivo
      ? ""
      : "none";
  });
});

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

    const tipoImagen = document.querySelector(
      'input[name="imagen-tipo"]:checked',
    ).value;
    let imagenFinal;

    if (tipoImagen === "url") {
      const urlInput = document.getElementById("imagen");
      try {
        new URL(urlInput.value.trim());
        imagenFinal = urlInput.value.trim();
      } catch {
        marcarError(urlInput);
        errorEl.textContent = "URL de imagen inválida";
        return;
      }
    } else {
      const fileInput = document.getElementById("imagen-archivo");
      if (!fileInput.files.length) {
        marcarError(fileInput);
        errorEl.textContent = "Selecciona una imagen";
        return;
      }
      imagenFinal = await leerArchivo(fileInput.files[0]);
    }

    const producto = {
      id: Date.now(),
      nombre: document.getElementById("nombre").value.trim(),
      precio: Number(document.getElementById("precio").value),
      imagen: imagenFinal,
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
    document.getElementById("imagen").style.display = "";
    document.getElementById("imagen-archivo").style.display = "none";
    document.getElementById("imagen-tipo-url").checked = true;

    document.getElementById("alerta").innerHTML = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <i class="bi bi-check-circle me-2"></i>
      Producto <strong>${producto.nombre}</strong> registrado correctamente.
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  });

document.getElementById("footer").innerHTML = footer("../../../");
