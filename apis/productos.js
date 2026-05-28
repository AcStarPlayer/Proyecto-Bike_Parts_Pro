export const productosPredeterminados = [
  {
    sku: "BPP-012",
    titulo: "Cadena Shimano",
    precio: 45000,
    descripcion: "Cadena de alto rendimiento diseñada para bicicletas MTB y ruta, con excelente resistencia al desgaste y cambios suaves en cualquier terreno.",
    categoria: "transmision",
    imagen: "../../img/catalogo/1.webp"
  },
  {
    sku: "BPP-011",
    titulo: "Pacha Cassette Ruta 11Vel 11-32T",
    precio: 120000,
    descripcion: "Sistema de frenos de disco hidráulicos con máxima precisión y respuesta inmediata para una conducción más segura y estable.",
    categoria: "frenos",
    imagen: "../../img/catalogo/2.webp"
  },
  {
    sku: "BPP-010",
    titulo: "Cadena Amarrada",
    precio: 80000,
    descripcion: "Casco ultraligero con diseño aerodinámico y ventilación avanzada, ideal para ciclismo urbano y de montaña.",
    categoria: "direccion",
    imagen: "../../img/catalogo/3.webp"
  },
  {
    sku: "BPP-001",
    titulo: "Pedales aluminio",
    precio: 60000,
    descripcion: "Pedales fabricados en aluminio reforzado con superficie antideslizante para mayor estabilidad y control durante el pedaleo.",
    categoria: "transmision",
    imagen: "../../img/catalogo/4.webp"
  },
  {
    sku: "BPP-002",
    titulo: "Pedales",
    precio: 200000,
    descripcion: "Rin de 29 pulgadas construido en aleación resistente para soportar impactos extremos y recorridos exigentes.",
    categoria: "ruedas",
    imagen: "../../img/catalogo/5.webp"
  },
  {
    sku: "BPP-003",
    titulo: "Ruedas Ruta 700C 24H",
    precio: 55000,
    descripcion: "Sillín ergonómico acolchado que reduce la presión y mejora la comodidad en trayectos largos de ciclismo.",
    categoria: "direccion",
    imagen: "../../img/catalogo/6.webp"
  },
  {
    sku: "BPP-004",
    titulo: "Rueda De Disco Textreme Pro",
    precio: 70000,
    descripcion: "Manubrio de montaña fabricado en aluminio liviano para mayor control, estabilidad y resistencia en terrenos difíciles.",
    categoria: "direccion",
    imagen: "../../img/catalogo/7.webp"
  },
  {
    sku: "BPP-005",
    titulo: "Sillin",
    precio: 25000,
    descripcion: "Guantes transpirables con refuerzo antideslizante que mejoran el agarre y reducen la fatiga en las manos.",
    categoria: "direccion",
    imagen: "../../img/catalogo/8.webp"
  },
  {
    sku: "BPP-006",
    titulo: "Sillín De Bicicleta AS1",
    precio: 35000,
    descripcion: "Bomba portátil compacta compatible con válvulas Presta y Schrader, ideal para emergencias y ajustes rápidos.",
    categoria: "llantas",
    imagen: "../../img/catalogo/9.webp"
  },
  {
    sku: "BPP-007",
    titulo: "Suspención",
    precio: 90000,
    descripcion: "Kit multifuncional para mantenimiento de bicicletas con llaves hexagonales, desmontadores y herramientas esenciales.",
    categoria: "transmision",
    imagen: "../../img/catalogo/10.webp"
  },
  {
    sku: "BPP-008",
    titulo: "Cadena Shimano",
    precio: 45000,
    descripcion: "Cadena reforzada con tratamiento anticorrosivo que garantiza durabilidad y un rendimiento eficiente en cambios.",
    categoria: "transmision",
    imagen: "../../img/catalogo/11.webp"
  },
  {
    sku: "BPP-009",
    titulo: "Gafas ciclismo",
    precio: 45000,
    descripcion: "Gafas deportivas con protección UV y diseño envolvente para mayor seguridad visual en rutas de alta velocidad.",
    categoria: "direccion",
    imagen: "../../img/catalogo/12.webp"
  }
];

export function filtrarProductos(productos, { categoria = null, nombre = null } = {}) {
  return productos.filter((p) => {
    const matchCategoria = !categoria || p.categoria === categoria;
    const matchNombre = !nombre || p.titulo.toLowerCase().includes(nombre.toLowerCase());
    return matchCategoria && matchNombre;
  });
}