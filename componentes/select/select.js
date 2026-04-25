export default function select(title, options) {
    const id = title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    let optionsHtml = "";
    for (const option of options) {
        optionsHtml += `<option value="${option}">${option}</option>`
    }
    return `
    <div class="fs-field">
      <label class="fs-label" for="${id}">${title}</label>
      <select id="${id}" name="${id}" class="fs-input form-control" style="font-size: inherit !important;">
          <option value="" selected disabled>Seleccione...</option>
          ${optionsHtml}
      </select>
    </div>
    `
}