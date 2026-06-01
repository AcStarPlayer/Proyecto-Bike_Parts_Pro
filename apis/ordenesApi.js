import { apiRequest } from "./apiClient.js";

export async function postCheckout(payload) {
  return apiRequest("/ordenes/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function postEnvio(envioData) {
  return apiRequest("/envios", {
    method: "POST",
    body: JSON.stringify(envioData),
  });
}
