export function navBar(title, description, basePath = "") {
return `
<div class="logo-area">
<h5 class="nav-title" style="margin:0; font-weight:bold;">${title}</h5>
<p class="nav-text" style="margin:0; font-size:0.8rem;">${description}</p>
</div>

<ul class="botones-nav">
<li><a href="${basePath}index.html">Inicio</a></li>
<li><a href="#">Catalogo</a></li>
<li><a href="${basePath}vistas/acercaDeNosotros/acercaDeNosotros.html">Quienes somos</a></li>
<li><a href="${basePath}vistas/contactenos/contacto.html">Contactanos</a></li>
</ul>
`;
}