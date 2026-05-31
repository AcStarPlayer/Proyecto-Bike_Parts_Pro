import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/pieDePagina/footer.js";
import {
  guardarSesion,
  redirigirSegunSesion,
  guardarToken,
} from "../../autorizaciones/autorizaciones.js";
import {
  TIEMPO_CODIGO_MS,
  enviarCodigoReal,
  reenviarCodigoReal,
  validarCodigoReal,
} from "../../autorizaciones/codigoVerificacion.js";
import {
  solicitarRecuperacion,
  validarSolicitudRecuperacion,
  marcarRecuperacionComoUsada,
  limpiarRecuperacion,
} from "../../autorizaciones/recuperacionContrasena.js";
import { API_BASE_URL } from "../../config/api.js";

navBar("BikePartsPro", "../../");
document.getElementById("footer").innerHTML = footer("../../");

const vistaLogin = document.getElementById("vista-login");
const vistaSignin = document.getElementById("vista-signin");
const vistaRecuperacion = document.getElementById("vista-recuperacion");

const formularioLogin = document.getElementById("formulario-login");
const formularioDatosRegistro = document.getElementById("form-datos-registro");
const formularioCodigoVerificacion = document.getElementById("form-codigo-verificacion");
const formularioRecuperacionSolicitud = document.getElementById("form-recuperacion-solicitud");
const formularioRecuperacionCambio = document.getElementById("form-recuperacion-cambio");

const pasoCodigoVerificacion = document.getElementById("paso-codigo-verificacion");
const pasoRecuperacionSolicitud = document.getElementById("paso-recuperacion-solicitud");
const pasoRecuperacionCambio = document.getElementById("paso-recuperacion-cambio");

const linkSignin = document.getElementById("link-signin");
const linkVolverLogin = document.getElementById("volver-login");
const linkVolverLoginDesdeRegistro = document.getElementById("volver-login-desde-registro");
const linkVolverDatosRegistro = document.getElementById("volver-datos-registro");
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

function limpiarMensaje(el) {
  if (!el) return;
  el.className = "d-none";
  el.textContent = "";
}

function limpiarTodosLosMensajes() {
  [mensajeLogin, mensajeRegistroPaso1, mensajeRegistroPaso2,
   mensajeRecuperacionSolicitud, mensajeRecuperacionCambio].forEach(limpiarMensaje);
}

function mostrarMensaje(el, tipo, texto) {
  if (!el) return;
  el.classList.remove("d-none", "alert-success", "alert-danger", "alert-warning", "alert-info");
  el.classList.add("alert", `alert-${tipo}`);
  el.textContent = texto;
}

function detenerContador() {
  if (contadorInterval) { clearInterval(contadorInterval); contadorInterval = null; }
}

function resetearContadorVisual() {
  if (contadorTiempo) contadorTiempo.textContent = `${TIEMPO_CODIGO_MS / 1000}s`;
}

function iniciarContador() {
  detenerContador();
  tiempoRestante = TIEMPO_CODIGO_MS / 1000;
  if (contadorTiempo) contadorTiempo.textContent = `${tiempoRestante}s`;
  contadorInterval = setInterval(() => {
    tiempoRestante -= 1;
    if (contadorTiempo) contadorTiempo.textContent = `${tiempoRestante}s`;
    if (tiempoRestante <= 0) {
      detenerContador();
      mostrarMensaje(mensajeRegistroPaso2, "warning", "Código expirado. Solicita uno nuevo.");
      formularioCodigoVerificacion?.reset();
      if (emailConfirmado) emailConfirmado.textContent = "";
      resetearContadorVisual();
      mostrarPasoRegistroDatos();
    }
  }, 1000);
}

