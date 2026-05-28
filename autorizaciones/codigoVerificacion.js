// MOCK TEMPORAL DE OTP
// Reemplazar por llamadas al backend cuando exista el servicio real.
// Mantener esta API para no tocar login.js en el futuro.

const TIEMPO_CODIGO_MS = 120000;
const codigosSimulados = new Map();

function generarCodigoVerificacion() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function enviarCodigoSimulado(email) {
  const codigo = generarCodigoVerificacion();
  codigosSimulados.set(email, codigo);
  console.log(`MOCK OTP -> Código simulado para ${email}: ${codigo}`);
  return codigo;
}

function validarCodigoSimulado(email, codigoIngresado) {
  const codigoValido = codigosSimulados.get(email);
  return codigoIngresado === codigoValido;
}

function eliminarCodigoSimulado(email) {
  codigosSimulados.delete(email);
}

function limpiarCodigosSimulados() {
  codigosSimulados.clear();
}

function obtenerCodigoSimulado(email) {
  return codigosSimulados.get(email) || null;
}

export {
  TIEMPO_CODIGO_MS,
  generarCodigoVerificacion,
  enviarCodigoSimulado,
  validarCodigoSimulado,
  eliminarCodigoSimulado,
  limpiarCodigosSimulados,
  obtenerCodigoSimulado,
};