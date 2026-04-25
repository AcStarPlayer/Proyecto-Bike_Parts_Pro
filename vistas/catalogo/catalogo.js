
import { navBar } from "../../componentes/barraNavegacion/barNav.js";
import { footer } from "../../componentes/piecero/footer.js";

const barraNav = document.querySelector(".nav-content");
barraNav.innerHTML = navBar("BikePartsPro", "Sube de nivel", "../../");


const CLAVE_ALMACENAMIENTO_PRODUCTOS = "productos";
const CLAVE_TEMA_VISUAL = "bikePartsPro_tema_visual";

const PRODUCTOS_PREDETERMINADOS = [
  {
    id: 'producto-001',
    sku: 'BPP-TR-0001',
    marca: 'Shimano',
    nombre: 'Cassette CS-M8100 12V 10-51T',
    precio: 315000,
    imagenes: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80'
    ],
    colores: [
      { nombre: 'Negro', codigo: '#111111' },
      { nombre: 'Gris', codigo: '#6b7280' },
      { nombre: 'Rojo', codigo: '#ef4444' }
    ],
    stock: 14,
    sistema: 'Transmisión'
  },
  {
    id: 'producto-002',
    sku: 'BPP-FR-0028',
    marca: 'SRAM',
    nombre: 'Disco CenterLine 180 mm Center Lock',
    precio: 189900,
    imagenes: [
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80'
    ],
    colores: [
      { nombre: 'Plata', codigo: '#c0c0c0' },
      { nombre: 'Negro', codigo: '#101010' }
    ],
    stock: 8,
    sistema: 'Frenos'
  },
  {
    id: 'producto-003',
    sku: 'BPP-RD-0102',
    marca: 'Race Face',
    nombre: 'Manubrio Atlas 35 mm 820 mm',
    precio: 420500,
    imagenes: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80'
    ],
    colores: [
      { nombre: 'Negro', codigo: '#111111' },
      { nombre: 'Verde', codigo: '#35c96b' },
      { nombre: 'Azul', codigo: '#2563eb' }
    ],
    stock: 5,
    sistema: 'Dirección y Control'
  },
  {
    id: 'producto-004',
    sku: 'BPP-TR-0001',
    marca: 'Shimano',
    nombre: 'Cassette CS-M8100 12V 10-51T',
    precio: 315000,
    imagenes: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80'
    ],
    colores: [
      { nombre: 'Negro', codigo: '#111111' },
      { nombre: 'Gris', codigo: '#6b7280' },
      { nombre: 'Rojo', codigo: '#ef4444' }
    ],
    stock: 14,
    sistema: 'Transmisión'
  },
  {
    id: 'producto-005',
    sku: 'BPP-FR-0028',
    marca: 'SRAM',
    nombre: 'Disco CenterLine 180 mm Center Lock',
    precio: 189900,
    imagenes: [
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80'
    ],
    colores: [
      { nombre: 'Plata', codigo: '#c0c0c0' },
      { nombre: 'Negro', codigo: '#101010' }
    ],
    stock: 8,
    sistema: 'Frenos'
  },
  {
    id: 'producto-006',
    sku: 'BPP-RD-0102',
    marca: 'Race Face',
    nombre: 'Manubrio Atlas 35 mm 820 mm',
    precio: 420500,
    imagenes: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80'
    ],
    colores: [
      { nombre: 'Negro', codigo: '#111111' },
      { nombre: 'Verde', codigo: '#35c96b' },
      { nombre: 'Azul', codigo: '#2563eb' }
    ],
    stock: 5,
    sistema: 'Dirección y Control'
  },
  {
    id: 'producto-007',
    sku: 'BPP-TR-0001',
    marca: 'Shimano',
    nombre: 'Cassette CS-M8100 12V 10-51T',
    precio: 315000,
    imagenes: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80'
    ],
    colores: [
      { nombre: 'Negro', codigo: '#111111' },
      { nombre: 'Gris', codigo: '#6b7280' },
      { nombre: 'Rojo', codigo: '#ef4444' }
    ],
    stock: 14,
    sistema: 'Transmisión'
  },
  {
    id: 'producto-008',
    sku: 'BPP-FR-0028',
    marca: 'SRAM',
    nombre: 'Disco CenterLine 180 mm Center Lock',
    precio: 189900,
    imagenes: [
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80'
    ],
    colores: [
      { nombre: 'Plata', codigo: '#c0c0c0' },
      { nombre: 'Negro', codigo: '#101010' }
    ],
    stock: 8,
    sistema: 'Frenos'
  },
  {
    id: 'producto-009',
    sku: 'BPP-RD-0102',
    marca: 'Race Face',
    nombre: 'Manubrio Atlas 35 mm 820 mm',
    precio: 420500,
    imagenes: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80'
    ],
    colores: [
      { nombre: 'Negro', codigo: '#111111' },
      { nombre: 'Verde', codigo: '#35c96b' },
      { nombre: 'Azul', codigo: '#2563eb' }
    ],
    stock: 5,
    sistema: 'Dirección y Control'
  },
  {
    id: 'producto-010',
    sku: 'BPP-TR-0001',
    marca: 'Shimano',
    nombre: 'Cassette CS-M8100 12V 10-51T',
    precio: 315000,
    imagenes: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80'
    ],
    colores: [
      { nombre: 'Negro', codigo: '#111111' },
      { nombre: 'Gris', codigo: '#6b7280' },
      { nombre: 'Rojo', codigo: '#ef4444' }
    ],
    stock: 14,
    sistema: 'Transmisión'
  }
];

