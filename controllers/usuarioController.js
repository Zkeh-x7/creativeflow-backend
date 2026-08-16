const {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
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

const modificarUsuario = async (req, res) => {
  const usuario = await actualizarUsuario(
    req.params.id,
    req.body || {}
  );

  res.status(200).json({
    status: "success",
    message: "Usuario actualizado correctamente.",
    data: usuario,
  });
};

const borrarUsuario = async (req, res) => {
  const usuario = await eliminarUsuario(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Usuario eliminado correctamente.",
    data: usuario,
  });
};

module.exports = {
  obtenerUsuarios,
  registrarUsuario,
  modificarUsuario,
  borrarUsuario,
};