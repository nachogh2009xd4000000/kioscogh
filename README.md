# KioscoGH: pedidos de impresión 3D

Sitio estático (sin build) en Netlify. Cada push a `main` se publica solo.

- `index.html`: formulario de pedidos (Netlify Forms, con archivo adjunto de hasta 8 MB), medidas de la impresora (Ender 3 V3 SE: 22 × 22 × 25 cm, una sola pieza), cómo pagar con MercadoPago, dirección e Instagram.
- `gracias.html`: página que ve el cliente después de mandar el pedido.
- `js/pedido.js`: avisa si la medida no entra en la impresora o si el archivo pesa demasiado.
- `qr/`: QR para imprimir (web y MercadoPago).

Los pedidos llegan a Netlify → tu proyecto → **Forms**. Para recibirlos por mail: Project configuration → Notifications → Emails and webhooks → Form submission notifications.

**Importante:** Netlify detecta el formulario recién en el deploy que viene *después* de activar "Enable form detection". Si al enviar un pedido aparece "Page not found", hay que volver a publicar (Deploys → Trigger deploy → Deploy project).
