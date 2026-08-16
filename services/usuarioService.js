const { Op } = require("sequelize");
const { Usuario } = require("../models");

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
    const error = new Error(
      "La página y el límite deben ser números enteros positivos. El límite máximo es 100."
    );

    error.status = 400;
    error.statusCode = 400;
    throw error;
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

module.exports = {
  listarUsuarios,
};