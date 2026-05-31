const CLAVE_SESION = "sesionBikePartsPro";
const CLAVE_TOKEN = "tokenBikePartsPro";

function guardarToken(token) {
  localStorage.setItem(CLAVE_TOKEN, token);
}

function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN) || null;
}

function limpiarToken() {
  localStorage.removeItem(CLAVE_TOKEN);
}

function limpiarSesionCompleta() {
  localStorage.removeItem(CLAVE_SESION);
  localStorage.removeItem(CLAVE_TOKEN);
}

function guardarSesion(sesion) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

function obtenerSesionActiva() {
  try {
    const sesionGuardada = JSON.parse(localStorage.getItem(CLAVE_SESION) || "null");

    if (!sesionGuardada || typeof sesionGuardada !== "object") {
      return null;
    }

    return sesionGuardada;
  } catch (error) {
    console.error("No fue posible leer la sesión activa:", error);
    return null;
  }
}

function limpiarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  localStorage.removeItem(CLAVE_TOKEN);
}

function construirSesionDesdeUsuario(usuario) {
  return {
    autenticado: true,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: usuario.rol || "cliente",
    clienteFiel: Boolean(usuario.clienteFiel),
    clientePremium: Boolean(usuario.clientePremium),
    adminAuxiliar: Boolean(usuario.adminAuxiliar),
    fechaInicioSesion: new Date().toISOString(),
  };
}

function redirigirSegunSesion(sesion, basePath = "../../") {
  if (!sesion) {
    window.location.href = `${basePath}vistas/login/login.html`;
    return;
  }

  if (sesion.adminAuxiliar || sesion.rol === "admin") {
    window.location.href = `${basePath}vistas/admin/productos/producto.html`;
    return;
  }

  window.location.href = `${basePath}vistas/catalogo/catalogo.html`;
}

function isAuthenticated() {
  const sesion = obtenerSesionActiva();
  return Boolean(sesion && sesion.autenticado);
}

function getSession() {
  return obtenerSesionActiva();
}

function hasRole(rol) {
  const sesion = obtenerSesionActiva();
  return Boolean(sesion && sesion.rol === rol);
}

function hasAnyRole(roles = []) {
  const sesion = obtenerSesionActiva();
  return Boolean(sesion && roles.includes(sesion.rol));
}

function isClienteFiel() {
  const sesion = obtenerSesionActiva();
  return Boolean(sesion && sesion.autenticado && sesion.rol === "cliente" && sesion.clienteFiel);
}

function isClientePremium() {
  const sesion = obtenerSesionActiva();
  return Boolean(sesion && sesion.autenticado && sesion.rol === "cliente" && sesion.clientePremium);
}

function isAdmin() {
  const sesion = obtenerSesionActiva();
  return Boolean(sesion && sesion.autenticado && (sesion.rol === "admin" || sesion.adminAuxiliar));
}

export {
  guardarSesion,
  obtenerSesionActiva,
  limpiarSesion,
  limpiarSesionCompleta,
  construirSesionDesdeUsuario,
  redirigirSegunSesion,
  isAuthenticated,
  getSession,
  hasRole,
  hasAnyRole,
  isClienteFiel,
  isClientePremium,
  isAdmin,
  guardarToken,
  obtenerToken,
  limpiarToken,
};