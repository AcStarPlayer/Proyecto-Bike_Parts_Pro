fetch("/Proyecto-Bike_Parts_Pro/footer/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

  document.addEventListener("DOMContentLoaded", function() {
    const footerContainer = document.getElementById("footer");
    
    if (!footerContainer) {
        console.error("No se encontró el elemento #footer");
        return;
    }

    // Ruta relativa desde contacto.html hasta footer.html
    fetch("../footer/footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            footerContainer.innerHTML = data;
            console.log("✅ Footer cargado correctamente");
        })
        .catch(error => {
            console.error("❌ Error cargando el footer:", error);
            // Mensaje de fallback por si falla
            footerContainer.innerHTML = `
                <footer style="background:#0f172a; color:white; padding:40px; text-align:center;">
                    <p>© 2026 Bike Parts Pro - Error al cargar footer dinámico</p>
                </footer>`;
        });
});