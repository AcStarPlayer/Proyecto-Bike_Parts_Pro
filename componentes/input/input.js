import select from "../select/select.js";

export function validarInput(elemento, tipo) {
  const valor = elemento.value.trim();
  const validaciones = {
    text: () => valor.length >= 3 || "Mínimo 3 caracteres",
    codigo: () =>
      (valor.length >= 3 && valor.length <= 20) ||
      "El codigo debe tener entre 3 y 20 caracteres",
    email: () => valor.includes("@") || "Correo inválido",
    number: () => (!isNaN(valor) && valor !== "") || "Solo números",
    "full-text": () => valor.length >= 10 || "Mínimo 10 caracteres",
    url: () => {
      try {
        new URL(valor);
        return true;
      } catch {
        return "URL inválida";
      }
    },
    array: () =>
      (Array.isArray(valor) && valor.length > 0) || "El listado no puede estar vacío",
    select: () => valor !== "" || "Selecciona una opción",
  };
  const resultado = validaciones[tipo]?.();
  return resultado === true
    ? { valido: true }
    : { valido: false, mensaje: resultado };
}

export default function crearInput(
  titulo,
  tipo,
  placeholder = null,
  required = null,
  options = null
) {
  if (tipo === "colores") {
    return `
      <div class="fs-field">
        <label class="fs-label">${titulo}</label>
        <div id="colores-lista"></div>
        <button type="button" id="btn-agregar-color" class="btn btn-outline-secondary btn-sm mt-2">
          <i class="bi bi-plus-circle me-1"></i>Agregar color
        </button>
      </div>
    `;
  }
  if (tipo === "imagen" && titulo) {
    return `
      <div class="fs-field">
        <label class="fs-label">${titulo}</label>
        <div id="imagenes-lista"></div>
        <button type="button" id="btn-agregar-imagen" class="btn btn-outline-secondary btn-sm mt-2">
          <i class="bi bi-plus-circle me-1"></i>Agregar imagen
        </button>
      </div>
    `;
  }
  if (tipo === "select") {
    return select(titulo, options);
  }

  const types = {
    text: "input",
    codigo: "input",
    email: "input",
    number: "input",
    url: "input",
    "full-text": "textarea",
  };

  const tag = types[tipo];
  const htmlType = tipo === "codigo" ? "text" : tipo;
  const id = titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const placeholderAttr = placeholder ? `placeholder="${placeholder}"` : "";
  const requiredAttr = required ? "required" : "";

  if (tag === "textarea") {
    return `
        <div class="fs-field">
          <label class="fs-label" for="${id}">${titulo}</label>
          <textarea
            class="fs-textarea"
            id="${id}"
            name="${id}"
            ${placeholderAttr}
            ${requiredAttr}
          ></textarea>
        </div>
    `;
  }

  return `
        <div class="fs-field">
          <label class="fs-label" for="${id}">${titulo}</label>
          <input
            class="fs-input"
            type="${htmlType}"
            id="${id}"
            name="${id}"
            ${placeholderAttr}
            ${requiredAttr}
          />
        </div>
    `;
}
