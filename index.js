// Carga las variables de entorno desde el archivo .env.
require("dotenv").config();

// Importa los módulos necesarios.
const express = require("express");
const path = require("path");

// Importa el router externo de la aplicación.
const indexRoutes = require("./routes/indexRoutes");

// Crea la aplicación de Express.
const app = express();

// Obtiene el puerto desde .env o utiliza 3000.
const PORT = process.env.PORT || 3000;

// Permite servir archivos estáticos desde public.
app.use(express.static(path.join(__dirname, "public")));

// Conecta las rutas externas con la aplicación.
app.use("/", indexRoutes);

// Inicia el servidor.
function iniciarServidor() {
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
}

// Ejecuta la función de inicio.
iniciarServidor();