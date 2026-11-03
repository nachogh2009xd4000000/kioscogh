# KioscoGH: web del catálogo

Sitio estático (sin build) publicado en Netlify. Cada push a `main` se publica solo en menos de un minuto.

- `content/catalogo.json`: productos. Campos: `nombre`, `categoria`, `precio` (pesos; 0 = "Consultar"), `descripcion`, `foto` (ruta tipo `/img/productos/archivo.jpg`), `disponible`, `destacado` (etiqueta "Nuevo"), `estrella` (sale arriba en grande; es el lanzatelarañas), `oculto`.
- `content/kiosco.json`: nombre, frase, aviso destacado, dirección, horario, Instagram, alias de MercadoPago, WhatsApp.
- `img/productos/`: fotos (cuadradas, comprimidas a ~1200 px).

No hay panel de edición: nacho pasa productos y fotos por el proyecto de Claude y Claude actualiza estos archivos.
