// Importa path para construir la ruta del archivo HTML.
const path = require("path");

// Envía la página HTML principal.
const mostrarInicio = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
};

// Devuelve el estado del servidor en formato JSON.
const mostrarEstado = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Servidor funcionando correctamente",
    data: {
      application: "CreativeFlow",
      port: process.env.PORT || 3000
    }
  });
};

// Exporta los controladores.
module.exports = {
  mostrarInicio,
  mostrarEstado
};