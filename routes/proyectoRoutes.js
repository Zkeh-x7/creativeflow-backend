const express = require("express");
const {
  obtenerProyectos,
  registrarProyecto,
} = require("../controllers/proyectoController");

const router = express.Router();

router.get("/", obtenerProyectos);
router.post("/", registrarProyecto);

module.exports = router;