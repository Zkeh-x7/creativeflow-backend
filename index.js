// Carga las variables de entorno.
require("dotenv").config();

// Importa los módulos necesarios.
const express = require("express");
const path = require("path");

// Importa las rutas y middlewares de la aplicación.
const indexRoutes = require("./routes/indexRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const proyectoRoutes = require("./routes/proyectoRoutes");
const { sequelize } = require("./models");
const { rutaNoEncontrada } = require("./middlewares/notFound");
const { manejarErrores } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Procesa solicitudes con contenido JSON.
app.use(express.json());

// Procesa datos enviados desde formularios.
app.use(express.urlencoded({ extended: true }));

// Sirve los archivos estáticos.
app.use(express.static(path.join(__dirname, "public"), {
  index: false,
}));

app.use("/usuarios", usuarioRoutes);
app.use("/proyectos", proyectoRoutes);
app.use("/", indexRoutes);

// Captura las solicitudes a rutas inexistentes.
app.use(rutaNoEncontrada);

// Responde de forma centralizada ante cualquier error.
app.use(manejarErrores);

// Inicia el servidor.
const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();

    console.log("Conexión exitosa con PostgreSQL.");

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No fue posible iniciar el servidor.");
    console.error(error.message);
    process.exit(1);
  }
};

iniciarServidor();