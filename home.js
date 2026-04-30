// IMPORTACIONES
import { navBar } from "./componentes/barraNavegacion/barNav.js";
import { footer } from "./componentes/pieDePagina/footer.js";
import { inicializarBotonesCarrito } from "./vistas/carrito/carrito-events.js";

// NAV Y FOOTER
navBar("Sube de nivel", "./");

document.getElementById("footer").innerHTML = footer("../../");

// ================= CARRUSEL =================
