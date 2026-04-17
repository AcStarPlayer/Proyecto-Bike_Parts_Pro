import tarjetaSoloTexto from "../../componentes/tarjetas/tarjetasSoloTexto/tarjetasSoloTexto.js";

const valoresEmpresariales = {
    "Misión": "Brindar repuestos de alta calidad que garanticen seguridad y rendimiento en cada trayecto.",
    "Visión": "Ser una empresa líder en soluciones para bicicletas, reconocida por innovación y confianza."
};

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