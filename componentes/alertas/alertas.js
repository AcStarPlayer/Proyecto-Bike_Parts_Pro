export default function alertas(mensaje, tipo, titulo=null) {
    const tiposValidos = ['success', 'danger', 'warning'];
    const alertaTipo = tiposValidos.includes(tipo) ? tipo : 'danger';
    return `
        <div class="alert alert-${alertaTipo} mt-2 justify-content-center" role="alert">
        ${titulo ? `<h4 class="alert-heading">${titulo}</h4>`: ""}
        <p class="mb-0">${mensaje}</p>
      </div>
    `;
}