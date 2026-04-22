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
) {
  if (tipo === "imagen") {
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
