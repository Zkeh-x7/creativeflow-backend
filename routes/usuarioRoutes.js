const express = require("express");
const {
  obtenerUsuarios,
} = require("../controllers/usuarioController");

const router = express.Router();

router.get("/", obtenerUsuarios);

module.exports = router;