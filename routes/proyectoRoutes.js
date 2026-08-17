const express = require("express");

const {
  obtenerProyectos,
  registrarProyecto,
  modificarProyecto,
  borrarProyecto,
} = require("../controllers/proyectoController");

const router = express.Router();

router.get("/", obtenerProyectos);
router.post("/", registrarProyecto);
router.put("/:id", modificarProyecto);
router.delete("/:id", borrarProyecto);

module.exports = router;