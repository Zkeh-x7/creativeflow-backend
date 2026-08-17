require("dotenv").config();

const { QueryTypes } = require("sequelize");
const { sequelize, Proyecto, Usuario } = require("../models");

const compararConsultas = async () => {
  try {
    await sequelize.authenticate();

    console.log("Conexión exitosa con PostgreSQL.");

    // Consulta escrita directamente con SQL.
    const resultadosSql = await sequelize.query(
      `
        SELECT
          p.id,
          p.titulo,
          p.estado,
          p.usuario_id AS "usuarioId",
          u.nombre AS "usuarioNombre",
          u.email AS "usuarioEmail"
        FROM proyectos AS p
        INNER JOIN usuarios AS u
          ON u.id = p.usuario_id
        ORDER BY p.id ASC;
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    // La misma consulta realizada con Sequelize ORM.
    const proyectosOrm = await Proyecto.findAll({
      attributes: ["id", "titulo", "estado", "usuarioId"],
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["nombre", "email"],
        },
      ],
      order: [["id", "ASC"]],
    });

    const resultadosOrm = proyectosOrm.map((proyecto) => ({
      id: proyecto.id,
      titulo: proyecto.titulo,
      estado: proyecto.estado,
      usuarioId: proyecto.usuarioId,
      usuarioNombre: proyecto.usuario.nombre,
      usuarioEmail: proyecto.usuario.email,
    }));

    console.log("\n=== RESULTADO CON SQL MANUAL ===");
    console.table(resultadosSql);

    console.log("\n=== RESULTADO CON SEQUELIZE ORM ===");
    console.table(resultadosOrm);

    const resultadosCoinciden =
      JSON.stringify(resultadosSql) === JSON.stringify(resultadosOrm);

    console.log(
      `\n¿Ambas consultas entregan el mismo resultado? ${
        resultadosCoinciden ? "SÍ" : "NO"
      }`
    );
  } catch (error) {
    console.error("No fue posible comparar las consultas.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

compararConsultas();