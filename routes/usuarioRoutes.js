const express = require("express");
const {
  obtenerUsuarios,
  registrarUsuario,
  modificarUsuario,
  borrarUsuario,
} = require("../controllers/usuarioController");

const router = express.Router();

router.get("/", obtenerUsuarios);
router.post("/", registrarUsuario);
router.put("/:id", modificarUsuario);
router.delete("/:id", borrarUsuario);

module.exports = router;