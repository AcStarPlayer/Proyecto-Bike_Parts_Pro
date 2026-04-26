
export function botones(title, extraClass = "primary"){
return `
<button type="button" class="btn btn-${extraClass} w-100 btn-action">${title}</button>
`
}
//botones - lo mejor es modificar la clase o contenedor y asi les modificamos las propiedades.