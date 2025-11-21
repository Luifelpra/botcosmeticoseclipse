// ==================================================
// ECLIPSE BEAUTY BRANDS - DIAGNOSTICO COMPLETO WEBHOOK
// ==================================================

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware para logging completo
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Log de todas las solicitudes HTTP
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] SOLICITUD ${req.method} ${req.url}`);
  console.log(`User-Agent: ${req.headers["user-agent"] || "No disponible"}`);
  console.log(
    `Content-Type: ${req.headers["content-type"] || "No disponible"}`
  );
  next();
});

// Ruta principal
app.get("/", (req, res) => {
  res.send(`
    <h1>Eclipse Beauty Brands - Servidor Webhook</h1>
    <p>Servidor activo y monitoreando mensajes</p>
    <ul>
      <li>Facebook Messenger: Pendiente</li>
      <li>Instagram Direct: Activo</li>
      <li>Webhook: /webhook</li>
      <li>Health: /health</li>
    </ul>
  `);
});

// Salud del servidor
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "eclipse-beauty-webhook",
    timestamp: new Date().toISOString(),
    platform: "Render",
  });
});

// Informacion de empresa
app.get("/empresa", (req, res) => {
  res.json({
    nombre: "Eclipse Beauty Brands",
    tipo: "Distribuidor oficial de cosmeticos",
    horario_atencion: "Lunes a Sabado: 9:00 - 19:00",
    webhook_status: "monitoreo_activo",
  });
});

// Verificacion webhook
app.get("/webhook", (req, res) => {
  console.log("=== SOLICITUD DE VERIFICACION WEBHOOK ===");
  console.log("Parametros recibidos:", JSON.stringify(req.query, null, 2));

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log(`Modo: ${mode}`);
  console.log(`Token recibido: ${token}`);
  console.log(`Token esperado: ${process.env.VERIFY_TOKEN}`);
  console.log(`Challenge: ${challenge}`);

  if (mode && token === process.env.VERIFY_TOKEN) {
    console.log("RESULTADO: Webhook verificado exitosamente");
    return res.status(200).send(challenge);
  } else {
    console.log("RESULTADO: Falla en verificacion de webhook");
    return res.sendStatus(403);
  }
});

// Procesar mensajes entrantes - LOGGING COMPLETO
app.post("/webhook", (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`\n\n=== WEBHOOK POST RECIBIDO [${timestamp}] ===`);

  // Log headers importantes
  console.log("HEADERS:");
  console.log(`- User-Agent: ${req.headers["user-agent"]}`);
  console.log(`- Content-Type: ${req.headers["content-type"]}`);
  console.log(`- X-Hub-Signature: ${req.headers["x-hub-signature"]}`);
  console.log(`- X-Hub-Signature-256: ${req.headers["x-hub-signature-256"]}`);

  // Log cuerpo completo
  console.log("CUERPO COMPLETO (RAW):");
  console.log(JSON.stringify(req.body, null, 2));

  const body = req.body;

  if (!body) {
    console.log("ERROR: Cuerpo de solicitud vacio o invalido");
    return res.status(400).send("BAD_REQUEST");
  }

  console.log(`TIPO DE OBJETO: ${body.object}`);
  console.log(
    `PLATAFORMA: ${body.object === "page" ? "FACEBOOK" : "INSTAGRAM"}`
  );

  // Procesar segun la plataforma
  if (body.object === "page" || body.object === "instagram") {
    if (body.entry && Array.isArray(body.entry)) {
      console.log(`NUMERO DE ENTRADAS: ${body.entry.length}`);

      body.entry.forEach((entry, entryIndex) => {
        console.log(`\n--- ENTRADA ${entryIndex} ---`);
        console.log(`ID de entrada: ${entry.id}`);
        console.log(`Tiempo: ${entry.time}`);
        console.log(`Plataforma: ${body.object}`);

        // Procesar mensajes
        if (entry.messaging && Array.isArray(entry.messaging)) {
          console.log(`NUMERO DE MENSAJES: ${entry.messaging.length}`);

          entry.messaging.forEach((message, messageIndex) => {
            console.log(`\n  MENSAJE ${messageIndex}:`);
            console.log(`  Remitente ID: ${message.sender.id}`);
            console.log(`  Destinatario ID: ${message.recipient.id}`);
            console.log(`  Timestamp: ${message.timestamp}`);

            // Mensaje de texto
            if (message.message) {
              console.log(`  TIPO: Mensaje de texto`);
              console.log(`  Texto: "${message.message.text}"`);
              console.log(`  Message ID: ${message.message.mid}`);
              if (message.message.quick_reply) {
                console.log(
                  `  Quick Reply: ${JSON.stringify(
                    message.message.quick_reply
                  )}`
                );
              }
            }

            // Postback (botones)
            if (message.postback) {
              console.log(`  TIPO: Postback`);
              console.log(`  Payload: ${message.postback.payload}`);
              console.log(`  Titulo: ${message.postback.title}`);
            }

            // Delivery confirmations
            if (message.delivery) {
              console.log(`  TIPO: Confirmacion de entrega`);
              console.log(`  MIDs: ${JSON.stringify(message.delivery.mids)}`);
            }

            // Read confirmations
            if (message.read) {
              console.log(`  TIPO: Confirmacion de lectura`);
              console.log(`  Watermark: ${message.read.watermark}`);
            }
          });
        } else {
          console.log("  No hay mensajes en esta entrada");
        }
      });
    } else {
      console.log("No hay entradas en el webhook");
    }

    console.log("=== WEBHOOK PROCESADO EXITOSAMENTE ===\n\n");
    res.status(200).send("EVENT_RECEIVED");
  } else {
    console.log(`ERROR: Objeto de webhook no reconocido: ${body.object}`);
    res.status(400).send("UNKNOWN_OBJECT");
  }
});

// Ruta para probar webhook manualmente
app.post("/test-webhook", (req, res) => {
  console.log("=== PRUEBA MANUAL DE WEBHOOK ===");
  console.log("Body recibido:", JSON.stringify(req.body, null, 2));
  res.json({ status: "test_received", data: req.body });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("================================================");
  console.log("ECLIPSE BEAUTY BRANDS - DIAGNOSTICO INICIADO");
  console.log("Puerto: " + PORT);
  console.log("Hora: " + new Date().toLocaleString("es-ES"));
  console.log("URL: https://botcosmeticoseclipse.onrender.com");
  console.log("================================================");
  console.log("Monitoreando mensajes de Facebook e Instagram...");
});
