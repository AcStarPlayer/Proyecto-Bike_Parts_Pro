import select from "../select/select.js";

export function validarInput(elemento, tipo) {
  const valor = elemento.value.trim();

  if (tipo === "password") {
    const errores = [];
    if (valor.length < 8) errores.push("Mínimo 8 caracteres");
    if (!/[A-Z]/.test(valor)) errores.push("Al menos una mayúscula");
    if (!/[a-z]/.test(valor)) errores.push("Al menos una minúscula");
    if (!/[0-9]/.test(valor)) errores.push("Al menos un número");
    if (!/[!@#$%^&*()\-_,.?":{}|<>]/.test(valor)) errores.push("Al menos un carácter especial");
    return errores.length === 0 ? { valido: true, mensajes: [] } : { valido: false, mensajes: errores };
  }

  const validaciones = {
    text: () => valor.length >= 3 || "Mínimo 3 caracteres",
    codigo: () => (valor.length >= 3 && valor.length <= 20) || "El código debe tener entre 3 y 20 caracteres",
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
    select: () => valor !== "" || "Selecciona una opción",
  };

  const resultado = validaciones[tipo]?.();
  if (resultado === true || resultado === undefined) return { valido: true, mensajes: [] };
  return { valido: false, mensajes: [resultado] };
}

export default function crearInput(
  titulo,
  tipo,
  placeholder = null,
  required = null,
  options = null
) {
  if (tipo === "select") {
    return select(titulo, options);
  }

  const types = {
    text: "input",
    codigo: "input",
    email: "input",
    number: "input",
    url: "input",
    password: "input",
    "full-text": "textarea",
  };

  const tag = types[tipo];
  const htmlType = tipo === "codigo" ? "text" : tipo;
  const id = titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
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
