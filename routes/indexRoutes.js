// Importa Express para utilizar su sistema de rutas.
const express = require("express");

// Importa los controladores.
const {
  mostrarInicio,
  mostrarEstado
} = require("../controllers/homeController");

// Importa el middleware de registro.
const { registrarVisita } = require("../middlewares/visitLogger");

// Crea un router independiente.
const router = express.Router();

// Ruta principal en formato HTML.
router.get("/", mostrarInicio);

// Ruta JSON que también registra cada visita.
router.get("/status", registrarVisita, mostrarEstado);

// Exporta el router.
module.exports = router;