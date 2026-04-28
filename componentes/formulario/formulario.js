import crearInput, { validarInput } from "../input/input.js";
import { botones } from "../botones/botones.js";

const TIPOS_SIN_INPUT = ["colores", "imagen"];

export function validarFormulario(campos) {
  document.querySelectorAll(".fs-input, .fs-textarea").forEach((el) => {
    el.style.border = "";
  });

  const errores = [];

  for (const campo of campos) {
    if (!campo.required || TIPOS_SIN_INPUT.includes(campo.tipo)) continue;

    const id = campo.titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

    const elemento = document.getElementById(id);
    if (!elemento) continue;

    const resultado = validarInput(elemento, campo.tipo);
    if (!resultado.valido) {
      elemento.style.border = "1px solid red";
      if (campo.mensajePersonalizado) {
        errores.push(campo.mensajePersonalizado);
      } else {
        errores.push(...resultado.mensajes);
      }
    }
  }

  return errores;
}

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
