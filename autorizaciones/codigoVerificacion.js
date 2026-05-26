const TIEMPO_CODIGO_MS = 120000;
const codigosSimulados = new Map();

function generarCodigoVerificacion() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function enviarCodigoSimulado(email) {
  const codigo = generarCodigoVerificacion();
  codigosSimulados.set(email, codigo);
  console.log(`Código simulado para ${email}: ${codigo}`);
  return codigo;
}

function validarCodigoSimulado(email, codigoIngresado) {
  const codigoValido = codigosSimulados.get(email);
  return codigoIngresado === codigoValido;
}

function eliminarCodigoSimulado(email) {
  codigosSimulados.delete(email);
}

export {
  TIEMPO_CODIGO_MS,
  generarCodigoVerificacion,
  enviarCodigoSimulado,
  validarCodigoSimulado,
  eliminarCodigoSimulado,
};