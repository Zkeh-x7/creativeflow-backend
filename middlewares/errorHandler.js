// Middleware centralizado para responder ante errores.
const manejarErrores = (error, req, res, next) => {
  // Utiliza el código recibido o 500 para errores inesperados.
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message: error.message || "Error interno del servidor",
    data: null
  });
};

// Exporta el middleware.
module.exports = {
  manejarErrores
};