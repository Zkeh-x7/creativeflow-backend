const {
  listarUsuarios,
  crearUsuario,
} = require("../services/usuarioService");

const obtenerUsuarios = async (req, res) => {
  const resultado = await listarUsuarios(req.query);

  res.status(200).json({
    status: "success",
    message: "Usuarios obtenidos correctamente.",
    data: resultado,
  });
};

const registrarUsuario = async (req, res) => {
  const usuario = await crearUsuario(req.body || {});

  res.status(201).json({
    status: "success",
    message: "Usuario creado correctamente.",
    data: usuario,
  });
};

module.exports = {
  obtenerUsuarios,
  registrarUsuario,
};