export function validarInput(elemento, tipo) {
  const valor = elemento.value.trim();
  const validaciones = {
    text: () => valor.length >= 3 || "Mínimo 3 caracteres",
    email: () => valor.includes("@") || "Correo inválido",
    number: () => (!isNaN(valor) && valor !== "") || "Solo números",
    "full-text": () => valor.length >= 10 || "Mínimo 10 caracteres",
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
  const types = {
    text: "input",
    email: "input",
    number: "input",
    "full-text": "textarea",
  };

  const tag = types[tipo];
  const id = titulo.toLowerCase();
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
            type="${tipo}"
            id="${id}"
            name="${id}"
            ${placeholderAttr}
            ${requiredAttr}
          />
        </div>
    `;
}
