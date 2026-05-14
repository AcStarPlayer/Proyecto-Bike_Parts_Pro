import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/pieDePagina/footer.js";
import { botones } from "../../componentes/botones/botones.js";

// Inicialización visual
navBar("BikePartsPro", "../../");
document.getElementById("footer").innerHTML = footer("../../");

// Configuración
const CLAVE_USUARIOS = "usuariosBikePartsPro";
const CLAVE_SESION = "sesionBikePartsPro";
const TIEMPO_CODIGO_MS = 120000;

// Códigos quemados para jerarquías
const CODIGOS_CLIENTE_FIEL = ["111222", "333444", "555666"];
const CODIGOS_CLIENTE_PREMIUM = ["123456", "789012", "345678"];
const CODIGOS_ADMIN_AUXILIAR = ["999888", "777666", "555444"];

// Simulación de códigos enviados
const codigosSimulados = new Map();

// DOM
const vistaLogin = document.getElementById("vista-login");
const vistaSignin = document.getElementById("vista-signin");

const formularioLogin = document.getElementById("formulario-login");
const formularioDatosRegistro = document.getElementById("form-datos-registro");
const formularioCodigoVerificacion = document.getElementById("form-codigo-verificacion");

const pasoCodigoVerificacion = document.getElementById("paso-codigo-verificacion");

const linkSignin = document.getElementById("link-signin");
const linkVolverLogin = document.getElementById("volver-login");
const linkVolverDatosRegistro = document.getElementById("volver-datos-registro");
const linkRecuperar = document.getElementById("link-recuperar");
const botonReenviarCodigo = document.getElementById("reenviar-codigo");

const emailConfirmado = document.getElementById("email-confirmado");
const contadorTiempo = document.getElementById("contador-tiempo");

const mensajeLogin = document.getElementById("mensaje-login");
const mensajeRegistroPaso1 = document.getElementById("mensaje-registro-paso1");
const mensajeRegistroPaso2 = document.getElementById("mensaje-registro-paso2");

// Estado
let contadorInterval = null;
let tiempoRestante = 0;
let datosRegistroPendiente = null;

// Utilidades de interfaz
function limpiarMensaje(elemento) {
  if (!elemento) return;
  elemento.className = "d-none";
  elemento.textContent = "";
}

function limpiarTodosLosMensajes() {
  limpiarMensaje(mensajeLogin);
  limpiarMensaje(mensajeRegistroPaso1);
  limpiarMensaje(mensajeRegistroPaso2);
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
  contadorTiempo.textContent = "120s";
}

function actualizarHash(hash = "") {
  const nuevaUrl = `${window.location.pathname}${window.location.search}${hash}`;
  window.history.replaceState({}, "", nuevaUrl);
}

// Navegación de vistas
function mostrarVistaLogin() {
  vistaLogin.classList.remove("d-none");
  vistaSignin.classList.add("d-none");
  actualizarHash("");
}

function mostrarVistaSignin() {
  vistaLogin.classList.add("d-none");
  vistaSignin.classList.remove("d-none");
  actualizarHash("#signin");
}

function mostrarPasoRegistroDatos() {
  formularioDatosRegistro.classList.remove("d-none");
  pasoCodigoVerificacion.classList.add("d-none");
}

function mostrarPasoRegistroCodigo() {
  formularioDatosRegistro.classList.add("d-none");
  pasoCodigoVerificacion.classList.remove("d-none");
}

function resolverVistaInicial() {
  if (window.location.hash === "#signin") {
    mostrarVistaSignin();
    mostrarPasoRegistroDatos();
  } else {
    mostrarVistaLogin();
  }
}

// Limpieza de formularios
function limpiarCamposLogin() {
  formularioLogin.reset();
  limpiarMensaje(mensajeLogin);
}

function limpiarCamposRegistroPaso1() {
  formularioDatosRegistro.reset();
  limpiarMensaje(mensajeRegistroPaso1);
}

function limpiarCamposRegistroPaso2() {
  formularioCodigoVerificacion.reset();
  emailConfirmado.textContent = "";
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

function limpiarCamposAcceso() {
  limpiarCamposLogin();
  limpiarFlujoRegistroCompleto();
}

// Persistencia local
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(CLAVE_USUARIOS) || "[]");
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function guardarUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  usuarios.push(usuario);
  guardarUsuarios(usuarios);
}

function usuarioExiste(email) {
  return obtenerUsuarios().some(
    (usuario) => usuario.email.toLowerCase() === email.toLowerCase()
  );
}

// Sesión
function construirSesionDesdeUsuario(usuario) {
  return {
    autenticado: true,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol,
    clienteFiel: usuario.clienteFiel || false,
    clientePremium: usuario.clientePremium || false,
    adminAuxiliar: usuario.adminAuxiliar || false,
    fechaInicioSesion: new Date().toISOString()
  };
}

