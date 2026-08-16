const { Op } = require("sequelize");
const { Proyecto, Usuario } = require("../models");

const crearError = (mensaje, estado) => {
  const error = new Error(mensaje);
  error.status = estado;
  error.statusCode = estado;
  return error;
};

const estadosPermitidos = [
  "pendiente",
  "en_progreso",
  "completado",
];

const incluirUsuario = {
  model: Usuario,
  as: "usuario",
  attributes: ["id", "nombre", "email", "rol"],
};

const listarProyectos = async ({
  titulo = "",
  estado = "",
  usuarioId = "",
  pagina = "1",
  limite = "10",
}) => {
  const numeroPagina = Number(pagina);
  const numeroLimite = Number(limite);

  if (
    !Number.isInteger(numeroPagina) ||
    numeroPagina < 1 ||
    !Number.isInteger(numeroLimite) ||
    numeroLimite < 1 ||
    numeroLimite > 100
  ) {
    throw crearError(
      "La página y el límite deben ser números enteros positivos. El límite máximo es 100.",
      400
    );
  }

  const filtros = {};

  if (titulo.trim()) {
    filtros.titulo = {
      [Op.iLike]: `%${titulo.trim()}%`,
    };
  }

  if (estado) {
    if (!estadosPermitidos.includes(estado)) {
      throw crearError(
        "El estado debe ser pendiente, en_progreso o completado.",
        400
      );
    }

    filtros.estado = estado;
  }

  if (usuarioId) {
    const numeroUsuarioId = Number(usuarioId);

    if (
      !Number.isInteger(numeroUsuarioId) ||
      numeroUsuarioId < 1
    ) {
      throw crearError(
        "El ID del usuario debe ser un número entero positivo.",
        400
      );
    }

    filtros.usuarioId = numeroUsuarioId;
  }

  const offset = (numeroPagina - 1) * numeroLimite;

  const { count, rows } = await Proyecto.findAndCountAll({
    where: filtros,
    include: [incluirUsuario],
    order: [["id", "ASC"]],
    limit: numeroLimite,
    offset,
    distinct: true,
  });

  return {
    proyectos: rows,
    paginacion: {
      totalRegistros: count,
      paginaActual: numeroPagina,
      totalPaginas: Math.ceil(count / numeroLimite),
      limite: numeroLimite,
    },
  };
};

const crearProyecto = async ({
  titulo,
  descripcion = null,
  estado = "pendiente",
  fechaEntrega = null,
  presupuesto = 0,
  usuarioId,
}) => {
  if (typeof titulo !== "string" || !titulo.trim()) {
    throw crearError("El título es obligatorio.", 400);
  }

  const numeroUsuarioId = Number(usuarioId);

  if (
    !Number.isInteger(numeroUsuarioId) ||
    numeroUsuarioId < 1
  ) {
    throw crearError(
      "Debes indicar un ID de usuario válido.",
      400
    );
  }

  const usuario = await Usuario.findByPk(numeroUsuarioId);

  if (!usuario) {
    throw crearError("El usuario responsable no existe.", 404);
  }

  if (!estadosPermitidos.includes(estado)) {
    throw crearError(
      "El estado debe ser pendiente, en_progreso o completado.",
      400
    );
  }

  if (
    descripcion !== null &&
    typeof descripcion !== "string"
  ) {
    throw crearError(
      "La descripción debe ser un texto.",
      400
    );
  }

  if (
    fechaEntrega !== null &&
    (typeof fechaEntrega !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fechaEntrega))
  ) {
    throw crearError(
      "La fecha de entrega debe utilizar el formato YYYY-MM-DD.",
      400
    );
  }

  const numeroPresupuesto = Number(presupuesto);

  if (
    !Number.isFinite(numeroPresupuesto) ||
    numeroPresupuesto < 0
  ) {
    throw crearError(
      "El presupuesto debe ser un número igual o superior a cero.",
      400
    );
  }

  const proyecto = await Proyecto.create({
    titulo: titulo.trim(),
    descripcion:
      typeof descripcion === "string"
        ? descripcion.trim()
        : null,
    estado,
    fechaEntrega,
    presupuesto: numeroPresupuesto,
    usuarioId: numeroUsuarioId,
  });

  return Proyecto.findByPk(proyecto.id, {
    include: [incluirUsuario],
  });
};

module.exports = {
  listarProyectos,
  crearProyecto,
};