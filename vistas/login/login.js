import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/pieDePagina/footer.js";
import {
  guardarSesion,
  construirSesionDesdeUsuario,
  redirigirSegunSesion,
} from "../../autorizaciones/autorizaciones.js";
import {
  TIEMPO_CODIGO_MS,
  enviarCodigoSimulado,
  validarCodigoSimulado,
  eliminarCodigoSimulado,
} from "../../autorizaciones/codigoVerificacion.js";
import {
  solicitarRecuperacion,
  validarSolicitudRecuperacion,
  marcarRecuperacionComoUsada,
  limpiarRecuperacion,
} from "../../autorizaciones/recuperacionContrasena.js";

navBar("BikePartsPro", "../../");
document.getElementById("footer").innerHTML = footer("../../");

const CLAVE_USUARIOS = "usuariosBikePartsPro";

const CODIGOS_CLIENTE_FIEL = ["111222", "333444", "555666"];
const CODIGOS_CLIENTE_PREMIUM = ["123456", "789012", "345678"];
const CODIGOS_ADMIN_AUXILIAR = ["999888", "777666", "555444"];

const vistaLogin = document.getElementById("vista-login");
const vistaSignin = document.getElementById("vista-signin");
const vistaRecuperacion = document.getElementById("vista-recuperacion");

const formularioLogin = document.getElementById("formulario-login");
const formularioDatosRegistro = document.getElementById("form-datos-registro");
const formularioCodigoVerificacion = document.getElementById("form-codigo-verificacion");

const formularioRecuperacionSolicitud = document.getElementById("form-recuperacion-solicitud");
const formularioRecuperacionCambio = document.getElementById("form-recuperacion-cambio");

const pasoRegistroDatos = document.getElementById("paso-registro-datos");
const pasoCodigoVerificacion = document.getElementById("paso-codigo-verificacion");

const pasoRecuperacionSolicitud = document.getElementById("paso-recuperacion-solicitud");
const pasoRecuperacionCambio = document.getElementById("paso-recuperacion-cambio");

const linkSignin = document.getElementById("link-signin");
const linkVolverLogin = document.getElementById("volver-login");
const linkVolverLoginDesdeRegistro = document.getElementById("volver-login-desde-registro");
const linkVolverDatosRegistro = document.getElementById("volver-datos-registro");
const linkRecuperar = document.getElementById("link-recuperar");

const linkVolverLoginDesdeRecuperacion = document.getElementById("volver-login-desde-recuperacion");
const linkVolverSolicitudRecuperacion = document.getElementById("volver-solicitud-recuperacion");
const linkCancelarRecuperacion = document.getElementById("cancelar-recuperacion");

const botonReenviarCodigo = document.getElementById("reenviar-codigo");
const botonReenviarRecuperacion = document.getElementById("reenviar-recuperacion");

const emailConfirmado = document.getElementById("email-confirmado");
const emailRecuperacionConfirmado = document.getElementById("email-recuperacion-confirmado");
const contadorTiempo = document.getElementById("contador-tiempo");

const mensajeLogin = document.getElementById("mensaje-login");
const mensajeRegistroPaso1 = document.getElementById("mensaje-registro-paso1");
const mensajeRegistroPaso2 = document.getElementById("mensaje-registro-paso2");
const mensajeRecuperacionSolicitud = document.getElementById("mensaje-recuperacion-solicitud");
const mensajeRecuperacionCambio = document.getElementById("mensaje-recuperacion-cambio");

let contadorInterval = null;
let tiempoRestante = 0;
let datosRegistroPendiente = null;
let emailRecuperacionPendiente = "";

function limpiarMensaje(elemento) {
  if (!elemento) return;
  elemento.className = "d-none";
  elemento.textContent = "";
}

