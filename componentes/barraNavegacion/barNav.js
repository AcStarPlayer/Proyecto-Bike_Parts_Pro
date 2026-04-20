export function navBar(title, description) {
  return `
    <div class="logo-area">
      <h5 class="nav-title" style="margin:0; font-weight:bold;">${title}</h5>
      <p class="nav-text" style="margin:0; font-size:0.8rem;">${description}</p>
    </div>

    <ul class="botones-nav">
      <li><a href="#">Inicio</a></li>
      <li><a href="#">Catalogo</a></li>
      <li><a href="#">Quienes somos</a></li>
      <li><a href="contacto.html">Contactanos</a></li>
    </ul>
  `;
}