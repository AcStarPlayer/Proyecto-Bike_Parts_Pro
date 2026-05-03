
export function botones(title, extraClass = "", type = "button", atributos = "") {
  return `
    <button type="${type}" class="btn btn-${extraClass} w-100 btn-action" ${atributos}>
      ${title}
    </button>
  `;
}
//botones - lo mejor es modificar la clase o contenedor y asi les modificamos las propiedades.