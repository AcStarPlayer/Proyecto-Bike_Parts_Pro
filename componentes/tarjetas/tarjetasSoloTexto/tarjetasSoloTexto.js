export default function tarjetaSoloTexto(title, description, size = "xs") {
  const sizes = {
    xs: "h-100",
    sm: "h-200",
    md: "h-300",
    lg: "h-400",
    xl: "h-500",
    xxl: "h-600",
  };

  return `
    <div class="p-4 shadow-sm rounded-4 bg-light ${sizes}">
        <h3 class="fw-bold text-primary">${title}</h3>
        <p>${description}</p>
    </div>
  `;
}