import tarjetaSoloTexto from "../../componentes/tarjetas/tarjetasSoloTexto/tarjetasSoloTexto.js";
import tarjetasConImagen from "../../componentes/tarjetas/tarjetasConImagen/tarjetasConImagen.js";
import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/piecero/footer.js";

const barraNav = document.querySelector(".nav-content");
barraNav.innerHTML = navBar("BikePartsPro", "Sube de nivel", "../../");

const valoresEmpresariales = {
  Misión:
    "Brindar repuestos de alta calidad que garanticen seguridad y rendimiento en cada trayecto.",
  Visión:
    "Ser una empresa líder en soluciones para bicicletas, reconocida por innovación y confianza.",
};
//insertando la navbar
const contenedorNav = document.querySelector(".nav-content")
contenedorNav.innerHTML = navBar("BikePartsPro","","../../");

const botonMenu = document.querySelector("#hamburguesa")
const listaLink = document.querySelector("#nav-list")

botonMenu.addEventListener("click", () =>{
  listaLink.classList.toggle("active")
  console.log("cambiando clase")

  
});

const misionVision = document.getElementById("mision-vision");

let html = "";

for (const key in valoresEmpresariales) {
  html += `
        <div class="col-md-6 mb-3">
            ${tarjetaSoloTexto(key, valoresEmpresariales[key])}
        </div>
    `;
}

misionVision.innerHTML = html;
const integrantes = [
  {
    nombre: "Alexandra Díaz",
    rol: "Frontend Developer",
    descripcion: "Apasionada por interfaces modernas y funcionales.",
    github: "https://github.com/alexandragdiaz",
    linkedin: "https://www.linkedin.com/in/alexandra-gutierrez-diaz-developer/",
    imagen: "../../img/foto1.jpeg",
  },
  {
    nombre: "Brayan Castro",
    rol: "FullStack Developer",
    descripcion: "Experiencia en apps web y e-commerce.",
    github: "https://github.com/AcStarPlayer",
    linkedin: "https://www.linkedin.com/in/bandresdev/",
    imagen: "../../img/foto3.jpeg",
  },
  {
    nombre: "Jordan Barrera",
    rol: "Frontend Developer",
    descripcion: "Interesado en desarrollo web y tecnología.",
    github: "https://github.com/AcStarPlayer",
    linkedin:
      "https://www.linkedin.com/in/jordan-alexis-barrera-calderon-desarrollador-fullstack/",
    imagen: "../../img/foto2.jpg",
  },
  {
    nombre: "Fernando Alayon",
    rol: "BackEnd Developer",
    descripcion: "Enfocado en bases de datos y aplicaciones web.",
    github: "https://github.com/feralayon",
    linkedin: "https://www.linkedin.com/in/freddy-fernando-alayon-cubillos",
    imagen: "../../img/foto4.png",
  },
  {
    nombre: "Leisy Sanchez",
    rol: "BackEnd Developer",
    descripcion: "Enfocado en bases de datos y aplicaciones web.",
    github: "https://github.com/Leisy17",
    linkedin: "https://www.linkedin.com/in/leisy-sanchez",
    imagen: "../../img/foto5.png",
  },
];

const integrantesDiv = document.getElementById("integrantes");

let cards = "";

integrantes.forEach((persona) => {
  const links = `
    <a href="${persona.github}" class="btn btn-dark btn-sm rounded-pill m-1 scale-hover">
      <i class="bi bi-github"></i>
    </a>
    <a href="${persona.linkedin}" class="btn btn-dark btn-sm rounded-pill m-1 scale-hover">
      <i class="bi bi-linkedin"></i>
    </a>
  `;

  cards += `
    <div class="col-sm-6 col-md-4">
      ${tarjetasConImagen(
        persona.nombre,
        persona.rol,
        persona.descripcion,
        persona.imagen,
        links,
        "sm",
      )}
    </div>
  `;
});

integrantesDiv.innerHTML = cards;
document.getElementById("footer").innerHTML = footer("../../");
