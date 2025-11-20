// 1. Importar dependencias
const express = require("express");
const app = express();
const PORT = 3000;

// 2. Configuracion del servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Ruta principal/ Estado del servidor
app.get("/", (req, res) => {
  console.log("Solicitud de estado del servidor recibida");
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>CHATBOT</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 40px; 
                line-height: 1.6; 
                background-color: #f5f5f5;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header { 
                color: #2c3e50; 
                border-bottom: 3px solid #e74c3c; 
                padding-bottom: 15px; 
                margin-bottom: 20px;
            }
            .status { 
                color: #27ae60; 
                font-weight: bold; 
                font-size: 1.1em;
            }
            .info { 
                background: #f8f9fa; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0; 
                border-left: 4px solid #3498db;
            }
            ul {
                padding-left: 20px;
            }
            li {
                margin-bottom: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>CHATBOT</h1>
            </div>
            
            <div class="info">
                <p><strong>Estado:</strong> <span class="status">ACTIVO</span></p>
                <p><strong>Empresa:</strong> Eclipse Beauty Brands</p>
                <p><strong>Hora del servidor:</strong> ${new Date().toLocaleString(
                  "es-ES"
                )}</p>
                <p><strong>Versión:</strong> 1.0.0</p>
            </div>

            <h3>Plataformas Integradas:</h3>
            <ul>
                <li>Facebook Messenger</li>
                <li>Instagram Direct</li>
                <li>WhatsApp Business</li>
                <li>API WooCommerce</li>
            </ul>

            <h3>Funcionalidades Principales:</h3>
            <ul>
                <li>Respuestas automáticas a clientes</li>
                <li>Consulta de catálogo de productos</li>
                <li>Información de precios y disponibilidad</li>
                <li>Soporte al cliente 24/7</li>
                <li>Derivación a agente humano cuando sea necesario</li>
            </ul>
        </div>
    </body>
    </html>
  `);
});

// 4. Ruta de verificacion de salud para monitoreo
app.get("/health", (req, res) => {
  res.json({
    estado: "saludable",
    servicio: "chatbot-eclipse-beauty",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    entorno: "desarrollo",
  });
});

// 5. Ruta de informacion de la empresa
app.get("/empresa", (req, res) => {
  res.json({
    nombre: "Eclipse Beauty Brands",
    tipo: "Distribuidor oficial de cosméticos",
    servicios: [
      "Venta de cosméticos",
      "Distribución a nivel nacional",
      "Soporte al cliente especializado",
    ],
    horario_atencion: "Lunes a Viernes: 9:30 - 13:00",
  });
});

// 6. Inicio del servidor
app.listen(PORT, () => {
  console.log("=".repeat(65));
  console.log("ECLIPSE BEAUTY BRANDS - SERVIDOR CHATBOT INICIALIZADO");
  console.log("=".repeat(65));
  console.log("URL del servidor: http://localhost:" + PORT);
  console.log("Entorno: Desarrollo");
  console.log("Hora de inicio: " + new Date().toLocaleString("es-ES"));
  console.log("=".repeat(65));
  console.log("Servidor listo para recibir solicitudes...");
});

// 7. Errores
process.on("uncaughtException", (error) => {
  console.error("Error no capturado:", error.message);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promesa rechazada no manejada:", reason);
});
