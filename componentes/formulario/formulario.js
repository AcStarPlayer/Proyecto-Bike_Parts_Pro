import crearInput from "../input/input.js";
import { botones } from "../botones/botones.js";

export default function crearFormulario(action, campos, tituloBoton = "Enviar") {
  const esUrl = typeof action === "string";
  const inputsHtml = campos
    .map(({ titulo, tipo, placeholder, required, options }) =>
      crearInput(titulo, tipo, placeholder, required, options)
    )
    .join("");

  const formAttrs = esUrl
    ? `action="${action}" method="POST" target="_top"`
    : `action=""`;
  const boton = botones(tituloBoton, "success", "submit"); 
  /*const boton = botones(tituloBoton);*/
  return `
    
    <form id="formulario" class="fs-form" ${formAttrs}>
      
      ${esUrl ? '<input type="hidden" name="_subject" value="Contacto - Solicitud Cliente" />' : ""}
      ${inputsHtml}
      <div class="text-center">
        ${boton}
      </div>
      <p id="error" class="text-danger text-center mt-2"></p>
    </form>
  `;
}
