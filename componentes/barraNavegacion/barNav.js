export function navBar(description, basePath = "") {
  const container = document.createElement("nav");
  container.className = "nav-content sticky-top";
  document.body.prepend(container);
  const views = {
    "Inicio": `${basePath}index.html`,
    "Catálogo": `${basePath}vistas/catalogo/catalogo.html`,
    "Quienes somos": `${basePath}vistas/acercaDeNosotros/acercaDeNosotros.html`,
    "Contáctanos": `${basePath}vistas/contactenos/contacto.html`
  }
  let viewsHtml = "";

  for (const view in views) {
    viewsHtml += `<li class="p-1"><a class="nav-style-text w-100 d-flex justify-content-center align-items-center d-block h-100 p-3" href="${views[view]}">${view}</a></li>`
  }

  container.innerHTML = `
    <div class="logo-area">
      <img src="/../img/logo.svg" alt="logo" class="nav-logo">
      <span class="separator"></span>
      <div class="text-container">
        <h5 class="nav-title nav-style-text m-0">
          BikeParts<span class="badge-pro">PRO</span>
        </h5>
        <p class="nav-text m-0 f" style="color: var(--color-light);">${description}</p>
      </div>
    </div>
      <div class="search-container">
      <input id=busqueda type="text" placeholder="Busca tu repuesto aquí">
      <div id=desplegado></div>
      <button>Buscar</button>
    </div>
</svg><button></div>
    <button class="menu-toggle p-2 rounded-1" id="hamburguesa">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>


    <ul class="botones-nav p-0" id="nav-list">
      ${viewsHtml}
    </ul>
    <div><button class="ingreso"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg><button></div>
  `;

  const botonMenu = container.querySelector("#hamburguesa");
  const listaLink = container.querySelector("#nav-list");

  botonMenu.addEventListener("click", () => {
    listaLink.classList.toggle("active");
  });
  //display del navbar
  const partes = ["sillin", "silla", "timon","Freno regular","Freno de disco","llanta","rueda","casco","corazas","marco","cuadro"]

   const busqueda = document.getElementById("busqueda")
   const desplegado = document.getElementById("desplegado")

   busqueda.addEventListener("input",function (){
    busquedaUsuario = busqueda.value.toLowerCase();
    desplegado.innerHTML = ""
    if (busquedaUsuario.length === 0){
      return
    }
    partes.forEach(parte => {
      if (parte.toLowerCase().includes(busquedaUsuario)){
        const p = document.createElement("p")
        p.textContent = parte
        p.style.cursor = "pointer"

        p.onclick = () => {
        busqueda.value = parte
        desplegado.innerHTML = ""
        } 
        desplegado.appendChild(p)
      }


    })
   })

   
}