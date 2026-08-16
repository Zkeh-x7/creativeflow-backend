const { listarUsuarios } = require("../services/usuarioService");

const obtenerUsuarios = async (req, res) => {
  const resultado = await listarUsuarios(req.query);

  res.status(200).json({
    status: "success",
    message: "Usuarios obtenidos correctamente.",
    data: resultado,
  });
};

module.exports = {
  obtenerUsuarios,
};