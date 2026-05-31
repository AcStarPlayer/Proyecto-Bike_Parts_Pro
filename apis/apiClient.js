import { API_BASE_URL } from "../config/api.js";
import { obtenerToken, guardarToken, limpiarSesionCompleta } from "../autorizaciones/autorizaciones.js";

async function intentarRefresh() {
  const token = obtenerToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    guardarToken(data.token);
    return data.token;
  } catch {
    return null;
  }
}

async function apiRequest(endpoint, opciones = {}) {
  const token = obtenerToken();
  const headers = {
    ...(opciones.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(opciones.headers || {})
  };

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${endpoint}`, { ...opciones, headers });
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }

  if (res.status === 401) {
    const nuevoToken = await intentarRefresh();
    if (!nuevoToken) {
      limpiarSesionCompleta();
      window.dispatchEvent(new CustomEvent("sesion-expirada"));
      return null;
    }
    headers["Authorization"] = `Bearer ${nuevoToken}`;
    try {
      res = await fetch(`${API_BASE_URL}${endpoint}`, { ...opciones, headers });
    } catch {
      throw new Error("No se pudo conectar con el servidor");
    }
  }

  return res;
}

export { apiRequest };