function actualizarHash(hash = "") {
  window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}${hash}`);
}

function ocultarTodasLasVistas() {
  vistaLogin?.classList.add("d-none");
  vistaSignin?.classList.add("d-none");
  vistaRecuperacion?.classList.add("d-none");
}

function mostrarVistaLogin() {
  ocultarTodasLasVistas();
  vistaLogin?.classList.remove("d-none");
  actualizarHash("");
}

function mostrarVistaSignin() {
  ocultarTodasLasVistas();
  vistaSignin?.classList.remove("d-none");
  mostrarPasoRegistroDatos();
  actualizarHash("#signin");
}

function mostrarVistaRecuperacion() {
  ocultarTodasLasVistas();
  vistaRecuperacion?.classList.remove("d-none");
  mostrarPasoRecuperacionSolicitud();
  actualizarHash("#recuperacion");
}

function mostrarPasoRegistroDatos() {
  formularioDatosRegistro?.classList.remove("d-none");
  pasoCodigoVerificacion?.classList.add("d-none");
}

function mostrarPasoRegistroCodigo() {
  formularioDatosRegistro?.classList.add("d-none");
  pasoCodigoVerificacion?.classList.remove("d-none");
}

function mostrarPasoRecuperacionSolicitud() {
  pasoRecuperacionSolicitud?.classList.remove("d-none");
  pasoRecuperacionCambio?.classList.add("d-none");
}

function mostrarPasoRecuperacionCambio() {
  pasoRecuperacionSolicitud?.classList.add("d-none");
  pasoRecuperacionCambio?.classList.remove("d-none");
}

function resolverVistaInicial() {
  if (window.location.hash === "#signin") { mostrarVistaSignin(); return; }
  if (window.location.hash === "#recuperacion") { mostrarVistaRecuperacion(); return; }
  mostrarVistaLogin();
}

function limpiarFlujoRegistroCompleto() {
  formularioDatosRegistro?.reset();
  formularioCodigoVerificacion?.reset();
  if (emailConfirmado) emailConfirmado.textContent = "";
  limpiarMensaje(mensajeRegistroPaso1);
  limpiarMensaje(mensajeRegistroPaso2);
  detenerContador();
  resetearContadorVisual();
  datosRegistroPendiente = null;
  mostrarPasoRegistroDatos();
}

function limpiarFlujoRecuperacionCompleto() {
  formularioRecuperacionSolicitud?.reset();
  formularioRecuperacionCambio?.reset();
  if (emailRecuperacionConfirmado) emailRecuperacionConfirmado.textContent = "";
  limpiarMensaje(mensajeRecuperacionSolicitud);
  limpiarMensaje(mensajeRecuperacionCambio);
  if (emailRecuperacionPendiente) limpiarRecuperacion(emailRecuperacionPendiente);
  emailRecuperacionPendiente = "";
  mostrarPasoRecuperacionSolicitud();
}

function validarTelefono(t) { return /^[0-9]{10,}$/.test(t); }

function validarPassword(p, cp) {
  if (!p || !cp) return "Debes completar ambos campos de contraseña";
  if (p !== cp) return "Las contraseñas no coinciden";
  if (p.length < 6) return "La contraseña debe tener al menos 6 caracteres";
  return "";
}

function inicializarLogin() {
  formularioLogin?.addEventListener("submit", async (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeLogin);

    const email = document.getElementById("email-login").value.trim().toLowerCase();
    const password = document.getElementById("password-login").value;

    const boton = formularioLogin.querySelector("[type=submit]");
    boton.disabled = true;
    const textoOriginal = boton.textContent;
    boton.textContent = "Ingresando...";

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarMensaje(mensajeLogin, "danger", data.error || "Correo o contraseña incorrectos");
        return;
      }

      guardarToken(data.token);

      const rolBackend = (data.rol || "CLIENTE").toUpperCase();
      const sesion = {
        autenticado: true,
        email: data.email,
        nombre: data.nombre,
        rol: rolBackend === "ADMIN" ? "admin" : "cliente",
        clienteFiel: false,
        clientePremium: false,
        adminAuxiliar: rolBackend === "ADMIN",
        verificado: Boolean(data.verificado),
        fechaInicioSesion: new Date().toISOString(),
      };

      guardarSesion(sesion);
      redirigirSegunSesion(sesion, "../../");
    } catch {
      mostrarMensaje(mensajeLogin, "danger", "Error de conexión. Verifica que el servidor esté activo.");
    } finally {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
}

function inicializarRegistroPaso1() {
  formularioDatosRegistro?.addEventListener("submit", async (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRegistroPaso1);

    const nombre = document.getElementById("nombre-registro").value.trim();
    const telefono = document.getElementById("telefono-registro").value.trim();
    const email = document.getElementById("email-registro").value.trim().toLowerCase();
    const password = document.getElementById("password-registro").value;
    const confirmPassword = document.getElementById("confirm-password-registro").value;

    if (!nombre || !telefono || !email || !password || !confirmPassword) {
      mostrarMensaje(mensajeRegistroPaso1, "warning", "Completa todos los campos requeridos");
      return;
    }

    if (!validarTelefono(telefono)) {
      mostrarMensaje(mensajeRegistroPaso1, "warning", "El teléfono debe tener mínimo 10 dígitos");
      return;
    }

    const errorPwd = validarPassword(password, confirmPassword);
    if (errorPwd) { mostrarMensaje(mensajeRegistroPaso1, "warning", errorPwd); return; }

    const boton = formularioDatosRegistro.querySelector("[type=submit]");
    boton.disabled = true;
    const textoOriginal = boton.textContent;
    boton.textContent = "Enviando código...";

    try {
      await enviarCodigoReal(email, nombre, password);
      datosRegistroPendiente = { nombre, telefono, email };
      if (emailConfirmado) emailConfirmado.textContent = email;
      mostrarPasoRegistroCodigo();
      iniciarContador();
      mostrarMensaje(mensajeRegistroPaso2, "info", "Te enviamos un código al correo. Ingrésalo para completar el registro.");
    } catch (error) {
      mostrarMensaje(mensajeRegistroPaso1, "danger", error.message || "Error al registrar. Intenta de nuevo.");
    } finally {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
}

function inicializarRegistroPaso2() {
  formularioCodigoVerificacion?.addEventListener("submit", async (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRegistroPaso2);

    if (!datosRegistroPendiente) {
      mostrarMensaje(mensajeRegistroPaso2, "warning", "Primero completa los datos de registro");
      mostrarPasoRegistroDatos();
      return;
    }

    const codigo = document.getElementById("codigo-verificacion").value.trim();
    const { nombre, email } = datosRegistroPendiente;

    const boton = formularioCodigoVerificacion.querySelector("[type=submit]");
    boton.disabled = true;
    const textoOriginal = boton.textContent;
    boton.textContent = "Verificando...";

    try {
      await validarCodigoReal(email, codigo);
      detenerContador();
      limpiarFlujoRegistroCompleto();
      formularioLogin?.reset();
      limpiarMensaje(mensajeLogin);
      mostrarVistaLogin();
      mostrarMensaje(mensajeLogin, "success", `¡${nombre}! Tu cuenta fue creada. Ahora inicia sesión.`);
    } catch (error) {
      mostrarMensaje(mensajeRegistroPaso2, "danger", error.message || "Código incorrecto o expirado");
    } finally {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
}

function inicializarRecuperacionSolicitud() {
  formularioRecuperacionSolicitud?.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRecuperacionSolicitud);

    const email = document.getElementById("email-recuperacion").value.trim().toLowerCase();
    if (!email) {
      mostrarMensaje(mensajeRecuperacionSolicitud, "warning", "Debes ingresar un correo electrónico válido.");
      return;
    }

    const resultado = solicitarRecuperacion(email);
    if (!resultado.ok) {
      mostrarMensaje(mensajeRecuperacionSolicitud, "danger", resultado.message);
      return;
    }

    emailRecuperacionPendiente = email;
    if (emailRecuperacionConfirmado) emailRecuperacionConfirmado.textContent = email;
    mostrarPasoRecuperacionCambio();
    mostrarMensaje(mensajeRecuperacionCambio, "info", "Código generado (disponible en consola para desarrollo).");
  });
}

function inicializarRecuperacionCambio() {
  formularioRecuperacionCambio?.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRecuperacionCambio);

    if (!emailRecuperacionPendiente) {
      mostrarMensaje(mensajeRecuperacionCambio, "warning", "Primero solicita la recuperación de contraseña.");
      mostrarPasoRecuperacionSolicitud();
      return;
    }

    const tokenIngresado = document.getElementById("token-recuperacion").value.trim();
    const nuevaPassword = document.getElementById("nueva-password").value;
    const confirmarNueva = document.getElementById("confirmar-nueva-password").value;

    if (!tokenIngresado) {
      mostrarMensaje(mensajeRecuperacionCambio, "warning", "Debes ingresar el código de recuperación.");
      return;
    }

    const errorPwd = validarPassword(nuevaPassword, confirmarNueva);
    if (errorPwd) { mostrarMensaje(mensajeRecuperacionCambio, "warning", errorPwd); return; }

    const validacion = validarSolicitudRecuperacion(emailRecuperacionPendiente, tokenIngresado);
    if (!validacion.ok) { mostrarMensaje(mensajeRecuperacionCambio, "danger", validacion.message); return; }

    marcarRecuperacionComoUsada(emailRecuperacionPendiente);
    limpiarRecuperacion(emailRecuperacionPendiente);

    const emailActualizado = emailRecuperacionPendiente;
    limpiarFlujoRecuperacionCompleto();
    formularioLogin?.reset();
    limpiarMensaje(mensajeLogin);
    mostrarVistaLogin();
    mostrarMensaje(mensajeLogin, "info", `Código validado para ${emailActualizado}. La actualización de contraseña requiere el servicio backend de recuperación.`);
  });
}

function inicializarNavegacion() {
  linkSignin?.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarTodosLosMensajes();
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
    formularioCodigoVerificacion?.reset();
    detenerContador();
    resetearContadorVisual();
    mostrarPasoRegistroDatos();
  });

  botonReenviarCodigo?.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = emailConfirmado?.textContent.trim();
    if (!email || !datosRegistroPendiente) {
      mostrarMensaje(mensajeRegistroPaso2, "warning", "No hay correo pendiente para reenviar");
      return;
    }
    botonReenviarCodigo.disabled = true;
    try {
      await reenviarCodigoReal(email);
      iniciarContador();
      mostrarMensaje(mensajeRegistroPaso2, "success", "Nuevo código enviado. Tienes 120 segundos para usarlo.");
    } catch (error) {
      mostrarMensaje(mensajeRegistroPaso2, "danger", error.message || "Error al reenviar el código");
    } finally {
      botonReenviarCodigo.disabled = false;
    }
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
    formularioRecuperacionCambio?.reset();
    if (emailRecuperacionConfirmado) emailRecuperacionConfirmado.textContent = "";
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
      mostrarMensaje(mensajeRecuperacionCambio, "warning", "No hay una solicitud pendiente.");
      return;
    }
    const resultado = solicitarRecuperacion(emailRecuperacionPendiente);
    if (!resultado.ok) { mostrarMensaje(mensajeRecuperacionCambio, "danger", resultado.message); return; }
    mostrarMensaje(mensajeRecuperacionCambio, "success", "Nuevo código generado (ver consola).");
  });

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#signin") { mostrarVistaSignin(); return; }
    if (window.location.hash === "#recuperacion") { mostrarVistaRecuperacion(); return; }
    mostrarVistaLogin();
  });
}

function inicializarLoginPage() {
  resolverVistaInicial();
  mostrarPasoRegistroDatos();
  mostrarPasoRecuperacionSolicitud();
  limpiarTodosLosMensajes();
  resetearContadorVisual();
  inicializarNavegacion();
  inicializarLogin();
  inicializarRegistroPaso1();
  inicializarRegistroPaso2();
  inicializarRecuperacionSolicitud();
  inicializarRecuperacionCambio();
}

inicializarLoginPage();
