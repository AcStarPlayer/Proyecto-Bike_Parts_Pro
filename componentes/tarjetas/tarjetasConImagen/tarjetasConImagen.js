export default function tarjetasConImagen(
  titulo,
  subtitulo,
  descripcion,
  imagen,
  links = "",
  tamano = "sm"
) {

  const ratios = {
    xxs: "ratio-4x3",
    xs: "ratio-1x1",
    sm: "ratio-4x3",
    md: "ratio-16x9",
    lg: "ratio-16x9"
  };

  const widths = {
    xxs: "16rem",
    xs: "18rem",
    sm: "20rem",
    md: "22rem",
    lg: "24rem"
  };

  return `
    <div class="card shadow border-0 rounded-4 mx-auto d-flex flex-column"
         style="width: ${widths[tamano]}; max-width: 100%; height: 100%;">

      <div class="ratio ${ratios[tamano]}">
        <img src="${imagen}" 
             class="w-100 h-100 object-fit-cover rounded-top-4"
             style="object-position: center;"
             alt="${titulo}">
      </div>

      <div class="card-body text-center d-flex flex-column">

        <h5 class="fw-bold">${titulo}</h5>
        <p class="text-primary">${subtitulo}</p>

        <p class="mb-2">
          ${descripcion}
        </p>

        <div class="mt-auto">
          ${links}
        </div>

      </div>

    </div>
  `;
}