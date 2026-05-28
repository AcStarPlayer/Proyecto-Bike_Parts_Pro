export function paginacion(numPaginas, paginaActual = 1) {
  const BLOQUE = 5;
  const bloqueActual = Math.ceil(paginaActual / BLOQUE);
  const inicio = (bloqueActual - 1) * BLOQUE + 1;

  let html = "";
  const fin = Math.min(numPaginas, inicio + BLOQUE - 1);
  for (let pagina = inicio; pagina <= fin; pagina++) {
    html += `
      <li class="page-item ${pagina === paginaActual ? "active" : ""}">
        <a
          class="page-link"
          href="#"
          data-page="${pagina}"
        >
          ${pagina}
        </a>
      </li>
    `;
  }
  const hidden = numPaginas <= 1 ? "d-none" : "";
  const prevDisabled = paginaActual === 1 ? "disabled" : "";
  const nextDisabled = paginaActual === numPaginas ? "disabled" : "";

  return `
        <nav aria-label="Page navigation"
     class="d-flex justify-content-center ${hidden}">
            <ul class="pagination mb-0">
                <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" aria-label="Previous" data-action="prev">
                    <span class="paginator" aria-hidden="true">&lsaquo;</span>
                </a>
                </li>
                ${html}
                <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" aria-label="Next" data-action="next">
                    <span class="paginator" aria-hidden="true">&rsaquo;</span>
                </a>
                </li>
            </ul>
            </nav>
    `;
}

export function cambiarPagina(link, estado) {

  const { paginaActual, totalPaginas } = estado;

  let nuevaPagina = paginaActual;

  if (link.dataset.page) {
    nuevaPagina = Number(link.dataset.page);
  }

  if (link.dataset.action === "prev" && paginaActual > 1) {
    nuevaPagina--;
  }

  if (link.dataset.action === "next" && paginaActual < totalPaginas) {
    nuevaPagina++;
  }

  return nuevaPagina;
}