function limpiarTodosLosMensajes() {
  limpiarMensaje(mensajeLogin);
  limpiarMensaje(mensajeRegistroPaso1);
  limpiarMensaje(mensajeRegistroPaso2);
  limpiarMensaje(mensajeRecuperacionSolicitud);
  limpiarMensaje(mensajeRecuperacionCambio);
}

function mostrarMensaje(elemento, tipo, texto) {
  if (!elemento) return;
  elemento.classList.remove(
    "d-none",
    "alert-success",
    "alert-danger",
    "alert-warning",
    "alert-info"
  );
  elemento.classList.add("alert", `alert-${tipo}`);
  elemento.textContent = texto;
}

function detenerContador() {
  if (contadorInterval) {
    clearInterval(contadorInterval);
    contadorInterval = null;
  }
}

function resetearContadorVisual() {
  if (contadorTiempo) {
    contadorTiempo.textContent = `${TIEMPO_CODIGO_MS / 1000}s`;
  }
}

function actualizarHash(hash = "") {
  const nuevaUrl = `${window.location.pathname}${window.location.search}${hash}`;
  window.history.replaceState({}, "", nuevaUrl);
}

function ocultarTodasLasVistas() {
  vistaLogin.classList.add("d-none");
  vistaSignin.classList.add("d-none");
  vistaRecuperacion.classList.add("d-none");
}

function mostrarVistaLogin() {
  ocultarTodasLasVistas();
  vistaLogin.classList.remove("d-none");
  actualizarHash("");
}

function mostrarVistaSignin() {
  ocultarTodasLasVistas();
  vistaSignin.classList.remove("d-none");
  mostrarPasoRegistroDatos();
  actualizarHash("#signin");
}

function mostrarVistaRecuperacion() {
  ocultarTodasLasVistas();
  vistaRecuperacion.classList.remove("d-none");
  mostrarPasoRecuperacionSolicitud();
  actualizarHash("#recuperacion");
}

function mostrarPasoRegistroDatos() {
  formularioDatosRegistro.classList.remove("d-none");
  pasoCodigoVerificacion.classList.add("d-none");
}

function mostrarPasoRegistroCodigo() {
  formularioDatosRegistro.classList.add("d-none");
  pasoCodigoVerificacion.classList.remove("d-none");
}

function mostrarPasoRecuperacionSolicitud() {
  pasoRecuperacionSolicitud.classList.remove("d-none");
  pasoRecuperacionCambio.classList.add("d-none");
}

function mostrarPasoRecuperacionCambio() {
  pasoRecuperacionSolicitud.classList.add("d-none");
  pasoRecuperacionCambio.classList.remove("d-none");
}

function resolverVistaInicial() {
  if (window.location.hash === "#signin") {
    mostrarVistaSignin();
    mostrarPasoRegistroDatos();
    return;
  }

  if (window.location.hash === "#recuperacion") {
    mostrarVistaRecuperacion();
    return;
  }

  mostrarVistaLogin();
}

function limpiarCamposLogin() {
  if (formularioLogin) formularioLogin.reset();
  limpiarMensaje(mensajeLogin);
}

function limpiarCamposRegistroPaso1() {
  if (formularioDatosRegistro) formularioDatosRegistro.reset();
  limpiarMensaje(mensajeRegistroPaso1);
}

function limpiarCamposRegistroPaso2() {
  if (formularioCodigoVerificacion) formularioCodigoVerificacion.reset();
  if (emailConfirmado) emailConfirmado.textContent = "";
  limpiarMensaje(mensajeRegistroPaso2);
  detenerContador();
  resetearContadorVisual();
}

function limpiarFlujoRegistroCompleto() {
  limpiarCamposRegistroPaso1();
  limpiarCamposRegistroPaso2();
  datosRegistroPendiente = null;
  mostrarPasoRegistroDatos();
}

function limpiarCamposRecuperacionSolicitud() {
  if (formularioRecuperacionSolicitud) formularioRecuperacionSolicitud.reset();
  limpiarMensaje(mensajeRecuperacionSolicitud);
}

