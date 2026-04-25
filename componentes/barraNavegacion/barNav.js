export function navBar(title, description, basePath = "") {
return `
<div class="logo-area">
<img src="/../img/logo2.png" alt="logo" class= "nav-logo">
<h5 class="nav-title" style="margin:0; font-weight:bold;">${title}</h5>
<p class="nav-text" style="margin:0; font-size:0.8rem;">${description}</p>
</div>

<div class="menu-toggle" id="hamburguesa">
     <span class="bar"></span>
     <span class="bar"></span>
     <span class="bar"></span>
     </div>
  


<ul class="botones-nav" id="nav-list">
<li><a href="${basePath}index.html">Inicio</a></li>
<li><a href="#">Catalogo</a></li>
<li><a href="${basePath}vistas/acercaDeNosotros/acercaDeNosotros.html">Quienes somos</a></li>
<li><a href="${basePath}vistas/contactenos/contacto.html">Contactanos</a></li>
</ul>
`;
}
