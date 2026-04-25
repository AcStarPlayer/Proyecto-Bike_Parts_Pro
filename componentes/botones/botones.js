
export function botones(title, extraClass = ""){
return `
<div class="button-container ${extraClass}"> <h5 class="tituloboton">${title}</h5>
</div>
`
}
//botones - lo mejor es modificar la clase o contenedor y asi les modificamos las propiedades.