function almacenamientoDisponible() {
  try {
    const clavePrueba = '__prueba_bike_parts_pro__';
    localStorage.setItem(clavePrueba, 'ok');
    localStorage.removeItem(clavePrueba);
    return true;
  } catch {
    return false;
  }
}

function formatearPrecioEnPesosColombianos(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

function leerDatosDesdeAlmacenamiento(clave, valorPredeterminado) {
  if (!almacenamientoDisponible()) return valorPredeterminado;

  const contenido = localStorage.getItem(clave);
  if (!contenido) return valorPredeterminado;

  try {
    return JSON.parse(contenido);
  } catch {
    return valorPredeterminado;
  }
}

function guardarDatosEnAlmacenamiento(clave, valor) {
  if (!almacenamientoDisponible()) return;
  localStorage.setItem(clave, JSON.stringify(valor));
}

function construirMiniaturasImagenes(listaImagenes) {
  return listaImagenes
    .map((rutaImagen, indice) => `
      <button
        type="button"
        class="miniatura-imagen-producto ${indice === 0 ? 'activa' : ''}"
        data-miniatura-imagen
        data-ruta-imagen="${rutaImagen}"
        aria-label="Ver imagen ${indice + 1} del producto"
      >
        <img src="${rutaImagen}" alt="Miniatura ${indice + 1} del producto" loading="lazy" />
      </button>
    `)
    .join('');
}

function construirColoresProducto(listaColores) {
  return listaColores
    .map((color, indice) => `
      <button
        type="button"
        class="color-producto ${indice === 0 ? 'activo' : ''}"
        data-color-producto
        data-nombre-color="${color.nombre}"
        title="${color.nombre}"
        aria-label="Seleccionar color ${color.nombre}"
        style="background-color: ${color.codigo};"
      ></button>
    `)
    .join('');
}

function construirTarjetaProducto(producto) {
  return `
    <article class="contenedor-tarjeta-producto-tecnica" data-tarjeta-producto data-id-producto="${producto.id}">
      <header class="encabezado-tarjeta-producto">
        <span class="etiqueta-superior-producto">${producto.sistema}</span>

        <div class="acciones-rapidas-producto">
          <button type="button" class="boton-icono-producto boton-favorito-producto" aria-label="Guardar en favoritos">❤</button>
          <button type="button" class="boton-icono-producto boton-comparar-producto" aria-label="Agregar a comparar">⇄</button>
        </div>
      </header>

      <section class="banner-imagenes-producto">
        <div class="marco-imagen-principal-producto">
          <img
            class="imagen-principal-producto"
            data-imagen-principal
            src="${producto.imagenes[0]}"
            alt="${producto.nombre}"
            loading="lazy"
          />
        </div>

        <div class="miniaturas-imagenes-producto">
          ${construirMiniaturasImagenes(producto.imagenes)}
        </div>
      </section>

      <div class="contenido-tarjeta-producto">
        <p class="sku-producto">SKU: ${producto.sku}</p>
        <p class="marca-producto">Marca: ${producto.marca}</p>
        <h3 class="nombre-producto">${producto.nombre}</h3>

        <div class="bloque-precio-producto">
          <span class="precio-producto">${formatearPrecioEnPesosColombianos(producto.precio)}</span>
        </div>

        <div class="fila-meta-producto">
          <span class="indicador-stock-producto">Stock: ${producto.stock} unidades</span>
          <span class="indicador-sistema-producto">Sistema: ${producto.sistema}</span>
        </div>

        <div class="colores-disponibles-producto">
          <span class="titulo-colores-producto">Colores disponibles:</span>
          <div class="lista-colores-producto">
            ${construirColoresProducto(producto.colores)}
          </div>
        </div>
        
        
        <div class="acciones-finales-producto">
          <button
            type="button"
            class="boton-agregar-carrito-producto"
            data-sku="${producto.sku}"
          >
            Agregar al carrito
          </button>
        </div>

      </div>
    </article>
  `;
}

function construirTarjetaCarga() {
  return `
    <article class="contenedor-tarjeta-producto-tecnica estado-carga-tarjeta">
      <div class="skeleton skeleton-linea-corta"></div>
      <div class="skeleton skeleton-imagen"></div>
      <div class="skeleton skeleton-linea-corta"></div>
      <div class="skeleton skeleton-linea-media"></div>
      <div class="skeleton skeleton-linea-larga"></div>
      <div class="skeleton skeleton-linea-media"></div>
      <div class="skeleton skeleton-boton"></div>
    </article>
  `;
}

class TarjetaProductoTecnicaDemo {
  constructor() {
    this.elementoContenedorTarjetas = document.querySelector('#contenedor-tarjetas-producto');
    this.elementoBotonRestablecer = document.querySelector('#boton-restablecer-datos');
    this.elementoBotonTema = document.querySelector('#boton-cambiar-tema');
    this.productos = [];
    this.temaActual = 'light';
  }

  iniciar() {
    this.renderizarCarga();

    setTimeout(() => {
      this.cargarProductos();
      this.renderizarTarjetas();
      inicializarCarritoCompras(this.productos);
      this.registrarEventosGlobales();
    }, 350);
  }

  cargarProductos() {
    const productosGuardados = leerDatosDesdeAlmacenamiento(CLAVE_ALMACENAMIENTO_PRODUCTOS, PRODUCTOS_PREDETERMINADOS);
    this.productos = Array.isArray(productosGuardados) ? productosGuardados : PRODUCTOS_PREDETERMINADOS;
    guardarDatosEnAlmacenamiento(CLAVE_ALMACENAMIENTO_PRODUCTOS, this.productos);
  }


  renderizarCarga() {
    if (!this.elementoContenedorTarjetas) return;
    this.elementoContenedorTarjetas.innerHTML = [construirTarjetaCarga(), construirTarjetaCarga(), construirTarjetaCarga()].join('');
  }

  renderizarTarjetas() {
    if (!this.elementoContenedorTarjetas) return;
    this.elementoContenedorTarjetas.innerHTML = this.productos.map((producto) => construirTarjetaProducto(producto)).join('');
    this.registrarEventosPorTarjeta();
  }

  registrarEventosGlobales() {
    this.elementoBotonRestablecer?.addEventListener('click', () => {
      guardarDatosEnAlmacenamiento(CLAVE_ALMACENAMIENTO_PRODUCTOS, PRODUCTOS_PREDETERMINADOS);
      this.cargarProductos();
      this.renderizarTarjetas();
    });

    this.elementoBotonTema?.addEventListener('click', () => {
      this.cambiarTemaVisual();
    });
  }

  registrarEventosPorTarjeta() {
    const tarjetas = this.elementoContenedorTarjetas.querySelectorAll('[data-tarjeta-producto]');

    tarjetas.forEach((tarjeta) => {
      this.registrarEventoMiniaturas(tarjeta);
      this.registrarEventoColores(tarjeta);
      this.registrarEventoFavoritos(tarjeta);
      this.registrarEventoComparar(tarjeta);
      this.registrarEventoAgregarCarrito(tarjeta);
    });
  }

  registrarEventoMiniaturas(tarjeta) {
    const imagenPrincipal = tarjeta.querySelector('[data-imagen-principal]');
    const miniaturas = tarjeta.querySelectorAll('[data-miniatura-imagen]');

    miniaturas.forEach((miniatura) => {
      miniatura.addEventListener('click', () => {
        miniaturas.forEach((elementoMiniatura) => elementoMiniatura.classList.remove('activa'));
        miniatura.classList.add('activa');
        imagenPrincipal.src = miniatura.dataset.rutaImagen;
      });
    });
  }

  registrarEventoColores(tarjeta) {
    const colores = tarjeta.querySelectorAll('[data-color-producto]');

    colores.forEach((color) => {
      color.addEventListener('click', () => {
        colores.forEach((elementoColor) => elementoColor.classList.remove('activo'));
        color.classList.add('activo');
      });
    });
  }

  registrarEventoFavoritos(tarjeta) {
    const botonFavorito = tarjeta.querySelector('.boton-favorito-producto');

    botonFavorito?.addEventListener('click', () => {
      botonFavorito.classList.toggle('activo');
    });
  }

  registrarEventoComparar(tarjeta) {
    const botonComparar = tarjeta.querySelector('.boton-comparar-producto');

    botonComparar?.addEventListener('click', () => {
      botonComparar.classList.toggle('activo');
    });
  }

  registrarEventoAgregarCarrito(tarjeta) {
    const botonAgregar = tarjeta.querySelector('.boton-agregar-carrito-producto');

    botonAgregar?.addEventListener('click', () => {
      const textoOriginal = 'Agregar al carrito';
      botonAgregar.textContent = 'Agregado';
      botonAgregar.classList.add('agregado');

      window.setTimeout(() => {
        botonAgregar.textContent = textoOriginal;
        botonAgregar.classList.remove('agregado');
      }, 1400);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const demoTarjetas = new TarjetaProductoTecnicaDemo();
  demoTarjetas.iniciar();
});

document.getElementById("footer").innerHTML = footer("../../");

const productos = JSON.parse(localStorage.getItem("productos") || "[]");
productos.concat(PRODUCTOS_PREDETERMINADOS);