function limpiarCamposRecuperacionCambio() {
  if (formularioRecuperacionCambio) formularioRecuperacionCambio.reset();
  if (emailRecuperacionConfirmado) emailRecuperacionConfirmado.textContent = "";
  limpiarMensaje(mensajeRecuperacionCambio);
}

function limpiarFlujoRecuperacionCompleto() {
  limpiarCamposRecuperacionSolicitud();
  limpiarCamposRecuperacionCambio();
  if (emailRecuperacionPendiente) {
    limpiarRecuperacion(emailRecuperacionPendiente);
  }
  emailRecuperacionPendiente = "";
  mostrarPasoRecuperacionSolicitud();
}

function limpiarCamposAcceso() {
  limpiarCamposLogin();
  limpiarFlujoRegistroCompleto();
  limpiarFlujoRecuperacionCompleto();
}

function obtenerUsuarios() {
  try {
    const data = localStorage.getItem(CLAVE_USUARIOS);
    const usuarios = JSON.parse(data || "[]");
    return Array.isArray(usuarios) ? usuarios : [];
  } catch {
    return [];
  }
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function guardarUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  usuarios.push(usuario);
  guardarUsuarios(usuarios);
}

function actualizarPasswordUsuario(email, nuevaPassword) {
  const emailNormalizado = email.trim().toLowerCase();
  const usuarios = obtenerUsuarios();
  const indice = usuarios.findIndex(
    (usuario) => (usuario.email || "").trim().toLowerCase() === emailNormalizado
  );

  if (indice === -1) {
    return false;
  }

  usuarios[indice].password = nuevaPassword;
  usuarios[indice].fechaActualizacionPassword = new Date().toISOString();
  guardarUsuarios(usuarios);
  return true;
}

function usuarioExiste(email) {
  const emailNormalizado = email.trim().toLowerCase();
  return obtenerUsuarios().some(
    (usuario) => (usuario.email || "").trim().toLowerCase() === emailNormalizado
  );
}

function validarTelefono(telefono) {
  return /^[0-9]{10,}$/.test(telefono);
}

function validarPassword(password, confirmPassword) {
  if (!password || !confirmPassword) {
    return "Debes completar ambos campos de contraseña";
  }

  if (password !== confirmPassword) {
    return "Las contraseñas no coinciden";
  }

  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres";
  }

  return "";
}

