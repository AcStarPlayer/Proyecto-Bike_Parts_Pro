import {
  obtenerSesionActiva,
  limpiarSesion,
} from "../../autorizaciones/autorizaciones.js";

function normalizarNombre(nombre) {
  const primeraPalabra = nombre.match(/^\s*(\S+)/)[1];
  return primeraPalabra[0].toUpperCase() + primeraPalabra.slice(1).toLowerCase();
}

function construirVistasPublicas(basePath = "") {
  return {
    Inicio: `${basePath}index.html`,
    Catálogo: `${basePath}vistas/catalogo/catalogo.html`,
    "Quienes somos": `${basePath}vistas/acercaDeNosotros/acercaDeNosotros.html`,
    "Contáctanos": `${basePath}vistas/contactenos/contacto.html`,
  };
}

function construirVistasPrivadas(sesionActiva, basePath = "") {
  const vistasPrivadas = {};

  if (
    sesionActiva &&
    sesionActiva.autenticado &&
    (sesionActiva.rol === "admin" || sesionActiva.adminAuxiliar)
  ) {
    vistasPrivadas["Panel Admin"] =
      `${basePath}vistas/admin/productos/producto.html`;
  }

  return vistasPrivadas;
}

function construirLinksVistas(vistas) {
  let viewsHtml = "";

  for (const view in vistas) {
    viewsHtml += `
      <li class="p-1">
        <a
          class="nav-style-text w-100 d-flex justify-content-center align-items-center d-block h-100 p-3"
          href="${vistas[view]}"
        >
          ${view}
        </a>
      </li>
    `;
  }

  return viewsHtml;
}

function construirBotonIngreso(basePath = "") {
  return `
    <a
      href="${basePath}vistas/login/login.html"
      class="ingreso"
      aria-label="Ir a iniciar sesión"
      title="Iniciar sesión"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
      </svg>
    </a>
  `;
}

const SVG_PERSONA = `
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
  </svg>
`;

const SVG_CERRAR_SESION = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16" aria-hidden="true">
    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
  </svg>
