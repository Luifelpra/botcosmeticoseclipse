// ==================================================
// ECLIPSE BEAUTY BRANDS - SERVIDOR CHATBOT
// ==================================================

// 1. IMPORTAR DEPENDENCIAS
const express = require("express");
const app = express();

// 2. CONFIGURAR PUERTO DESDE VARIABLE DE ENTORNO
const PORT = process.env.PORT || 3000;

// 3. CONFIGURACIÓN DEL SERVIDOR
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. RUTA PRINCIPAL - Estado del servidor
app.get("/", (req, res) => {
  console.log("Solicitud de estado del servidor recibida");
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Eclipse Beauty Brands - Servidor Chatbot</title>
    </head>
    <body>
        <h1>Eclipse Beauty Brands - Servidor Chatbot</h1>
        <p><strong>Estado:</strong> ACTIVO</p>
        <p><strong>Puerto:</strong> ${PORT}</p>
        <p><strong>Hora:</strong> ${new Date().toLocaleString("es-ES")}</p>
    </body>
    </html>
  `);
});

// 5. RUTA DE VERIFICACIÓN DE SALUD - Para Render
app.get("/health", (req, res) => {
  res.json({
    estado: "saludable",
    servicio: "chatbot-eclipse-beauty",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    entorno: process.env.NODE_ENV || "desarrollo",
    puerto: PORT,
  });
});

// 6. RUTA PARA WEBHOOK DE META - VERIFICACIÓN
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("Intento de verificación de webhook recibido");
  console.log("Mode:", mode);
  console.log("Token recibido:", token);
  console.log("Token esperado:", process.env.VERIFY_TOKEN);

  if (mode && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook verificado exitosamente");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ Falla en verificación de webhook");
    return res.status(403).json({
      error: "Falla en verificación",
      motivo: "Token no coincide o modo incorrecto",
    });
  }
});

// 7. RUTA PARA RECIBIR MENSAJES
app.post("/webhook", (req, res) => {
  console.log("📩 Mensaje recibido de Meta");
  console.log("Body:", JSON.stringify(req.body, null, 2));
  res.status(200).send("EVENT_RECEIVED");
});

// 8. INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log("ECLIPSE BEAUTY BRANDS - SERVIDOR INICIADO");
  console.log("=".repeat(60));
  console.log("Servidor ejecutándose en puerto: " + PORT);
  console.log("Entorno: " + (process.env.NODE_ENV || "desarrollo"));
  console.log("Hora de inicio: " + new Date().toLocaleString("es-ES"));
  console.log("URL de salud: http://localhost:" + PORT + "/health");
  console.log("URL de webhook: http://localhost:" + PORT + "/webhook");
  console.log("=".repeat(60));
});
