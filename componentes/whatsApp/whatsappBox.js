function toggleWhatsApp() {
  const box = document.getElementById("whatsappBox");
  box.classList.toggle("active");
}

window.toggleWhatsApp = toggleWhatsApp;

document.addEventListener("click", function (e) {
  const box = document.getElementById("whatsappBox");
  const btn = document.querySelector(".whatsapp-btn");
  if (!box || !btn) return;
  if (!box.contains(e.target) && !btn.contains(e.target)) {
    box.classList.remove("active");
  }
});

export function chatbox() {
  return `
    <div class="whatsapp-box" id="whatsappBox">
      <p>👋 Hola, ¿en qué podemos ayudarte?</p>
      <a href="https://wa.me/573000000123" target="_blank" class="btn-chat">
        Abrir chat
      </a>
    </div>
  `;
}

export function whatsappButton() {
  return `
    <div class="whatsapp-btn" onclick="toggleWhatsApp()">
      <i class="bi bi-whatsapp"></i>
    </div>
  `;
}
