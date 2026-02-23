# Reserva de Tiquets Evento

Aplicación web para reserva de tickets de eventos con sistema de consumiciones.

## Características

- Sistema de contadores para seleccionar bebidas y vasos reutilizables
- Validación de pedidos (mínimo 1 bebida y 1 vaso obligatorio)
- Cálculo automático del total en tiempo real
- Guardar reservas en base de datos Supabase
- Envío de datos a webhook externo (Google Sheets)
- Pantalla de confirmación elegante
- Diseño responsive y moderno

## Configuración

### Variables de Entorno

Edita el archivo `.env` con tus credenciales:

```
VITE_SUPABASE_URL=tu-supabase-url
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbz50sWW5Eg4LjJ-wo_Q7FgYDh0Sg7IsMN9m4-LBnx697Pll0rIkKmob6PIfUmz3w5Lj/exec
```

### Webhook para Google Sheets

Para configurar el envío automático de emails y guardar en Google Sheets:

1. Crea un nuevo Google Apps Script en tu cuenta
2. Usa este código base:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Guardar en Google Sheets
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date(data.fecha),
      data.nombre,
      data.email,
      data.telefono,
      data.copas,
      data.cervezas,
      data.refrescos,
      data.vasos,
      data.total
    ]);

    // Enviar email al cliente
    MailApp.sendEmail({
      to: data.email,
      subject: 'Confirmación de reserva de tiquets 🎟️',
      htmlBody: `
        <h2>Hola ${data.nombre},</h2>
        <p>Tu reserva ha sido recibida correctamente.</p>

        <h3>Resumen de tu pedido:</h3>
        <ul>
          ${data.copas > 0 ? `<li>Copa / Combinado x${data.copas}: ${data.copas * 8}€</li>` : ''}
          ${data.cervezas > 0 ? `<li>Cerveza / Chupito x${data.cervezas}: ${data.cervezas * 4}€</li>` : ''}
          ${data.refrescos > 0 ? `<li>Refresco / Agua x${data.refrescos}: ${data.refrescos * 3}€</li>` : ''}
          ${data.vasos > 0 ? `<li>Vaso reutilizable x${data.vasos}: ${data.vasos * 1}€</li>` : ''}
        </ul>
        <p><strong>Total: ${data.total}€</strong></p>

        <h3>📌 INSTRUCCIONES DE PAGO</h3>
        <p>En breve recibirás instrucciones para realizar el pago de tus consumiciones.</p>
        <p>Tu reserva quedará confirmada una vez realizado el pago.</p>

        <h3>📍 RECOGIDA DE TIQUETS</h3>
        <p>Podrás recoger tus tiquets el día del evento en el punto habilitado en la entrada, indicando tu nombre.</p>

        <h3>📲 CONSULTAS</h3>
        <p>Para cualquier duda puedes escribir por WhatsApp al: <strong>+34 658 18 79 80</strong></p>
      `
    });

    // Enviar copia al organizador
    MailApp.sendEmail({
      to: 'TUEMAIL@TUEMAIL.COM',
      subject: 'Nueva reserva de tiquets',
      htmlBody: `
        <h2>Nueva reserva recibida</h2>
        <p><strong>Cliente:</strong> ${data.nombre}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Total:</strong> ${data.total}€</p>
      `
    });

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Despliega como Web App (Ejecutar como: yo, Acceso: Cualquiera)
4. Copia la URL del script y pégala en `VITE_WEBHOOK_URL`

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
```

## Despliegue en Vercel

1. Conecta tu repositorio en Vercel
2. Configura las variables de entorno en Vercel
3. Despliega
