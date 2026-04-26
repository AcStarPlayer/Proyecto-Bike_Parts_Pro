import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import crearFormulario from "../../componentes/formulario/formulario.js";
import { validarInput } from "../../componentes/input/input.js";
import {
  chatbox,
  whatsappButton,
} from "../../componentes/whatsApp/whatsappBox.js";
import { footer } from "../../componentes/piecero/footer.js";

navBar("BikePartsPro", "Sube de nivel", "../../");

const campos = [
  { titulo: "Nombre", tipo: "text", placeholder: "Tu nombre", required: true },
  {
    titulo: "Correo",
    tipo: "email",
    placeholder: "tu@email.com",
    required: true,
  },
  {
    titulo: "Teléfono",
    tipo: "number",
    placeholder: "300 123 4567",
    required: true,
  },
  {
    titulo: "Mensaje",
    tipo: "full-text",
    placeholder: "Escribe tu mensaje",
    required: true,
  },
];

document.getElementById("contenedor-form").innerHTML = crearFormulario(
  "https://formsubmit.co/bikepartsprocolombia@gmail.com",
  campos,
  "Enviar mensaje",
);

function marcarError(input) {
  input.style.border = "2px solid red";
}
function limpiarError(input) {
  input.style.border = "1px solid #cbd5e1";
}

document.getElementById("formulario").addEventListener("submit", function (e) {
  document.querySelectorAll(".fs-input, .fs-textarea").forEach(limpiarError);
  const error = document.getElementById("error");
  error.textContent = "";

  for (const campo of campos) {
    const id = campo.titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const elemento = document.getElementById(id);
    const resultado = validarInput(elemento, campo.tipo);
    if (!resultado.valido) {
      e.preventDefault();
      marcarError(elemento);
      error.textContent = resultado.mensaje;
      return;
    }
  }
});

document.querySelector(".whatsapp-components").innerHTML =
  chatbox() + whatsappButton();
document.getElementById("footer").innerHTML = footer("../../");
