import { apiRequest } from "./apiClient.js";

const MARCAS_FALLBACK = [
  { id: 1, nombre: "Shimano" },
  { id: 2, nombre: "SRAM" },
  { id: 3, nombre: "Fox" },
  { id: 4, nombre: "Continental" },
  { id: 5, nombre: "Maxxis" },
];

export async function getMarcas() {
  try {
    const res = await apiRequest("/marcas");
    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn("Usando marcas locales:", err.message);
  }
  return MARCAS_FALLBACK;
}
