import crearInput from "../input/input.js";
import { botones } from "../botones/botones.js";

export default function crearFormulario(action, campos, tituloBoton = "Enviar") {
  const esUrl = typeof action === "string";
  
  const inputsHtml = campos
    .map(({ titulo, tipo, placeholder, required, options, mensajePersonalizado }) =>
      crearInput(titulo, tipo, placeholder, required, options, mensajePersonalizado)
    )
    .join("");

  const formAttrs = esUrl
    ? `action="${action}" method="POST" target="_top"`
    : `action=""`;

  const boton = botones(tituloBoton, "success", "submit");

  return `
    <form id="formulario" class="fs-form" ${formAttrs} novalidate>
      ${esUrl ? '<input type="hidden" name="_subject" value="Contacto - Solicitud Cliente" />' : ""}
      ${inputsHtml}
      <div class="text-center">
        ${boton}
      </div>
      <div id="alerta-contenedor" class="mt-3"></div>
    </form>
  `;
}