function guardarSesion(sesion) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

function redirigirSegunSesion(sesion) {
  if (sesion.adminAuxiliar || sesion.rol === "admin") {
    window.location.href = "../../vistas/admin/productos/producto.html";
    return;
  }

  window.location.href = "../../vistas/catalogo/catalogo.html";
}

// Validaciones
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

// Código de verificación
function generarCodigoVerificacion() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function iniciarContador() {
  detenerContador();
  tiempoRestante = TIEMPO_CODIGO_MS / 1000;
  contadorTiempo.textContent = `${tiempoRestante}s`;

  contadorInterval = setInterval(() => {
    tiempoRestante--;
    contadorTiempo.textContent = `${tiempoRestante}s`;

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

function enviarCodigoSimulado(email) {
  const codigo = generarCodigoVerificacion();
  codigosSimulados.set(email, codigo);
  console.log(`Código simulado para ${email}: ${codigo}`);
  return codigo;
}

// Eventos de navegación
function inicializarNavegacionEntreVistas() {
  linkSignin.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarTodosLosMensajes();
    limpiarCamposLogin();
    limpiarFlujoRegistroCompleto();
    mostrarVistaSignin();
  });

  linkVolverLogin.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarTodosLosMensajes();
    limpiarFlujoRegistroCompleto();
    mostrarVistaLogin();
  });

  linkVolverDatosRegistro.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRegistroPaso2);
    formularioCodigoVerificacion.reset();
    detenerContador();
    resetearContadorVisual();
    mostrarPasoRegistroDatos();
  });

  botonReenviarCodigo.addEventListener("click", (e) => {
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

  if (linkRecuperar) {
    linkRecuperar.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarMensaje(
        mensajeLogin,
        "info",
        "La recuperación de contraseña aún no está disponible."
      );
    });
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#signin") {
      mostrarVistaSignin();
      if (pasoCodigoVerificacion.classList.contains("d-none")) {
        mostrarPasoRegistroDatos();
      }
    } else {
      mostrarVistaLogin();
    }
  });
}

// Login
function inicializarLogin() {
  formularioLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeLogin);

    const email = document.getElementById("email-login").value.trim().toLowerCase();
    const password = document.getElementById("password-login").value;

    const usuario = obtenerUsuarios().find(
      (u) => u.email.toLowerCase() === email && u.password === password
    );

    if (!usuario) {
      mostrarMensaje(mensajeLogin, "danger", "Correo o contraseña incorrectos");
      return;
    }

    const sesion = construirSesionDesdeUsuario(usuario);
    guardarSesion(sesion);
    redirigirSegunSesion(sesion);
  });
}

// Registro paso 1
function inicializarRegistroPaso1() {
  formularioDatosRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    limpiarMensaje(mensajeRegistroPaso1);

    const nombre = document.getElementById("nombre-registro").value.trim();
    const telefono = document.getElementById("telefono-registro").value.trim();
    const email = document
      .getElementById("email-registro")
      .value.trim()
      .toLowerCase();

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

    datosRegistroPendiente = {
      nombre,
      telefono,
      email
    };

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

// Registro paso 2
function inicializarRegistroPaso2() {
  formularioCodigoVerificacion.addEventListener("submit", (e) => {
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

    const codigoIngresado = document
      .getElementById("codigo-verificacion")
      .value.trim();

    const password = document.getElementById("password-registro").value;
    const confirmPassword = document.getElementById("confirm-password-registro").value;

    const email = datosRegistroPendiente.email;
    const codigoValido = codigosSimulados.get(email);

    const esCodigoDinamicoValido = codigoIngresado === codigoValido;
    const esCodigoClienteFiel = CODIGOS_CLIENTE_FIEL.includes(codigoIngresado);
    const esCodigoClientePremium = CODIGOS_CLIENTE_PREMIUM.includes(codigoIngresado);
    const esCodigoAdminAuxiliar = CODIGOS_ADMIN_AUXILIAR.includes(codigoIngresado);

    if (
      !esCodigoDinamicoValido &&
      !esCodigoClienteFiel &&
      !esCodigoClientePremium &&
      !esCodigoAdminAuxiliar
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
      fechaRegistro: new Date().toISOString()
    };

    guardarUsuario(nuevoUsuario);
    codigosSimulados.delete(email);

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

// Inicialización general
function inicializarLoginPage() {
  resolverVistaInicial();
  mostrarPasoRegistroDatos();
  limpiarTodosLosMensajes();

  inicializarNavegacionEntreVistas();
  inicializarLogin();
  inicializarRegistroPaso1();
  inicializarRegistroPaso2();
}

inicializarLoginPage();