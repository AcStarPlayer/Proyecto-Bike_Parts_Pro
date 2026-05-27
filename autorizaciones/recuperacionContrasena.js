// MOCK TEMPORAL DE RECUPERACIÓN DE CONTRASEÑA
// Reemplazar por llamadas al backend cuando exista el servicio real.
// Mantener esta API para no tocar login.js en el futuro.

const TIEMPO_RECUPERACION_MS = 10 * 60 * 1000; // 10 minutos
const recuperacionesSimuladas = new Map();

function generarTokenRecuperacion() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function crearRegistroRecuperacion(email) {
  const token = generarTokenRecuperacion();
  const expiresAt = Date.now() + TIEMPO_RECUPERACION_MS;

  const registro = {
    email,
    token,
    expiresAt,
    createdAt: new Date().toISOString(),
    usado: false,
  };

  recuperacionesSimuladas.set(email, registro);

  console.log(`MOCK RECUPERACIÓN -> Token para ${email}: ${token}`);
  return registro;
}

function solicitarRecuperacion(email) {
  if (!email) {
    return {
      ok: false,
      message: "Debes ingresar un correo válido.",
      registro: null,
    };
  }

  const registro = crearRegistroRecuperacion(email.trim().toLowerCase());

  return {
    ok: true,
    message: "Si el correo existe, se enviaron instrucciones de recuperación.",
    registro,
  };
}

function obtenerSolicitudRecuperacion(email) {
  if (!email) {
    return null;
  }

  const registro = recuperacionesSimuladas.get(email.trim().toLowerCase());
  if (!registro) {
    return null;
  }

  if (registro.usado || Date.now() > registro.expiresAt) {
    recuperacionesSimuladas.delete(email.trim().toLowerCase());
    return null;
  }

  return registro;
}

function validarSolicitudRecuperacion(email, tokenIngresado) {
  const registro = obtenerSolicitudRecuperacion(email);
  if (!registro) {
    return {
      ok: false,
      message: "La solicitud de recuperación no es válida o expiró.",
    };
  }

  if (registro.token !== tokenIngresado) {
    return {
      ok: false,
      message: "El token de recuperación es incorrecto.",
    };
  }

  return {
    ok: true,
    message: "Token válido. Puedes continuar con el cambio de contraseña.",
  };
}

function marcarRecuperacionComoUsada(email) {
  const registro = obtenerSolicitudRecuperacion(email);
  if (!registro) return false;

  registro.usado = true;
  recuperacionesSimuladas.set(email.trim().toLowerCase(), registro);
  return true;
}

function limpiarRecuperacion(email) {
  if (!email) return;
  recuperacionesSimuladas.delete(email.trim().toLowerCase());
}

function limpiarTodasLasRecuperaciones() {
  recuperacionesSimuladas.clear();
}

export {
  TIEMPO_RECUPERACION_MS,
  solicitarRecuperacion,
  obtenerSolicitudRecuperacion,
  validarSolicitudRecuperacion,
  marcarRecuperacionComoUsada,
  limpiarRecuperacion,
  limpiarTodasLasRecuperaciones,
};