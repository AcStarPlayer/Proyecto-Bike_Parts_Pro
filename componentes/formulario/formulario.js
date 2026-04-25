import crearInput from "../input/input.js";

export default function crearFormulario(action, campos, boton = "Enviar") {
  const esUrl = typeof action === "string";
  const inputsHtml = campos
    .map(({ titulo, tipo, placeholder, required, options }) =>
      crearInput(titulo, tipo, placeholder, required, options)
    )
    .join("");

  const formAttrs = esUrl
    ? `action="${action}" method="POST" target="_top"`
    : `action=""`;

  return `
    <form id="formulario" ${formAttrs}>
      ${esUrl ? '<input type="hidden" name="_subject" value="Contacto - Solicitud Cliente" />' : ""}
      ${inputsHtml}
      <div class="text-center mt-3">
        <button type="submit" class="btn btn-success">${boton}</button>
      </div>
      <p id="error" class="text-danger text-center mt-2"></p>
    </form>
  `;
}