function inicializarNavegacionEntreVistas() {
  linkSignin?.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarTodosLosMensajes();
    limpiarCamposLogin();
    limpiarFlujoRegistroCompleto();
    limpiarFlujoRecuperacionCompleto();
    mostrarVistaSignin();
  });

  linkVolverLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarTodosLosMensajes();
    limpiarFlujoRegistroCompleto();
    limpiarFlujoRecuperacionCompleto();
    mostrarVistaLogin();
  });

  linkVolverLoginDesdeRegistro?.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarTodosLosMensajes();
    limpiarFlujoRegistroCompleto();
    limpiarFlujoRecuperacionCompleto();
    mostrarVistaLogin();
  });

  linkVolverDatosRegistro?.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRegistroPaso2);
    if (formularioCodigoVerificacion) formularioCodigoVerificacion.reset();
    detenerContador();
    resetearContadorVisual();
    mostrarPasoRegistroDatos();
  });

  botonReenviarCodigo?.addEventListener("click", (e) => {
    e.preventDefault();

    const email = emailConfirmado.textContent.trim();

    if (!email || !datosRegistroPendiente) {
      mostrarMensaje(
        mensajeRegistroPaso2,
        "warning",
        "No hay correo pendiente para reenviar"
      );
      return;
    }

    enviarCodigoSimulado(email);
    iniciarContador();

    mostrarMensaje(
      mensajeRegistroPaso2,
      "success",
      "Nuevo código enviado. Tienes 120 segundos para usarlo."
    );
  });

  linkRecuperar?.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarTodosLosMensajes();
    limpiarCamposLogin();
    limpiarFlujoRegistroCompleto();
    limpiarFlujoRecuperacionCompleto();
    mostrarVistaRecuperacion();
  });

  linkVolverLoginDesdeRecuperacion?.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarTodosLosMensajes();
    limpiarFlujoRecuperacionCompleto();
    mostrarVistaLogin();
  });

  linkVolverSolicitudRecuperacion?.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRecuperacionCambio);
    limpiarCamposRecuperacionCambio();
    mostrarPasoRecuperacionSolicitud();
  });

  linkCancelarRecuperacion?.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarTodosLosMensajes();
    limpiarFlujoRecuperacionCompleto();
    mostrarVistaLogin();
  });

  botonReenviarRecuperacion?.addEventListener("click", (e) => {
    e.preventDefault();

    if (!emailRecuperacionPendiente) {
      mostrarMensaje(
        mensajeRecuperacionCambio,
        "warning",
        "No hay una solicitud de recuperación pendiente."
      );
      return;
    }

    const resultado = solicitarRecuperacion(emailRecuperacionPendiente);

    if (!resultado.ok) {
      mostrarMensaje(mensajeRecuperacionCambio, "danger", resultado.message);
      return;
    }

    mostrarMensaje(
      mensajeRecuperacionCambio,
      "success",
      "Se generó un nuevo token de recuperación."
    );
  });

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#signin") {
      mostrarVistaSignin();
      if (pasoCodigoVerificacion.classList.contains("d-none")) {
        mostrarPasoRegistroDatos();
      }
      return;
    }

    if (window.location.hash === "#recuperacion") {
      mostrarVistaRecuperacion();
      return;
    }

    mostrarVistaLogin();
  });
}

function inicializarLogin() {
  formularioLogin?.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeLogin);

    const email = document.getElementById("email-login").value.trim().toLowerCase();
    const password = document.getElementById("password-login").value;

    const usuario = obtenerUsuarios().find(
      (u) =>
        (u.email || "").trim().toLowerCase() === email &&
        (u.password || "") === password
    );

    if (!usuario) {
      mostrarMensaje(mensajeLogin, "danger", "Correo o contraseña incorrectos");
      return;
    }

    const sesion = construirSesionDesdeUsuario(usuario);
    guardarSesion(sesion);
    redirigirSegunSesion(sesion, "../../");
  });
}

function inicializarRegistroPaso1() {
  formularioDatosRegistro?.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRegistroPaso1);

    const nombre = document.getElementById("nombre-registro").value.trim();
    const telefono = document.getElementById("telefono-registro").value.trim();
    const email = document.getElementById("email-registro").value.trim().toLowerCase();

    if (!nombre || !telefono || !email) {
      mostrarMensaje(
        mensajeRegistroPaso1,
        "warning",
        "Completa todos los campos requeridos"
      );
      return;
    }

    if (!validarTelefono(telefono)) {
      mostrarMensaje(
        mensajeRegistroPaso1,
        "warning",
        "El número de teléfono debe tener mínimo 10 dígitos"
      );
      return;
    }

    if (usuarioExiste(email)) {
      mostrarMensaje(
        mensajeRegistroPaso1,
        "warning",
        "Este correo ya está registrado"
      );
      return;
    }

    datosRegistroPendiente = { nombre, telefono, email };

    enviarCodigoSimulado(email);
    emailConfirmado.textContent = email;
    mostrarPasoRegistroCodigo();
    iniciarContador();

    mostrarMensaje(
      mensajeRegistroPaso2,
      "info",
      "Te enviamos un código de verificación. Revísalo e ingrésalo para completar el registro."
    );
  });
}

