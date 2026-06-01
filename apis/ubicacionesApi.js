import { apiRequest } from "./apiClient.js";

export async function getDepartamentos() {
  try {
    const res = await apiRequest("/departamentos");
    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn("Error al cargar departamentos:", err.message);
  }
  return [];
}

export async function getCiudades() {
  try {
    const res = await apiRequest("/ciudades");
    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn("Error al cargar ciudades:", err.message);
  }
  return [];
}
