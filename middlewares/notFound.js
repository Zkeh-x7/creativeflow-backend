// Crea un error cuando la ruta solicitada no existe.
const rutaNoEncontrada = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);

  // Asigna el código HTTP correspondiente.
  error.statusCode = 404;

  // Envía el error al middleware central.
  next(error);
};

// Exporta el middleware.
module.exports = {
  rutaNoEncontrada
};