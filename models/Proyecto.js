const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Proyecto = sequelize.define(
  "Proyecto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El título es obligatorio.",
        },
        len: {
          args: [3, 150],
          msg: "El título debe tener entre 3 y 150 caracteres.",
        },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM(
        "pendiente",
        "en_progreso",
        "completado"
      ),
      allowNull: false,
      defaultValue: "pendiente",
    },
    fechaEntrega: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "fecha_entrega",
    },
    presupuesto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "El presupuesto no puede ser negativo.",
        },
      },
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "usuario_id",
    },
  },
  {
    tableName: "proyectos",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Proyecto;