function inicializarRegistroPaso2() {
  formularioCodigoVerificacion?.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRegistroPaso2);

    if (!datosRegistroPendiente) {
      mostrarMensaje(
        mensajeRegistroPaso2,
        "warning",
        "Primero completa los datos básicos del registro"
      );
      mostrarPasoRegistroDatos();
      return;
    }

    const codigoIngresado = document.getElementById("codigo-verificacion").value.trim();
    const password = document.getElementById("password-registro").value;
    const confirmPassword = document.getElementById("confirm-password-registro").value;
    const email = datosRegistroPendiente.email;

    const esCodigoDinamicoValido = validarCodigoSimulado(email, codigoIngresado);
    const esCodigoClienteFiel = CODIGOS_CLIENTE_FIEL.includes(codigoIngresado);
    const esCodigoClientePremium = CODIGOS_CLIENTE_PREMIUM.includes(codigoIngresado);
    const esCodigoAdminAuxiliar = CODIGOS_ADMIN_AUXILIAR.includes(codigoIngresado);

    if (
      !esCodigoDinamicoValido &&
      !esCodigoClienteFiel &&
      !esCodigoClientePremium &&
      !esCodigoAdmin_AUXILIAR
    ) {
      mostrarMensaje(mensajeRegistroPaso2, "danger", "Código incorrecto");
      return;
    }

    const errorPassword = validarPassword(password, confirmPassword);
    if (errorPassword) {
      mostrarMensaje(mensajeRegistroPaso2, "warning", errorPassword);
      return;
    }

    let rol = "cliente";
    let clienteFiel = false;
    let clientePremium = false;
    let adminAuxiliar = false;

    if (esCodigoClienteFiel) {
      clienteFiel = true;
    } else if (esCodigoClientePremium) {
      clientePremium = true;
    } else if (esCodigoAdminAuxiliar) {
      rol = "admin";
      adminAuxiliar = true;
    }

    const nuevoUsuario = {
      nombre: datosRegistroPendiente.nombre,
      email: datosRegistroPendiente.email,
      telefono: datosRegistroPendiente.telefono,
      password,
      rol,
      clienteFiel,
      clientePremium,
      adminAuxiliar,
      fechaRegistro: new Date().toISOString(),
    };

    guardarUsuario(nuevoUsuario);
    eliminarCodigoSimulado(email);

    const nombreUsuario = nuevoUsuario.nombre;

    limpiarFlujoRegistroCompleto();
    limpiarCamposLogin();
    mostrarVistaLogin();

    if (adminAuxiliar) {
      mostrarMensaje(
        mensajeLogin,
        "success",
        `¡${nombreUsuario}! Tu cuenta fue creada como Admin Auxiliar. Ahora inicia sesión.`
      );
      return;
    }

    if (clientePremium) {
      mostrarMensaje(
        mensajeLogin,
        "success",
        `¡${nombreUsuario}! Tu cuenta fue creada como Cliente Premium. Ahora inicia sesión.`
      );
      return;
    }

    if (clienteFiel) {
      mostrarMensaje(
        mensajeLogin,
        "success",
        `¡${nombreUsuario}! Tu cuenta fue creada como Cliente Fiel. Ahora inicia sesión.`
      );
      return;
    }

    mostrarMensaje(
      mensajeLogin,
      "success",
      `¡${nombreUsuario}! Tu cuenta fue creada como Cliente. Ahora inicia sesión.`
    );
  });
}

function iniciarContador() {
  detenerContador();
  tiempoRestante = TIEMPO_CODIGO_MS / 1000;

  if (contadorTiempo) {
    contadorTiempo.textContent = `${tiempoRestante}s`;
  }

  contadorInterval = setInterval(() => {
    tiempoRestante -= 1;

    if (contadorTiempo) {
      contadorTiempo.textContent = `${tiempoRestante}s`;
    }

    if (tiempoRestante <= 0) {
      detenerContador();
      mostrarMensaje(
        mensajeRegistroPaso2,
        "warning",
        "Código expirado. Solicita uno nuevo."
      );
      formularioCodigoVerificacion.reset();
      emailConfirmado.textContent = "";
      resetearContadorVisual();
      mostrarPasoRegistroDatos();
    }
  }, 1000);
}

