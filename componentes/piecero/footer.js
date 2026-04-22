export function footer(basePath = "") {
  return `
    <footer class="footer">
      <div class="footer-container">

        <div class="footer-col">
          <h3>Bike Parts Pro</h3>
          <h4>Somos una tienda Online especializada en la venta de repuestos,
            accesorios para la practica de tu deporte favorito.
          </h4>
        </div>

        <div class="footer-col">
          <h3>Nuestras políticas</h3>
          <a href="${basePath}componentes/piecero/pagesFooter/politicasEnvio.html">Politica de envíos</a>
          <a href="${basePath}componentes/piecero/pagesFooter/politicasDeCambios.html">Politica de cambios</a>
          <a href="${basePath}componentes/piecero/pagesFooter/politicasDeGarantias.html">Politica de garantías</a>
          <a href="${basePath}componentes/piecero/pagesFooter/politicasDePrivacidad.html">Politicas de privacidad</a>
          <a href="${basePath}componentes/piecero/pagesFooter/terminosyCondiciones.html">Términos y condiciones</a>
        </div>

        <div class="footer-col">
          <h3>Información de contacto</h3>
          <p><i class="bi bi-journals"></i> Contacto</p>
          <p>100% Online</p>
          <p><i class="bi bi-geo-alt me-2"></i> Bogotá DC, Colombia</p>
          <p><i class="bi bi-envelope me-2"></i> bikepartsprocolombia@gmail.com</p>
          <p><i class="bi bi-telephone me-2"></i> +57 300 0000000</p>
          <p><i class="bi bi-whatsapp me-2 text-success"></i> WhatsApp: 300 0000000</p>
        </div>

        <div class="footer-col">
          <h3>Redes Sociales</h3>
          <div class="social-icons">
            <a href="#" target="_blank" class="social-icon"><i class="bi bi-instagram"></i></a>
            <a href="#" target="_blank" class="social-icon"><i class="bi bi-facebook"></i></a>
            <a href="#" target="_blank" class="social-icon"><i class="bi bi-tiktok"></i></a>
          </div>
        </div>

      </div>

      <div class="linea-blanca"></div>

      <div class="text-center">
        <p class="mb-0">© 2026 Bike Parts Pro</p>
      </div>
    </footer>
  `;
}
