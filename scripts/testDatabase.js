const sequelize = require("../config/database");

const probarConexion = async () => {
  try {
    await sequelize.authenticate();

    console.log("Conexión exitosa con PostgreSQL.");
    console.log(`Base de datos: ${process.env.DB_NAME}`);
  } catch (error) {
    console.error("No fue posible conectar con PostgreSQL.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

probarConexion();