`;

function construirBloqueSesion(sesionActiva, basePath = "") {
  if (!sesionActiva || !sesionActiva.autenticado) {
    return construirBotonIngreso(basePath);
  }

  const nombre = normalizarNombre(sesionActiva.nombre);

  return `
    <div class="sesion-nav">
      <div class="sesion-nav-header">
        <span class="ingreso">${SVG_PERSONA}</span>
        <div class="sesion-nav-textos">
          <span class="nav-style-text sesion-nombre">${nombre || "Usuario"}</span>
        </div>
      </div>
      <button type="button" class="btn-cerrar-sesion-nav boton-cerrar-sesion" aria-label="Cerrar sesión" title="Cerrar sesión">
        ${SVG_CERRAR_SESION}
      </button>
    </div>
  `;
}

function construirBloqueSesionMovil(sesionActiva, basePath = "") {
  if (!sesionActiva || !sesionActiva.autenticado) {
    return construirBotonIngreso(basePath);
  }

  const nombre = normalizarNombre(sesionActiva.nombre);

  return `
    <div class="sesion-nav">
      <div class="sesion-nav-header">
        <span class="ingreso">${SVG_PERSONA}</span>
        <div class="sesion-nav-textos">
          <span class="nav-style-text sesion-nombre">${nombre || "Usuario"}</span>
        </div>
      </div>
    </div>
  `;
}

function construirItemCerrarSesionMenu(sesionActiva) {
  if (!sesionActiva || !sesionActiva.autenticado) return "";

  return `
    <li class="p-1 item-cerrar-sesion-menu">
      <button type="button" class="boton-cerrar-sesion btn-menu-cerrar-sesion nav-style-text w-100 d-flex justify-content-center align-items-center h-100 p-3 gap-2">
        ${SVG_CERRAR_SESION}
        Cerrar sesión
      </button>
    </li>
  `;
}

function construirHtmlNavbar(description, viewsHtml, bloqueSesionDesktop, bloqueSesionMovil, basePath = "") {
  return `
    <div class="logo-area">
      <a href="${basePath}index.html" class="logo-link" aria-label="Ir al inicio">
        <img src="${basePath}img/logo.svg" alt="Logo BikePartsPro" class="nav-logo">
        <span class="separator"></span>
        <div class="text-container">
          <h3 class="nav-title nav-style-text m-0">
            BikeParts<span class="badge-pro">PRO</span>
          </h3>
          <p class="nav-text m-0">${description}</p>
        </div>
      </a>
    </div>

    <div class="search-container">
      <input
        id="busqueda"
        type="text"
        placeholder="Busca tu repuesto aquí"
        autocomplete="off"
      >
      <div id="desplegado"></div>
      <button type="button" id="boton-buscar">Buscar</button>
    </div>
    <div class="d-flex flex-row">
    <div class="nav-session-wrapper" id="mobile-nav">
      ${bloqueSesionMovil}
    </div>
    <button
      class="menu-toggle p-2 rounded-1"
      id="hamburguesa"
      type="button"
      aria-label="Abrir menú"
      aria-expanded="false"
      aria-controls="nav-list"
    >
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
    </div>
    <ul class="botones-nav p-0" id="nav-list">
      ${viewsHtml}
    </ul>
    <div class="nav-session-wrapper" id="desktop-nav">
      ${bloqueSesionDesktop}
    </div>
  `;
}

function inicializarMenuMovil(container) {
  const botonMenu = container.querySelector("#hamburguesa");
  const listaLink = container.querySelector("#nav-list");

  if (!botonMenu || !listaLink) {
    return;
  }

  botonMenu.addEventListener("click", () => {
    const estaActivo = listaLink.classList.toggle("active");
    botonMenu.setAttribute("aria-expanded", String(estaActivo));
  });
}

function inicializarBuscador(container, basePath = "") {
  const partes = [
    "sillin",
    "silla",
    "timon",
    "Freno regular",
    "Freno de disco",
    "llanta",
    "rueda",
    "casco",
    "corazas",
    "marco",
    "cuadro",
  ];

  const busqueda = container.querySelector("#busqueda");
  const desplegado = container.querySelector("#desplegado");
  const botonBuscar = container.querySelector("#boton-buscar");

  if (!busqueda || !desplegado || !botonBuscar) {
    return;
  }

  function limpiarSugerencias() {
    desplegado.innerHTML = "";
  }

  function renderSugerencias(termino) {
    limpiarSugerencias();

    if (!termino) {
      return;
    }

    const coincidencias = partes.filter((parte) =>
      parte.toLowerCase().includes(termino.toLowerCase())
    );

    if (!coincidencias.length) {
      return;
    }

    const listaResultados = document.createElement("ul");
    listaResultados.className = "lista-busqueda-rapida";

    coincidencias.forEach((parte) => {
      const item = document.createElement("li");
      item.textContent = parte;
      item.style.cursor = "pointer";

      item.addEventListener("click", () => {
        busqueda.value = parte;
        limpiarSugerencias();
      });

      listaResultados.appendChild(item);
    });

    desplegado.appendChild(listaResultados);
  }

  busqueda.addEventListener("input", () => {
    const termino = busqueda.value.trim();
    renderSugerencias(termino);
  });

  botonBuscar.addEventListener("click", () => {
    const termino = busqueda.value.trim().toLowerCase();

    if (!termino) {
      return;
    }

    const coincidencia = partes.find((parte) =>
      parte.toLowerCase().includes(termino)
    );

    if (coincidencia) {
      busqueda.value = coincidencia;
      limpiarSugerencias();
      window.location.href = `${basePath}vistas/catalogo/catalogo.html?busqueda=${encodeURIComponent(coincidencia)}`;
    }
  });

  document.addEventListener("click", (event) => {
    if (!container.contains(event.target)) {
      limpiarSugerencias();
    }
  });
}

function inicializarCierreSesion(container, basePath = "") {
  container.addEventListener("click", (event) => {
    const botonCerrarSesion = event.target.closest(".boton-cerrar-sesion");

    if (!botonCerrarSesion) {
      return;
    }

    limpiarSesion();
    window.location.href = `${basePath}vistas/login/login.html`;
  });
}

export function navBar(description, basePath = "") {
  const container = document.createElement("nav");
  container.className = "nav-content sticky-top";
  document.body.prepend(container);

  const sesionActiva = obtenerSesionActiva();
  const vistasPublicas = construirVistasPublicas(basePath);
  const vistasPrivadas = construirVistasPrivadas(sesionActiva, basePath);

  const itemCerrarSesion = construirItemCerrarSesionMenu(sesionActiva);
  const viewsHtml =
    construirLinksVistas(vistasPublicas) +
    construirLinksVistas(vistasPrivadas) +
    itemCerrarSesion;

  const bloqueSesionDesktop = construirBloqueSesion(sesionActiva, basePath);
  const bloqueSesionMovil = construirBloqueSesionMovil(sesionActiva, basePath);

  container.innerHTML = construirHtmlNavbar(
    description,
    viewsHtml,
    bloqueSesionDesktop,
    bloqueSesionMovil,
    basePath
  );

  inicializarMenuMovil(container);
  inicializarBuscador(container, basePath);
  inicializarCierreSesion(container, basePath);
}
