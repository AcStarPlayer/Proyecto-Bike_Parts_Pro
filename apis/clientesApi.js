import { apiRequest } from "./apiClient.js";

export async function getClientes() {
  try {
    const res = await apiRequest("/clientes");
    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("Error al cargar clientes:", err.message);
  }
  return [];
}

export async function getClienteIdPorEmail(email) {
  const clientes = await getClientes();
  const cliente = clientes.find(
    (c) => (c.correo || c.email || "").toLowerCase() === email.toLowerCase()
  );
  return cliente?.id ?? null;
}
