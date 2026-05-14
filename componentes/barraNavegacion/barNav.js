function obtenerSesionActiva() {
  try {
    const sesionGuardada = JSON.parse(
      localStorage.getItem("sesionBikePartsPro") || "null"
    );

    if (!sesionGuardada || typeof sesionGuardada !== "object") {
      return null;
    }

    return sesionGuardada;
  } catch (error) {
    console.error("No fue posible leer la sesión activa:", error);
    return null;
  }
}

function construirVistasPublicas(basePath = "") {
  return {
    "Inicio": `${basePath}index.html`,
    "Catálogo": `${basePath}vistas/catalogo/catalogo.html`,
    "Quienes somos": `${basePath}vistas/acercaDeNosotros/acercaDeNosotros.html`,
    "Contáctanos": `${basePath}vistas/contactenos/contacto.html`
  };
}

function construirVistasPrivadas(sesionActiva, basePath = "") {
  const vistasPrivadas = {};

  if (
    sesionActiva &&
    sesionActiva.autenticado &&
    sesionActiva.rol === "cliente" &&
    sesionActiva.clienteFiel
  ) {
    vistasPrivadas["Descuentos especiales"] =
      `${basePath}vistas/promociones/descuentos-especiales.html`;
  }

  if (
    sesionActiva &&
    sesionActiva.autenticado &&
    sesionActiva.rol === "admin"
  ) {
    vistasPrivadas["Panel Admin"] =
      `${basePath}vistas/admin/productos/producto.html`;
  }

  return vistasPrivadas;
}

function obtenerTextoRolNavbar(sesionActiva) {
  if (!sesionActiva || !sesionActiva.autenticado) {
    return "";
  }

  if (sesionActiva.rol === "admin") {
    return "Administrador auxiliar";
  }

  if (sesionActiva.rol === "cliente" && sesionActiva.clienteFiel) {
    return "Cliente premium";
  }

  return "Cliente";
}

function construirLinksVistas(vistas) {
  let viewsHtml = "";

  for (const view in vistas) {
    viewsHtml += `
      <li class="p-1">
        <a class="nav-style-text w-100 d-flex justify-content-center align-items-center d-block h-100 p-3" href="${vistas[view]}">
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

function construirBloqueSesion(sesionActiva, basePath = "") {
  if (!sesionActiva || !sesionActiva.autenticado) {
    return construirBotonIngreso(basePath);
  }

  const textoRol = obtenerTextoRolNavbar(sesionActiva);

  return `
    <div class="sesion-nav">
      <div class="d-flex align-items-center gap-2">
        <a
          href="${basePath}vistas/login/login.html"
          class="ingreso"
          aria-label="Ir a la vista de usuario"
          title="Usuario"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
        </a>
        <span class="nav-style-text">${sesionActiva.nombre || "Usuario"}</span>
      </div>
      <small class="nav-text">${textoRol}</small>
      <button id="boton-cerrar-sesion" type="button" class="btn-cerrar-sesion-nav">
        Cerrar sesión
      </button>
    </div>
  `;
}

function construirHtmlNavbar(description, viewsHtml, bloqueSesion, basePath = "") {
  return `
    <div class="logo-area">
      <a href="${basePath}index.html" aria-label="Ir al inicio">
        <img src="/../img/logo.svg" alt="Logo BikePartsPro" class="nav-logo">
        <span class="separator"></span>
        <div class="text-container">
          <h5 class="nav-title nav-style-text m-0">
            BikeParts<span class="badge-pro">PRO</span>
          </h5>
          <p class="nav-text m-0 f">${description}</p>
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

    <ul class="botones-nav p-0" id="nav-list">
      ${viewsHtml}
    </ul>

    <div class="nav-session-wrapper">
      ${bloqueSesion}
    </div>
  `;
}

function inicializarMenuMovil(container) {
  const botonMenu = container.querySelector("#hamburguesa");
  const listaLink = container.querySelector("#nav-list");

  if (botonMenu && listaLink) {
    botonMenu.addEventListener("click", () => {
      const estaActivo = listaLink.classList.toggle("active");
      botonMenu.setAttribute("aria-expanded", String(estaActivo));
    });
  }
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
    "cuadro"
  ];

  const busqueda = container.querySelector("#busqueda");
  const desplegado = container.querySelector("#desplegado");
  const botonBuscar = container.querySelector("#boton-buscar");

  if (!busqueda || !desplegado || !botonBuscar) {
    return;
  }

  function renderSugerencias(termino) {
    desplegado.innerHTML = "";

    if (!termino) {
      return;
    }

    const coincidencias = partes.filter((parte) =>
      parte.toLowerCase().includes(termino.toLowerCase())
    );

    coincidencias.forEach((parte) => {
      const p = document.createElement("p");
      p.textContent = parte;
      p.style.cursor = "pointer";

      p.addEventListener("click", () => {
        busqueda.value = parte;
        desplegado.innerHTML = "";
      });

      desplegado.appendChild(p);
    });
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
      desplegado.innerHTML = "";
      window.location.href = `${basePath}vistas/catalogo/catalogo.html?busqueda=${encodeURIComponent(coincidencia)}`;
    }
  });

  document.addEventListener("click", (event) => {
    if (!container.contains(event.target)) {
      desplegado.innerHTML = "";
    }
  });
}

function inicializarCierreSesion(container, basePath = "") {
  const botonCerrarSesion = container.querySelector("#boton-cerrar-sesion");

  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("sesionBikePartsPro");
      window.location.href = `${basePath}vistas/login/login.html`;
    });
  }
}

export function navBar(description, basePath = "") {
  const container = document.createElement("nav");
  container.className = "nav-content sticky-top";
  document.body.prepend(container);

  const sesionActiva = obtenerSesionActiva();
  const vistasPublicas = construirVistasPublicas(basePath);
  const vistasPrivadas = construirVistasPrivadas(sesionActiva, basePath);

  const viewsHtml =
    construirLinksVistas(vistasPublicas) +
    construirLinksVistas(vistasPrivadas);

  const bloqueSesion = construirBloqueSesion(sesionActiva, basePath);

  container.innerHTML = construirHtmlNavbar(
    description,
    viewsHtml,
    bloqueSesion,
    basePath
  );

  inicializarMenuMovil(container);
  inicializarBuscador(container, basePath);
  inicializarCierreSesion(container, basePath);
}
