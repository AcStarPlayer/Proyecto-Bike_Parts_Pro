import { navBar } from "../../componentes/barraNavegacion/barNav.js";
  const inputs = document.querySelectorAll(".fs-input, .fs-textarea");

  function marcarError(input) {
    input.style.border = "2px solid red";
  }

 const barraNav = document.querySelector(".nav-content");
barraNav.innerHTML = navBar("BikePartsPro","Sube de nivel","../../")
  function limpiarError(input) {
    input.style.border = "1px solid #cbd5e1";
  }

  form.addEventListener("submit", function(e) {

    inputs.forEach(input => limpiarError(input));

    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const telefonoInput = document.getElementById("telefono");
    const mensajeInput = document.getElementById("mensaje");

    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const mensaje = mensajeInput.value.trim();

    const error = document.getElementById("error");
    error.textContent = "";

    if (nombre.length < 3) {
      e.preventDefault();
      marcarError(nombreInput);
      error.textContent = "Nombre inválido";
      return;
    }

    if (!correo.includes("@")) {
      e.preventDefault();
      marcarError(correoInput);
      error.textContent = "Correo inválido";
      return;
    }

    if (isNaN(telefono)) {
      e.preventDefault();
      marcarError(telefonoInput);
      error.textContent = "Teléfono inválido";
      return;
    }

    if (mensaje.length < 10) {
      e.preventDefault();
      marcarError(mensajeInput);
      error.textContent = "Mensaje muy corto";
      return;
    }

  });
  navBar("bikePartsPro","sube de nivel")
