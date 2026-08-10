// Importa el módulo nativo para trabajar con archivos.
const fs = require("fs");

// Importa path para construir la ubicación del archivo.
const path = require("path");

// Define la ruta absoluta del archivo log.txt.
const logFilePath = path.join(__dirname, "..", "logs", "log.txt");

// Guarda un acceso dentro del archivo log.txt.
const guardarAcceso = (ruta) => {
  // Obtiene la fecha y hora actuales.
  const ahora = new Date();

  const fecha = ahora.toLocaleDateString("es-CL", {
    timeZone: "America/Santiago"
  });

  const hora = ahora.toLocaleTimeString("es-CL", {
    timeZone: "America/Santiago",
    hour12: false
  });

  // Construye la línea que será agregada al archivo.
  const registro = `Fecha: ${fecha} | Hora: ${hora} | Ruta: ${ruta}\n`;

  // Agrega el registro sin eliminar el contenido anterior.
  fs.appendFile(logFilePath, registro, "utf8", (error) => {
    if (error) {
      console.error("No fue posible registrar el acceso:", error.message);
    }
  });
};

// Exporta el servicio.
module.exports = {
  guardarAcceso
};