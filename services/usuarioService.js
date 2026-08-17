const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { Usuario } = require("../models");

const crearError = (mensaje, estado) => {
  const error = new Error(mensaje);
  error.status = estado;
  error.statusCode = estado;
  return error;
};

const listarUsuarios = async ({
  nombre = "",
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

  if (nombre.trim()) {
    filtros.nombre = {
      [Op.iLike]: `%${nombre.trim()}%`,
    };
  }

  const offset = (numeroPagina - 1) * numeroLimite;

  const { count, rows } = await Usuario.findAndCountAll({
    where: filtros,
    order: [["id", "ASC"]],
    limit: numeroLimite,
    offset,
  });

  return {
    usuarios: rows,
    paginacion: {
      totalRegistros: count,
      paginaActual: numeroPagina,
      totalPaginas: Math.ceil(count / numeroLimite),
      limite: numeroLimite,
    },
  };
};

const crearUsuario = async ({
  nombre,
  email,
  password,
  rol = "cliente",
}) => {
  if (
    typeof nombre !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !nombre.trim() ||
    !email.trim() ||
    !password
  ) {
    throw crearError(
      "Los campos nombre, email y password son obligatorios.",
      400
    );
  }

  if (password.length < 8) {
    throw crearError(
      "La contraseña debe tener al menos 8 caracteres.",
      400
    );
  }

  const rolesPermitidos = [
    "administrador",
    "creativo",
    "cliente",
  ];

  if (!rolesPermitidos.includes(rol)) {
    throw crearError(
      "El rol debe ser administrador, creativo o cliente.",
      400
    );
  }

  const emailNormalizado = email.trim().toLowerCase();

  const usuarioExistente = await Usuario.unscoped().findOne({
    where: {
      email: emailNormalizado,
    },
  });

  if (usuarioExistente) {
    throw crearError(
      "Ya existe un usuario registrado con ese correo electrónico.",
      409
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const usuario = await Usuario.unscoped().create({
    nombre: nombre.trim(),
    email: emailNormalizado,
    passwordHash,
    rol,
    activo: true,
  });

  const usuarioSeguro = usuario.toJSON();
  delete usuarioSeguro.passwordHash;

  return usuarioSeguro;
};

const validarIdUsuario = (id) => {
  const numeroId = Number(id);

  if (!Number.isInteger(numeroId) || numeroId < 1) {
    throw crearError(
      "El ID del usuario debe ser un número entero positivo.",
      400
    );
  }

  return numeroId;
};

const actualizarUsuario = async (id, datosRecibidos) => {
  const numeroId = validarIdUsuario(id);

  const usuario = await Usuario.unscoped().findByPk(numeroId);

  if (!usuario) {
    throw crearError("Usuario no encontrado.", 404);
  }

  const datosActualizados = {};

  if (datosRecibidos.nombre !== undefined) {
    if (
      typeof datosRecibidos.nombre !== "string" ||
      !datosRecibidos.nombre.trim()
    ) {
      throw crearError("El nombre no puede estar vacío.", 400);
    }

    datosActualizados.nombre = datosRecibidos.nombre.trim();
  }

  if (datosRecibidos.email !== undefined) {
    if (
      typeof datosRecibidos.email !== "string" ||
      !datosRecibidos.email.trim()
    ) {
      throw crearError("El correo electrónico no es válido.", 400);
    }

    const emailNormalizado = datosRecibidos.email
      .trim()
      .toLowerCase();

    const usuarioConMismoEmail = await Usuario.unscoped().findOne({
      where: {
        email: emailNormalizado,
        id: {
          [Op.ne]: numeroId,
        },
      },
    });

    if (usuarioConMismoEmail) {
      throw crearError(
        "Ya existe otro usuario registrado con ese correo electrónico.",
        409
      );
    }

    datosActualizados.email = emailNormalizado;
  }

  if (datosRecibidos.rol !== undefined) {
    const rolesPermitidos = [
      "administrador",
      "creativo",
      "cliente",
    ];

    if (!rolesPermitidos.includes(datosRecibidos.rol)) {
      throw crearError(
        "El rol debe ser administrador, creativo o cliente.",
        400
      );
    }

    datosActualizados.rol = datosRecibidos.rol;
  }

  if (datosRecibidos.activo !== undefined) {
    if (typeof datosRecibidos.activo !== "boolean") {
      throw crearError(
        "El campo activo debe ser verdadero o falso.",
        400
      );
    }

    datosActualizados.activo = datosRecibidos.activo;
  }

  if (datosRecibidos.password !== undefined) {
    if (
      typeof datosRecibidos.password !== "string" ||
      datosRecibidos.password.length < 8
    ) {
      throw crearError(
        "La contraseña debe tener al menos 8 caracteres.",
        400
      );
    }

    datosActualizados.passwordHash = await bcrypt.hash(
      datosRecibidos.password,
      10
    );
  }

  if (Object.keys(datosActualizados).length === 0) {
    throw crearError(
      "Debes enviar al menos un campo permitido para actualizar.",
      400
    );
  }

  await usuario.update(datosActualizados);

  const usuarioSeguro = usuario.toJSON();
  delete usuarioSeguro.passwordHash;

  return usuarioSeguro;
};

const eliminarUsuario = async (id) => {
  const numeroId = validarIdUsuario(id);

  const usuario = await Usuario.findByPk(numeroId);

  if (!usuario) {
    throw crearError("Usuario no encontrado.", 404);
  }

  const usuarioEliminado = usuario.toJSON();

  await usuario.destroy();

  return usuarioEliminado;
};

const obtenerUsuarioConProyectos = async (id) => {
  const numeroId = Number(id);

  if (!Number.isInteger(numeroId) || numeroId < 1) {
    throw crearError(
      "El ID del usuario debe ser un número entero positivo.",
      400
    );
  }

  const usuario = await Usuario.findByPk(numeroId, {
    attributes: {
      exclude: ["passwordHash"],
    },
    include: [
      {
        association: "proyectos",
        attributes: [
          "id",
          "titulo",
          "descripcion",
          "estado",
          "fechaEntrega",
          "presupuesto",
          "usuarioId",
          "createdAt",
          "updatedAt",
        ],
      },
    ],
  });

  if (!usuario) {
    throw crearError("Usuario no encontrado.", 404);
  }

  return usuario;
};

module.exports = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioConProyectos,
};