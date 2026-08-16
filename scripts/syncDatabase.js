const { sequelize } = require("../models");

const sincronizarBaseDeDatos = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("Conexión exitosa con PostgreSQL.");
    console.log("Modelos sincronizados correctamente.");
    console.log("Tablas disponibles: usuarios y proyectos.");
  } catch (error) {
    console.error("No fue posible sincronizar los modelos.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

sincronizarBaseDeDatos();