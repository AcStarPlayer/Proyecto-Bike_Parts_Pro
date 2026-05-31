import { API_BASE_URL } from "../config/api.js";

export const TIEMPO_CODIGO_MS = 120000;

export async function enviarCodigoReal(email, nombre, password) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al registrar el usuario");
  return data;
}

export async function reenviarCodigoReal(email) {
  const res = await fetch(`${API_BASE_URL}/auth/reenviar-codigo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al reenviar el código");
  return data;
}

export async function validarCodigoReal(email, codigo) {
  const res = await fetch(`${API_BASE_URL}/auth/verificar-registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, codigo }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Código incorrecto o expirado");
  return data;
}
