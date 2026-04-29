import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/pieDePagina/footer.js";
import { botones } from "../../componentes/botones/botones.js";

// Inicializar navbar y footer
navBar("BikePartsPro", "../../");
document.getElementById("footer").innerHTML = footer("../../");

// Configuración
const CLAVE_USUARIOS = "usuariosBikePartsPro";
const CLAVE_SESION = "sesionBikePartsPro";
const TIEMPO_CODIGO_MS = 120000; // 120 segundos

// Códigos quemados para jerarquías
const CODIGOS_CLIENTE_PREMIUM = ["123456", "789012", "345678"];
const CODIGOS_ADMIN_AUXILIAR = ["999888", "777666", "555444"];

// Simulación de códigos enviados por email (en producción usar N8N/Gmail API)
const codigosSimulados = new Map(); // email -> código

// Elementos DOM
const vistaLogin = document.getElementById("vista-login");
const vistaSignin = document.getElementById("vista-signin");
const formularioLogin = document.getElementById("formulario-login");
const formularioDatosRegistro = document.getElementById("form-datos-registro");
const formularioCodigoVerificacion = document.getElementById("form-codigo-verificacion");
const linkSignin = document.getElementById("link-signin");
const emailConfirmado = document.getElementById("email-confirmado");
const contadorTiempo = document.getElementById("contador-tiempo");
const botonReenviarCodigo = document.getElementById("reenviar-codigo");

// Mensajes
const mensajeLogin = document.getElementById("mensaje-login");
const mensajeRegistroPaso1 = document.getElementById("mensaje-registro-paso1");
const mensajeRegistroPaso2 = document.getElementById("mensaje-registro-paso2");

// Variables de estado global
let contadorInterval = null;
let tiempoRestante = 0;

function limpiarCamposAcceso() {
  formularioLogin.reset();
  formularioDatosRegistro.reset();
  formularioCodigoVerificacion.reset();
  emailConfirmado.textContent = "";
  clearInterval(contadorInterval);
  contadorTiempo.textContent = "120s";
}

// Inicializar vistas
function inicializarVistas() {
  // Login por defecto
  mostrarVistaLogin();
  
  // Toggle login/signin limpiando los campos
  linkSignin.addEventListener("click", (e) => {
    e.preventDefault();
    limpiarCamposAcceso();
    mostrarVistaSignin();
  });

  document.getElementById("volver-login").addEventListener("click", (e) => {
    e.preventDefault();
    limpiarCamposAcceso();
    mostrarVistaLogin();
  });

  document.getElementById("volver-datos-registro").addEventListener("click", (e) => {
    e.preventDefault();
    formularioCodigoVerificacion.reset();
    emailConfirmado.textContent = "";
    clearInterval(contadorInterval);
    contadorTiempo.textContent = "120s";
    mostrarPasoRegistroDatos();
  });

  // Reenviar código con reinicio de contador
  botonReenviarCodigo.addEventListener("click", () => {
    const email = emailConfirmado.textContent;
    if (!email) {
      mostrarMensaje(mensajeRegistroPaso2, "warning", "No hay correo pendiente para reenviar");
      return;
    }

    // Generar nuevo código de 6 digitos si el primero no funciona
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    codigosSimulados.set(email, codigo);
    
    console.log(`Nuevo código simulado para ${email}: ${codigo}`);
    
    // Reiniciar contador de los 120 segundos
    clearInterval(contadorInterval);
    tiempoRestante = TIEMPO_CODIGO_MS / 1000;
    iniciarContador();
    
    mostrarMensaje(mensajeRegistroPaso2, "success", "Nuevo código enviado. Espera 120s.");
  });
}

function mostrarVistaLogin() {
  vistaLogin.classList.remove("d-none");
  vistaSignin.classList.add("d-none");
}

function mostrarVistaSignin() {
  vistaLogin.classList.add("d-none");
  vistaSignin.classList.remove("d-none");
}

function mostrarPasoRegistroDatos() {
  formularioDatosRegistro.classList.remove("d-none");
  document.getElementById("paso-codigo-verificacion").classList.add("d-none");
}

function mostrarPasoRegistroCodigo() {
  formularioDatosRegistro.classList.add("d-none");
  document.getElementById("paso-codigo-verificacion").classList.remove("d-none");
}

// Gestion usuarios en el localStorage
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(CLAVE_USUARIOS) || "[]");
}

function guardarUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  usuarios.push(usuario);
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function usuarioExiste(email) {
  return obtenerUsuarios().some(u => u.email === email);
}

