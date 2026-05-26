export default function tarjetasConImagen(
  titulo,
  subtitulo=null,
  descripcion,
  imagen,
  links = "",
  tamano = "sm",
  align = "center",
  tag=null
) {

  const alignClass = align === 'center' ? 'center' : align === 'end' ? 'end' : 'start';

  const ratios = {
    xxs: "ratio-4x3",
    xs: "ratio-1x1",
    sm: "ratio-4x3",
    md: "ratio-16x9",
    lg: "ratio-1x1"
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
             class="w-100 h-100 object-fit-${tag ? `contain`: `cover`} rounded-top-4"
             style="object-position: center;"
             alt="${titulo}">
      </div>

      <div class="card-body text-${alignClass} d-flex flex-column">
        ${tag ? `<div class="tag">${tag}</div>`: ""}
        <div class="fw-bold tarjetaConImagen-titulo">${titulo}</div>
        ${ subtitulo ? `<p class="tarjetaConImagen-subtitulo text-muted mb-0">${subtitulo}</p>`: ""}

        ${descripcion ? `<p class="mt-2 mb-2 tarjetaConImagen-descripcion">
          ${descripcion}
        </p>`: ""}

        <div class="mt-auto d-flex justify-content-center">
          ${links}
        </div>

      </div>

    </div>
  `;
}