// Importa el servicio que escribe en log.txt.
const { guardarAcceso } = require("../services/logService");

// Middleware encargado de registrar cada acceso.
const registrarVisita = (req, res, next) => {
  // Envía la ruta solicitada al servicio de registros.
  guardarAcceso(req.originalUrl);

  // Permite que la solicitud continúe hacia el controlador.
  next();
};

// Exporta el middleware.
module.exports = {
  registrarVisita
};