
export default function tarjetasConImagen(titulo, subtitulo, descripcion, imagen, links = null, tamano = "xs") {
  const tamanos = {
    xs: "h-100",
    sm: "h-200",
    md: "h-300",
    lg: "h-400",
    xl: "h-500",
    xxl: "h-600",
  };

  return `
    <div class="card shadow border-0 rounded-4 ${tamanos[tamano]}">
        <img src="${imagen}" class="card-img-top" alt="${titulo}">
        <div class="card-body text-center">
          <h5 class="fw-bold">${titulo}</h5>
          <p class="text-primary">${subtitulo}</p>
          <p>${descripcion}</p>
            ${links}
        </div>
    </div>
  `}
