import crearInput from "../input/input.js";

export default function crearFormulario(action, campos, boton = "Enviar") {
  const inputsHtml = campos
    .map(({ titulo, tipo, placeholder, required }) =>
      crearInput(titulo, tipo, placeholder, required)
    )
    .join("");

  return `
    <form id="formulario" action="${action}" method="POST" target="_top">
      <input type="hidden" name="_subject" value="Contacto - Solicitud Cliente" />
      ${inputsHtml}
      <div class="text-center mt-3">
        <button type="submit" class="btn btn-success">${boton}</button>
      </div>
      <p id="error" class="text-danger text-center mt-2"></p>
    </form>
  `;
}
