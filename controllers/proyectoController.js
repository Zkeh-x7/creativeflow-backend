const {
  listarProyectos,
  crearProyecto,
} = require("../services/proyectoService");

const obtenerProyectos = async (req, res) => {
  const resultado = await listarProyectos(req.query);

  res.status(200).json({
    status: "success",
    message: "Proyectos obtenidos correctamente.",
    data: resultado,
  });
};

const registrarProyecto = async (req, res) => {
  const proyecto = await crearProyecto(req.body || {});

  res.status(201).json({
    status: "success",
    message: "Proyecto creado correctamente.",
    data: proyecto,
  });
};

module.exports = {
  obtenerProyectos,
  registrarProyecto,
};