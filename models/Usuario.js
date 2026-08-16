const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre es obligatorio.",
        },
        len: {
          args: [2, 100],
          msg: "El nombre debe tener entre 2 y 100 caracteres.",
        },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "El correo electrónico no es válido.",
        },
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    rol: {
      type: DataTypes.ENUM("administrador", "creativo", "cliente"),
      allowNull: false,
      defaultValue: "cliente",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
    underscored: true,
    defaultScope: {
      attributes: {
        exclude: ["passwordHash"],
      },
    },
    scopes: {
      conPassword: {
        attributes: {
          include: ["passwordHash"],
        },
      },
    },
  }
);

module.exports = Usuario;