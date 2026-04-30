import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import crearFormulario, { validarFormulario } from "../../componentes/formulario/formulario.js";
import {
  chatbox,
  whatsappButton,
} from "../../componentes/whatsApp/whatsappBox.js";
import { footer } from "../../componentes/pieDePagina/footer.js";
import { inicializarBotonesCarrito } from "../carrito/carrito-events.js";
import alertas from "../../componentes/alertas/alertas.js";

navBar("Sube de nivel", "../../");

const campos = [
  {
    titulo: "Nombre",
    tipo: "text",
    placeholder: "Tu nombre",
    required: true,
    mensajePersonalizado: "Ingresa el campo nombre",
  },
  {
    titulo: "Correo",
    tipo: "email",
    placeholder: "tu@email.com",
    required: true,
    mensajePersonalizado: "Ingresa un correo válido",
  },
  {
    titulo: "Teléfono",
    tipo: "number",
    placeholder: "300 123 4567",
    required: true,
    mensajePersonalizado: "Ingresa un número telefónico válido",
  },
  {
    titulo: "Mensaje",
    tipo: "full-text",
    placeholder: "Escribe tu mensaje",
    required: true,
    mensajePersonalizado: "Escribe tu mensaje",
  },
];

document.getElementById("contenedor-form").innerHTML = crearFormulario(
  "https://formsubmit.co/bikepartsprocolombia@gmail.com",
  campos,
  "Enviar mensaje",
);

document.getElementById("formulario").addEventListener("submit", function (e) {
  const alertaContenedor = document.getElementById("alerta-contenedor");
  alertaContenedor.innerHTML = "";

  const errores = validarFormulario(campos);

  if (errores.length > 0) {
    e.preventDefault();
    const mensaje = errores.length === 1
      ? errores[0]
      : `<ul class="mb-0 ps-3">${errores.map((err) => `<li>${err}</li>`).join("")}</ul>`;
    alertaContenedor.innerHTML = alertas(mensaje, "danger", "Atención");
  }
});

document.querySelector(".whatsapp-components").innerHTML =
  chatbox() + whatsappButton();
document.getElementById("footer").innerHTML = footer("../../");

inicializarBotonesCarrito();
