export function validarInput(elemento, tipo) {
  const valor = elemento.value.trim();
  const validaciones = {
    text: () => valor.length >= 3 || "Mínimo 3 caracteres",
    email: () => valor.includes("@") || "Correo inválido",
    number: () => (!isNaN(valor) && valor !== "") || "Solo números",
    "full-text": () => valor.length >= 10 || "Mínimo 10 caracteres",
    url: () => { try { new URL(valor); return true; } catch { return "URL inválida"; } },
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
    const urlPlaceholder = placeholder || "https://ejemplo.com/imagen.jpg";
    return `
      <div class="fs-field">
        <label class="fs-label">${titulo}</label>
        <div class="mb-2">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="imagen-tipo" id="imagen-tipo-url" value="url" checked>
            <label class="form-check-label" for="imagen-tipo-url">Enlace (URL)</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="imagen-tipo" id="imagen-tipo-archivo" value="archivo">
            <label class="form-check-label" for="imagen-tipo-archivo">Archivo</label>
          </div>
        </div>
        <input class="fs-input" type="url" id="imagen" name="imagen" placeholder="${urlPlaceholder}" />
        <input class="fs-input" type="file" id="imagen-archivo" name="imagen-archivo" accept="image/*" style="display:none" />
      </div>
    `;
  }

  const types = {
    text: "input",
    email: "input",
    number: "input",
    url: "input",
    "full-text": "textarea",
  };

  const tag = types[tipo];
  const id = titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
