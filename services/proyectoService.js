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

const validarIdProyecto = (id) => {
  const numeroId = Number(id);

  if (!Number.isInteger(numeroId) || numeroId < 1) {
    throw crearError(
      "El ID del proyecto debe ser un número entero positivo.",
      400
    );
  }

  return numeroId;
};

const actualizarProyecto = async (id, datosRecibidos) => {
  const numeroId = validarIdProyecto(id);

  const proyecto = await Proyecto.findByPk(numeroId);

  if (!proyecto) {
    throw crearError("Proyecto no encontrado.", 404);
  }

  const datosActualizados = {};

  if (datosRecibidos.titulo !== undefined) {
    if (
      typeof datosRecibidos.titulo !== "string" ||
      !datosRecibidos.titulo.trim()
    ) {
      throw crearError("El título no puede estar vacío.", 400);
    }

    datosActualizados.titulo = datosRecibidos.titulo.trim();
  }

  if (datosRecibidos.descripcion !== undefined) {
    if (
      datosRecibidos.descripcion !== null &&
      typeof datosRecibidos.descripcion !== "string"
    ) {
      throw crearError(
        "La descripción debe ser un texto o un valor nulo.",
        400
      );
    }

    datosActualizados.descripcion =
      typeof datosRecibidos.descripcion === "string"
        ? datosRecibidos.descripcion.trim()
        : null;
  }

  if (datosRecibidos.estado !== undefined) {
    if (!estadosPermitidos.includes(datosRecibidos.estado)) {
      throw crearError(
        "El estado debe ser pendiente, en_progreso o completado.",
        400
      );
    }

    datosActualizados.estado = datosRecibidos.estado;
  }

  if (datosRecibidos.fechaEntrega !== undefined) {
    if (
      datosRecibidos.fechaEntrega !== null &&
      (typeof datosRecibidos.fechaEntrega !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(
          datosRecibidos.fechaEntrega
        ))
    ) {
      throw crearError(
        "La fecha de entrega debe utilizar el formato YYYY-MM-DD.",
        400
      );
    }

    datosActualizados.fechaEntrega =
      datosRecibidos.fechaEntrega;
  }

  if (datosRecibidos.presupuesto !== undefined) {
    const numeroPresupuesto = Number(
      datosRecibidos.presupuesto
    );

    if (
      !Number.isFinite(numeroPresupuesto) ||
      numeroPresupuesto < 0
    ) {
      throw crearError(
        "El presupuesto debe ser un número igual o superior a cero.",
        400
      );
    }

    datosActualizados.presupuesto = numeroPresupuesto;
  }

  if (datosRecibidos.usuarioId !== undefined) {
    const numeroUsuarioId = Number(datosRecibidos.usuarioId);

    if (
      !Number.isInteger(numeroUsuarioId) ||
      numeroUsuarioId < 1
    ) {
      throw crearError(
        "El ID del usuario debe ser un número entero positivo.",
        400
      );
    }

    const usuario = await Usuario.findByPk(numeroUsuarioId);

    if (!usuario) {
      throw crearError(
        "El usuario responsable no existe.",
        404
      );
    }

    datosActualizados.usuarioId = numeroUsuarioId;
  }

  if (Object.keys(datosActualizados).length === 0) {
    throw crearError(
      "Debes enviar al menos un campo permitido para actualizar.",
      400
    );
  }

  await proyecto.update(datosActualizados);

  return Proyecto.findByPk(numeroId, {
    include: [incluirUsuario],
  });
};

const eliminarProyecto = async (id) => {
  const numeroId = validarIdProyecto(id);

  const proyecto = await Proyecto.findByPk(numeroId, {
    include: [incluirUsuario],
  });

  if (!proyecto) {
    throw crearError("Proyecto no encontrado.", 404);
  }

  const proyectoEliminado = proyecto.toJSON();

  await proyecto.destroy();

  return proyectoEliminado;
};

module.exports = {
  listarProyectos,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
};