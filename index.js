// Carga las variables de entorno.
require("dotenv").config();

// Importa los módulos necesarios.
const express = require("express");
const path = require("path");

// Importa las rutas y middlewares de la aplicación.
const indexRoutes = require("./routes/indexRoutes");
const { rutaNoEncontrada } = require("./middlewares/notFound");
const { manejarErrores } = require("./middlewares/errorHandler");

// Crea la aplicación de Express.
const app = express();

// Obtiene el puerto desde .env o utiliza 3000.
const PORT = process.env.PORT || 3000;

// Permite servir archivos estáticos desde public.
app.use(
  express.static(path.join(__dirname, "public"), {
    index: false
  })
);

// Conecta las rutas externas.
app.use("/", indexRoutes);

// Captura las solicitudes a rutas inexistentes.
app.use(rutaNoEncontrada);

// Responde de forma centralizada ante cualquier error.
app.use(manejarErrores);

// Inicia el servidor.
function iniciarServidor() {
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
}

// Ejecuta la función de inicio.
iniciarServidor();