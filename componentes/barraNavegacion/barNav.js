import { partes } from "../../apis/producto-busqueda.js";

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
    viewsHtml += `<li class="p-1"><a class="nav-style-text d-flex justify-content-center align-items-center d-block h-100 p-3" href="${views[view]}">${view}</a></li>`
  }

  container.innerHTML = `
    <div class="logo-area">
      <img src="/../img/logo.svg" alt="logo" class="nav-logo">
      <span class="separator"></span>
      <div class="text-container">
        <h5 class="nav-title m-0">
          BikeParts<span class="badge-pro">PRO</span>
        </h5>
        <p class="nav-text m-0 f" style="color: var(--color-light);">${description}</p>
      </div>
    </div>
      <div class="search-container">
      <div class="busqueda-container">
        <input id=busqueda type="text" placeholder="Busca tu repuesto aquí">
        <button><i class="bi bi-search"></i></button>
      </div>
      
      <div id=desplegado></div>
      
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
    <button class="ingreso rounded-1 gap-2"><i class="bi bi-person"></i><span class="ingreso-text">Ingresa</span></button>
  `;

  const botonMenu = container.querySelector("#hamburguesa");
  const listaLink = container.querySelector("#nav-list");

  botonMenu.addEventListener("click", () => {
    listaLink.classList.toggle("active");
  });
  
   const busqueda = document.getElementById("busqueda")
   const desplegado = document.getElementById("desplegado")

   busqueda.addEventListener("input",function (){
    const busquedaUsuario = busqueda.value.toLowerCase();
    desplegado.innerHTML = ""
    if (busquedaUsuario.length === 0){
      return
      }
    else{
      const listaResultados = document.createElement("ul")
      listaResultados.classList = "lista-busqueda-rapida"
        partes.forEach(parte => {
            if (parte.toLowerCase().includes(busquedaUsuario)){
              const p = document.createElement("p")
              p.textContent = parte
              p.style.cursor = "pointer"
            
              p.onclick = () => {
              busqueda.value = parte
              desplegado.innerHTML = ""
              }  
              listaResultados.appendChild(p)
            }
        })
      desplegado.appendChild(listaResultados) 
    }
  })
  }


