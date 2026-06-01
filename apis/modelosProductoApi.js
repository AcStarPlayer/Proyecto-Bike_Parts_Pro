import { apiRequest } from "./apiClient.js";

export async function postModeloProducto(payload) {
  return apiRequest("/modelos-producto", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
