require("dotenv").config();

const bcrypt = require("bcryptjs");
const { sequelize, Usuario, Proyecto } = require("../models");

const EMAIL_TEMPORAL = "rollback@creativeflow.cl";
const TITULO_TEMPORAL = "Proyecto temporal para rollback";

const probarTransaccion = async () => {
  let transaccion;

  try {
    await sequelize.authenticate();

    console.log("Conexión exitosa con PostgreSQL.");

    transaccion = await sequelize.transaction();

    console.log("\n[TRANSACCIÓN] BEGIN ejecutado.");

    const passwordHash = await bcrypt.hash("Temporal123!", 10);

    // Primera operación de la transacción.
    const usuarioTemporal = await Usuario.create(
      {
        nombre: "Usuario Temporal",
        email: EMAIL_TEMPORAL,
        passwordHash,
        rol: "creativo",
        activo: true,
      },
      {
        transaction: transaccion,
      }
    );

    console.log(
      `[ACCIÓN 1] Usuario temporal creado con ID ${usuarioTemporal.id}.`
    );

    // Segunda operación de la transacción.
    const proyectoTemporal = await Proyecto.create(
      {
        titulo: TITULO_TEMPORAL,
        descripcion: "Este proyecto no debe permanecer en la base de datos.",
        estado: "pendiente",
        fechaEntrega: "2026-12-15",
        presupuesto: 150000,
        usuarioId: usuarioTemporal.id,
      },
      {
        transaction: transaccion,
      }
    );

    console.log(
      `[ACCIÓN 2] Proyecto temporal creado con ID ${proyectoTemporal.id}.`
    );

    console.log("\n[ERROR FORZADO] Se provocará un error controlado.");

    throw new Error(
      "Error intencional para demostrar el funcionamiento del ROLLBACK."
    );
  } catch (error) {
    console.error(`[ERROR CONTROLADO] ${error.message}`);

    if (transaccion) {
      await transaccion.rollback();

      console.log("[ROLLBACK] Transacción revertida correctamente.");
    }

    const usuarioPersistido = await Usuario.findOne({
      where: {
        email: EMAIL_TEMPORAL,
      },
    });

    const proyectoPersistido = await Proyecto.findOne({
      where: {
        titulo: TITULO_TEMPORAL,
      },
    });

    console.log("\n=== VERIFICACIÓN DESPUÉS DEL ROLLBACK ===");

    console.log(
      `[VERIFICACIÓN] ¿El usuario quedó guardado? ${
        usuarioPersistido ? "SÍ - INCORRECTO" : "NO - CORRECTO"
      }`
    );

    console.log(
      `[VERIFICACIÓN] ¿El proyecto quedó guardado? ${
        proyectoPersistido ? "SÍ - INCORRECTO" : "NO - CORRECTO"
      }`
    );
  } finally {
    await sequelize.close();
  }
};

probarTransaccion();