import { productosBackend } from "../../apis/productos.js";
import { botones } from "../../componentes/botones/botones.js";

function renderFichaTecnica(producto) {
  const imagenes = producto.imagenes || [];
  const marca = producto.marca || producto.modeloProducto?.marca?.nombre || "";
  const sku = producto.modeloProducto?.sku || producto.sku || "";

  return `
    <div class="modal fade" id="modalFichaTecnica" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h3 class="modal-title">${producto.nombre}</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="row g-4">

              <div class="col-12 col-lg-6">
                <div id="mainProductCarousel" class="carousel slide" data-bs-ride="carousel">
                  <div class="carousel-inner rounded">
                    ${imagenes.map((img, index) => `
                      <div class="carousel-item ${index === 0 ? "active" : ""}">
                        <img src="${img.url}" class="d-block w-100" style="height: 300px; object-fit: contain;" alt="imagen ${index}">
                      </div>
                    `).join("")}
                  </div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#mainProductCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#mainProductCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                  </button>
                </div>

                <div class="d-flex justify-content-center gap-2 mt-3 flex-wrap">
                  ${imagenes.map((img, index) => `
                    <button type="button" data-bs-target="#mainProductCarousel" data-bs-slide-to="${index}"
                            class="border-0 p-0 rounded ${index === 0 ? "active" : ""}">
                      <img src="${img.url}" style="width:70px;height:70px;object-fit:cover;border-radius:6px;" alt="thumb ${index}">
                    </button>
                  `).join("")}
                </div>
              </div>

              <div class="col-12 col-lg-6">
                <span class="badge bg-secondary mb-2">${(String(producto.categoria || "")).toUpperCase()}</span>
                <h6 class="text-muted">SKU: ${sku}</h6>
                <h6 class="text-muted">Marca: ${marca}</h6>
                <h3 class="text-primary mb-3">
                  ${producto.precio.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>

                <div class="p-3 bg-light rounded" style="max-height: 220px; overflow-y: auto;">
                  <strong>Descripción</strong>
                  <p class="mb-0">${producto.modeloProducto?.descripcion || producto.descripcion || ""}</p>
                </div>

                <div class="mt-4">
                  <div class="d-flex justify-content-center align-items-center gap-3 mb-3">
                    <div class="input-group input-group-sm" style="width: 130px;">
                      <button type="button" class="btn btn-outline-secondary btn-modal-cantidad" data-accion="restar">−</button>
                      <span class="input-group-text fw-bold justify-content-center cantidad-modal-valor" style="min-width: 44px;">1</span>
                      <button type="button" class="btn btn-outline-secondary btn-modal-cantidad" data-accion="sumar" data-stock="${producto.stock}">+</button>
                    </div>
                    <small class="text-muted">${producto.stock} disponibles</small>
                  </div>
                  ${botones(
                    `<i class="bi bi-cart-plus" style="font-size: 18px;"></i> Agregar al carrito`,
                    "primary boton-agregar-carrito-modal w-100",
                    "button",
                    `data-sku="${sku}" data-id="${producto.id}"`
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

export function mostrarFichaTecnicaConProducto(producto) {
  return renderFichaTecnica(producto);
}

export function mostrarFichaTecnica(producto_id) {
  const producto = productosBackend[producto_id];
  return renderFichaTecnica(producto);
}
