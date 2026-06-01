import { apiRequest } from "./apiClient.js";
import { productosPredeterminados } from "./productos.js";

export async function postProducto(payload) {
  return apiRequest("/productos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

function normalizarProducto(p) {
  return {
    ...p,
    sku: p.modeloProducto?.sku || p.sku || "",
    marca: p.modeloProducto?.marca?.nombre || p.marca || "",
    categoria: p.categoria?.toLowerCase() ?? p.categoria,
  };
}

export async function getProductos() {
  try {
    const res = await apiRequest("/productos");
    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(normalizarProducto);
      }
    }
  } catch (err) {
    console.warn("Usando datos de ejemplo:", err.message);
  }
  return productosPredeterminados;
}

export async function getProductosFiltrados({ categoria = null, palabra = null } = {}) {
  try {
    const params = new URLSearchParams();
    if (categoria) params.set("categoria", categoria.toUpperCase());
    if (palabra?.trim()) params.set("palabra", palabra.trim());

    const res = await apiRequest(
      params.toString() ? `/productos/filtrar?${params}` : "/productos"
    );
    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data.map(normalizarProducto);
    }
  } catch (err) {
    console.warn("Usando filtrado local:", err.message);
  }
  return null;
}
