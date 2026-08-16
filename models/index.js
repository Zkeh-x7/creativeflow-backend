const sequelize = require("../config/database");
const Usuario = require("./Usuario");
const Proyecto = require("./Proyecto");

Usuario.hasMany(Proyecto, {
  foreignKey: "usuarioId",
  as: "proyectos",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Proyecto.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "usuario",
});

module.exports = {
  sequelize,
  Usuario,
  Proyecto,
};