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

module.exports = {
  listarUsuarios,
  crearUsuario,
};