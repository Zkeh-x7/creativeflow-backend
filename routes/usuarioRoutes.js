const express = require("express");
const {
  obtenerUsuarios,
  registrarUsuario,
} = require("../controllers/usuarioController");

const router = express.Router();

router.get("/", obtenerUsuarios);
router.post("/", registrarUsuario);

module.exports = router;