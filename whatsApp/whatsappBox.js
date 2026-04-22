function toggleWhatsApp() {
  const box = document.getElementById("whatsappBox");
  box.classList.toggle("active");
}

document.addEventListener('click', function(e) {
  const box = document.getElementById("whatsappBox");
  const btn = document.querySelector(".whatsapp-btn");
  
  if (!box.contains(e.target) && !btn.contains(e.target)) {
    box.classList.remove("active");
  }
});