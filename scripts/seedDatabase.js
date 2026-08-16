const bcrypt = require("bcryptjs");
const { sequelize, Usuario, Proyecto } = require("../models");

const crearDatosIniciales = async () => {
  try {
    await sequelize.authenticate();

    // Contraseña exclusivamente demostrativa para registros locales.
    const passwordHash = await bcrypt.hash("UsuarioDemo123!", 10);

    const usuariosIniciales = [
      {
        nombre: "Ana Torres",
        email: "ana.torres@creativeflow.cl",
        rol: "creativo",
        activo: true,
      },
      {
        nombre: "Diego Morales",
        email: "diego.morales@creativeflow.cl",
        rol: "cliente",
        activo: true,
      },
      {
        nombre: "Camila Rojas",
        email: "camila.rojas@creativeflow.cl",
        rol: "administrador",
        activo: true,
      },
    ];

    const usuarios = [];

    for (const datosUsuario of usuariosIniciales) {
      const [usuario] = await Usuario.unscoped().findOrCreate({
        where: {
          email: datosUsuario.email,
        },
        defaults: {
          ...datosUsuario,
          passwordHash,
        },
      });

      usuarios.push(usuario);
    }

    const proyectosIniciales = [
      {
        titulo: "Identidad visual Boreal",
        descripcion: "Diseño de identidad visual para una marca creativa.",
        estado: "en_progreso",
        fechaEntrega: "2026-09-30",
        presupuesto: 450000,
        usuarioId: usuarios[0].id,
      },
      {
        titulo: "Animación campaña espacial",
        descripcion: "Producción de una pieza animada con temática espacial.",
        estado: "pendiente",
        fechaEntrega: "2026-10-15",
        presupuesto: 780000,
        usuarioId: usuarios[0].id,
      },
      {
        titulo: "Sitio web NovaLab",
        descripcion: "Desarrollo de un sitio web para un laboratorio creativo.",
        estado: "completado",
        fechaEntrega: "2026-08-10",
        presupuesto: 620000,
        usuarioId: usuarios[2].id,
      },
    ];

    for (const datosProyecto of proyectosIniciales) {
      await Proyecto.findOrCreate({
        where: {
          titulo: datosProyecto.titulo,
          usuarioId: datosProyecto.usuarioId,
        },
        defaults: datosProyecto,
      });
    }

    const cantidadUsuarios = await Usuario.count();
    const cantidadProyectos = await Proyecto.count();

    console.log("Datos iniciales creados correctamente.");
    console.log(`Usuarios registrados: ${cantidadUsuarios}`);
    console.log(`Proyectos registrados: ${cantidadProyectos}`);
  } catch (error) {
    console.error("No fue posible crear los datos iniciales.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

crearDatosIniciales();