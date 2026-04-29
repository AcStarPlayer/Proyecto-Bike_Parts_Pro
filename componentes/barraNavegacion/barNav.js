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

function construirVistasPublicas(rutaBase = "") {
  return {
    Inicio: `${rutaBase}index.html`,
    Catálogo: `${rutaBase}vistas/catalogo/catalogo.html`,
    "Quienes somos": `${rutaBase}vistas/acercaDeNosotros/acercaDeNosotros.html`,
    "Contáctanos": `${rutaBase}vistas/contactenos/contacto.html`,
  };
}

function obtenerTextoRolNavbar(sesionUsuario) {
  if (!sesionUsuario || !sesionUsuario.autenticado) {
    return "";
  }

  if (sesionUsuario.rol === "admin") {
    return "Administrador auxiliar";
  }

  if (sesionUsuario.rol === "cliente" && sesionUsuario.clienteFiel) {
    return "Cliente premium";
  }

  return "Cliente";
}

function construirHtmlVistasPublicas(vistasPublicas) {
  let htmlVistas = "";

  for (const nombreVista in vistasPublicas) {
    htmlVistas += `
      <li>
        <a href="${vistasPublicas[nombreVista]}" class="nav-style-text px-3 py-2 d-block">
          ${nombreVista}
        </a>
      </li>
    `;
  }

  return htmlVistas;
}

function construirHtmlVistasPrivadas(sesionActiva, rutaBase = "") {
  let htmlVistasPrivadas = "";

  if (
    sesionActiva &&
    sesionActiva.autenticado &&
    sesionActiva.rol === "cliente" &&
    sesionActiva.clienteFiel
  ) {
    htmlVistasPrivadas += `
      <li>
        <a href="${rutaBase}vistas/promociones/descuentos-especiales.html" class="nav-style-text px-3 py-2 d-block">
          Descuentos especiales
        </a>
      </li>
    `;
  }

  if (
    sesionActiva &&
    sesionActiva.autenticado &&
    sesionActiva.rol === "admin"
  ) {
    htmlVistasPrivadas += `
      <li>
        <a href="${rutaBase}vistas/formulario/producto.html" class="nav-style-text px-3 py-2 d-block">
          Panel Admin
        </a>
      </li>
    `;
  }

  return htmlVistasPrivadas;
}

function construirBloqueSesion(sesionActiva, rutaBase = "") {
  const textoRolNavbar = obtenerTextoRolNavbar(sesionActiva);

  if (sesionActiva && sesionActiva.autenticado) {
    return `
      <div class="sesion-nav d-flex flex-column align-items-start gap-1">
        <span class="nav-style-text nav-user-pill">
          ${sesionActiva.nombre || "Usuario"}
        </span>
        <small class="nav-style-text nav-text">
          ${textoRolNavbar}
        </small>
        <button
          id="boton-cerrar-sesion"
          type="button"
          class="btn-cerrar-sesion-nav"
        >
          Cerrar sesión
        </button>
      </div>
    `;
  }

  return `
    <div class="sesion-nav d-flex flex-column align-items-start gap-1">
      <a href="${rutaBase}vistas/login/login.html" class="btn-login-nav">
        Ingresar
      </a>
      <a href="${rutaBase}vistas/login/login.html#signin" class="nav-style-text nav-link-registro">
        Registrarse
      </a>
    </div>
  `;
}

function construirHtmlNavbar(
  descripcionSitio,
  htmlVistasPublicas,
  htmlVistasPrivadas,
  bloqueSesion
) {
  return `
    <div class="logo-area">
      <div class="text-container">
        <span class="nav-style-text fw-bold">${descripcionSitio}</span>
        <small class="nav-style-text nav-text">Repuestos de alto rendimiento</small>
      </div>
    </div>

    <div class="menu-toggle" id="menu-toggle" aria-label="Abrir menú">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>

    <ul class="botones-nav" id="botones-nav">
      ${htmlVistasPublicas}
      ${htmlVistasPrivadas}
      <li class="nav-sesion-item">
        ${bloqueSesion}
      </li>
    </ul>
  `;
}

function inicializarMenuMovil(contenedorNavegacion) {
  const botonMenu = contenedorNavegacion.querySelector("#menu-toggle");
  const listaBotonesNavegacion =
    contenedorNavegacion.querySelector("#botones-nav");

  if (botonMenu && listaBotonesNavegacion) {
    botonMenu.addEventListener("click", () => {
      listaBotonesNavegacion.classList.toggle("active");
    });
  }
}

function inicializarCierreSesion(contenedorNavegacion, rutaBase = "") {
  const botonCerrarSesion =
    contenedorNavegacion.querySelector("#boton-cerrar-sesion");

  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("sesionBikePartsPro");
      window.location.href = `${rutaBase}vistas/login/login.html`;
    });
  }
}

export function navBar(descripcionSitio, rutaBase = "") {
  const contenedorNavegacion = document.createElement("nav");
  contenedorNavegacion.className = "nav-content sticky-top";
  document.body.prepend(contenedorNavegacion);

  const sesionActiva = obtenerSesionActiva();
  const vistasPublicas = construirVistasPublicas(rutaBase);
  const htmlVistasPublicas = construirHtmlVistasPublicas(vistasPublicas);
  const htmlVistasPrivadas = construirHtmlVistasPrivadas(
    sesionActiva,
    rutaBase
  );
  const bloqueSesion = construirBloqueSesion(sesionActiva, rutaBase);

  contenedorNavegacion.innerHTML = construirHtmlNavbar(
    descripcionSitio,
    htmlVistasPublicas,
    htmlVistasPrivadas,
    bloqueSesion
  );

  inicializarMenuMovil(contenedorNavegacion);
  inicializarCierreSesion(contenedorNavegacion, rutaBase);
}