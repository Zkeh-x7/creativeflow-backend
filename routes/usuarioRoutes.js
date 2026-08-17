const express = require("express");
const {
  obtenerUsuarios,
  registrarUsuario,
  modificarUsuario,
  borrarUsuario,
  consultarUsuarioConProyectos,
} = require("../controllers/usuarioController");

const router = express.Router();

router.get("/", obtenerUsuarios);
router.post("/", registrarUsuario);
router.put("/:id", modificarUsuario);
router.delete("/:id", borrarUsuario);
router.get("/:id/proyectos", consultarUsuarioConProyectos);

module.exports = router;