// Validar login
formularioLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email-login").value.trim();
  const password = document.getElementById("password-login").value;
  
  const usuario = obtenerUsuarios().find(u => 
    u.email === email && u.password === password
  );

  if (usuario) {
    const sesion = {
      autenticado: true,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
      clientePremium: usuario.clientePremium || false,
      adminAuxiliar: usuario.adminAuxiliar || false
    };
    
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    
    // Redirigir según rol
    if (sesion.adminAuxiliar) {
      window.location.href = "../../vistas/admin/productos/producto.html";
    } else {
      window.location.href = "../../vistas/catalogo/catalogo.html";
    }
  } else {
    mostrarMensaje(mensajeLogin, "danger", "Correo o contraseña incorrectos");
  }
});

// Sign In - Paso 1- capturar datos para saber a donde enviar codigo de validacion
formularioDatosRegistro.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const nombre = document.getElementById("nombre-registro").value.trim();
  const email = document.getElementById("email-registro").value.trim().toLowerCase();
  
  if (usuarioExiste(email)) {
    mostrarMensaje(mensajeRegistroPaso1, "warning", "Este correo ya está registrado");
    return;
  }

  // Simular envio email (en prod: N8N + Gmail API)
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  codigosSimulados.set(email, codigo);
  
  // Mostrar paso 2
  emailConfirmado.textContent = email;
  mostrarPasoRegistroCodigo();
  
  // Iniciar contador
  iniciarContador();
  
  console.log(`Código simulado para ${email}: ${codigo}`); // En prod: enviar real
});

// Contador 120 segundos - si llega a 0 los campos se autolimpian
function iniciarContador() {
  tiempoRestante = TIEMPO_CODIGO_MS / 1000;
  
  contadorInterval = setInterval(() => {
    contadorTiempo.textContent = `${tiempoRestante}s`;
    
    if (tiempoRestante <= 0) {
      clearInterval(contadorInterval);
      mostrarMensaje(mensajeRegistroPaso2, "warning", "Código expirado. Solicita uno nuevo.");
      formularioCodigoVerificacion.reset();
      formularioDatosRegistro.reset();
      emailConfirmado.textContent = "";
      contadorTiempo.textContent = "120s";
      mostrarPasoRegistroDatos();
      return;
    }
    tiempoRestante--;
  }, 1000);
}

// Validar codigo y completar registro
formularioCodigoVerificacion.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const codigoIngresado = document.getElementById("codigo-verificacion").value.trim();
  const email = emailConfirmado.textContent;
  const password = document.getElementById("password-registro").value;
  const confirmPassword = document.getElementById("confirm-password-registro").value;
  
  const codigoValido = codigosSimulados.get(email);
  
  const esCodigoDinamicoValido = codigoIngresado === codigoValido;
  const esCodigoClientePremium = CODIGOS_CLIENTE_PREMIUM.includes(codigoIngresado);
  const esCodigoAdminAuxiliar = CODIGOS_ADMIN_AUXILIAR.includes(codigoIngresado);

  if (!esCodigoDinamicoValido && !esCodigoClientePremium && !esCodigoAdminAuxiliar) {
    mostrarMensaje(mensajeRegistroPaso2, "danger", "Código incorrecto");
    return;
  }

  
  if (password !== confirmPassword) {
    mostrarMensaje(mensajeRegistroPaso2, "warning", "Las contraseñas no coinciden");
    return;
  }

  const nombre = document.getElementById("nombre-registro").value.trim();

  // Determinar jerarquía por código quemado
  let rol = "cliente";
  let clientePremium = false;
  let adminAuxiliar = false;

  if (esCodigoClientePremium) {
    rol = "clientePremium";
    clientePremium = true;
  } else if (esCodigoAdminAuxiliar) {
    rol = "adminAuxiliar";
    adminAuxiliar = true;
  }
  
    
  // Guardar usuario
  const nuevoUsuario = {
    nombre,
    email,
    password,
    rol,
    clientePremium,
    adminAuxiliar,
    fechaRegistro: new Date().toISOString()
  };
  
  guardarUsuario(nuevoUsuario);
  
  // Limpiar y volver a login
  formularioCodigoVerificacion.reset();
  mostrarVistaLogin();

  if (clientePremium) {
    mostrarMensaje(mensajeLogin, "success", `¡${nombre}! Tu cuenta ha sido creada como Cliente Premium. Ahora inicia sesión.`);
  } else if (adminAuxiliar) {
    mostrarMensaje(mensajeLogin, "success", `¡${nombre}! Tu cuenta ha sido creada como Admin Auxiliar. Ahora inicia sesión.`);
  } else {
    mostrarMensaje(mensajeLogin, "success", `¡${nombre}! Tu cuenta ha sido creada como Cliente. Ahora inicia sesión.`);
  }
});


// Utilidades
function mostrarMensaje(elemento, tipo, texto) {
  elemento.classList.remove("d-none", "alert-success", "alert-danger", "alert-warning");
  elemento.classList.add("alert", `alert-${tipo}`);
  elemento.textContent = texto;
}

// Inicializar
inicializarVistas();