function inicializarRecuperacionSolicitud() {
  formularioRecuperacionSolicitud?.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRecuperacionSolicitud);

    const email = document.getElementById("email-recuperacion").value.trim().toLowerCase();

    if (!email) {
      mostrarMensaje(
        mensajeRecuperacionSolicitud,
        "warning",
        "Debes ingresar un correo electrónico válido."
      );
      return;
    }

    if (!usuarioExiste(email)) {
      mostrarMensaje(
        mensajeRecuperacionSolicitud,
        "warning",
        "No existe una cuenta registrada con ese correo."
      );
      return;
    }

    const resultado = solicitarRecuperacion(email);

    if (!resultado.ok) {
      mostrarMensaje(mensajeRecuperacionSolicitud, "danger", resultado.message);
      return;
    }

    emailRecuperacionPendiente = email;
    emailRecuperacionConfirmado.textContent = email;
    mostrarPasoRecuperacionCambio();

    mostrarMensaje(
      mensajeRecuperacionCambio,
      "info",
      "Se simuló el envío del correo. Usa el token generado en la consola para continuar."
    );
  });
}

function inicializarRecuperacionCambio() {
  formularioRecuperacionCambio?.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRecuperacionCambio);

    if (!emailRecuperacionPendiente) {
      mostrarMensaje(
        mensajeRecuperacionCambio,
        "warning",
        "Primero solicita la recuperación de contraseña."
      );
      mostrarPasoRecuperacionSolicitud();
      return;
    }

    const tokenIngresado = document.getElementById("token-recuperacion").value.trim();
    const nuevaPassword = document.getElementById("nueva-password").value;
    const confirmarNuevaPassword = document.getElementById("confirmar-nueva-password").value;

    if (!tokenIngresado) {
      mostrarMensaje(
        mensajeRecuperacionCambio,
        "warning",
        "Debes ingresar el token o código de recuperación."
      );
      return;
    }

    const errorPassword = validarPassword(nuevaPassword, confirmarNuevaPassword);
    if (errorPassword) {
      mostrarMensaje(mensajeRecuperacionCambio, "warning", errorPassword);
      return;
    }

    const validacion = validarSolicitudRecuperacion(
      emailRecuperacionPendiente,
      tokenIngresado
    );

    if (!validacion.ok) {
      mostrarMensaje(mensajeRecuperacionCambio, "danger", validacion.message);
      return;
    }

    const actualizado = actualizarPasswordUsuario(
      emailRecuperacionPendiente,
      nuevaPassword
    );

    if (!actualizado) {
      mostrarMensaje(
        mensajeRecuperacionCambio,
        "danger",
        "No fue posible actualizar la contraseña del usuario."
      );
      return;
    }

    marcarRecuperacionComoUsada(emailRecuperacionPendiente);
    limpiarRecuperacion(emailRecuperacionPendiente);

    const emailActualizado = emailRecuperacionPendiente;

    limpiarFlujoRecuperacionCompleto();
    limpiarCamposLogin();
    mostrarVistaLogin();

    mostrarMensaje(
      mensajeLogin,
      "success",
      `Contraseña actualizada correctamente para ${emailActualizado}. Ahora puedes iniciar sesión.`
    );
  });
}

function inicializarLoginPage() {
  resolverVistaInicial();
  mostrarPasoRegistroDatos();
  mostrarPasoRecuperacionSolicitud();
  limpiarTodosLosMensajes();
  resetearContadorVisual();

  inicializarNavegacionEntreVistas();
  inicializarLogin();
  inicializarRegistroPaso1();
  inicializarRegistroPaso2();
  inicializarRecuperacionSolicitud();
  inicializarRecuperacionCambio();
}

inicializarLoginPage();