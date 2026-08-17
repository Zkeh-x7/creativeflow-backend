# CreativeFlow Backend — Módulo 7

API REST desarrollada con Node.js, Express, PostgreSQL y Sequelize para administrar los usuarios y proyectos de CreativeFlow.

Este proyecto corresponde al Módulo 7 del curso **Desarrollo de Aplicaciones Full Stack JavaScript Trainee**.

## Autora

**Johanna Romero**

## Objetivo del proyecto

Implementar persistencia de datos en una aplicación backend mediante PostgreSQL, consultas SQL, Sequelize ORM, relaciones entre modelos, operaciones CRUD y transacciones con rollback.

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- pg
- pg-hstore
- dotenv
- bcryptjs
- Nodemon
- Git
- GitHub

## Funcionalidades

- Conexión de Node.js con PostgreSQL.
- Configuración mediante variables de entorno.
- CRUD completo de usuarios.
- CRUD completo de proyectos.
- Filtros y paginación.
- Validación de identificadores y datos recibidos.
- Protección de contraseñas mediante bcrypt.
- Exclusión de `passwordHash` en las respuestas.
- Relación uno-a-muchos entre usuarios y proyectos.
- Consulta de proyectos con su usuario responsable.
- Consulta de un usuario con todos sus proyectos.
- Comparación entre SQL manual y Sequelize ORM.
- Transacción con dos operaciones.
- Error controlado y ejecución de rollback.
- Manejo centralizado de errores.
- Respuestas JSON consistentes.

## Estructura principal

```text
creativeflow-backend/
├── config/
│   └── database.js
├── controllers/
│   ├── homeController.js
│   ├── proyectoController.js
│   └── usuarioController.js
├── middlewares/
│   ├── errorHandler.js
│   └── notFound.js
├── models/
│   ├── index.js
│   ├── Proyecto.js
│   └── Usuario.js
├── routes/
│   ├── indexRoutes.js
│   ├── proyectoRoutes.js
│   └── usuarioRoutes.js
├── scripts/
│   ├── compararConsultas.js
│   ├── probarTransaccion.js
│   ├── seedDatabase.js
│   ├── syncDatabase.js
│   └── testDatabase.js
├── services/
│   ├── logService.js
│   ├── proyectoService.js
│   └── usuarioService.js
├── public/
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## Requisitos previos

Antes de ejecutar el proyecto se debe contar con:

- Node.js instalado.
- PostgreSQL instalado y funcionando.
- Git instalado.
- Una base de datos llamada `creativeflow_db`.
- Un usuario de PostgreSQL llamado `creativeflow_user`.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Zkeh-x7/creativeflow-backend.git
```

Ingresar al proyecto:

```bash
cd creativeflow-backend
```

Instalar las dependencias:

```bash
npm install
```

## Configuración de PostgreSQL

La base de datos y el usuario pueden crearse desde pgAdmin 4 utilizando:

```sql
CREATE USER creativeflow_user
WITH PASSWORD 'tu_contrasena_segura';

CREATE DATABASE creativeflow_db
OWNER creativeflow_user;
```

Estos comandos deben ejecutarse solamente durante la configuración inicial.

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto utilizando `.env.example` como referencia:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=creativeflow_db
DB_USER=creativeflow_user
DB_PASSWORD=tu_contrasena_real
DB_DIALECT=postgres
```

El archivo `.env` contiene información privada y no debe subirse a GitHub.

El archivo `.env.example` contiene únicamente valores de ejemplo y sí forma parte del repositorio.

## Preparación de la base de datos

Comprobar la conexión:

```bash
npm run db:test
```

Crear o sincronizar las tablas:

```bash
npm run db:sync
```

Insertar los datos iniciales:

```bash
npm run db:seed
```

## Ejecución

Ejecutar el proyecto en desarrollo:

```bash
npm run dev
```

También se puede iniciar sin Nodemon:

```bash
npm start
```

El servidor queda disponible en:

```text
http://localhost:3000
```

## Endpoints de usuarios

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/usuarios` | Obtiene usuarios con filtros y paginación |
| POST | `/usuarios` | Crea un usuario y cifra su contraseña |
| PUT | `/usuarios/:id` | Actualiza un usuario |
| DELETE | `/usuarios/:id` | Elimina un usuario |
| GET | `/usuarios/:id/proyectos` | Obtiene un usuario con sus proyectos |

### Filtros de usuarios

Ejemplo de búsqueda por nombre:

```text
GET /usuarios?nombre=Ana
```

Ejemplo de paginación:

```text
GET /usuarios?pagina=1&limite=10
```

### Ejemplo de creación de usuario

```json
{
  "nombre": "Laura Mendez",
  "email": "laura.mendez@creativeflow.cl",
  "password": "Laura123!",
  "rol": "creativo"
}
```

La contraseña se cifra antes de guardarse y `passwordHash` no se incluye en las respuestas de la API.

## Endpoints de proyectos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/proyectos` | Obtiene proyectos con filtros y paginación |
| POST | `/proyectos` | Crea un proyecto |
| PUT | `/proyectos/:id` | Actualiza un proyecto |
| DELETE | `/proyectos/:id` | Elimina un proyecto |

### Filtros de proyectos

Búsqueda por título:

```text
GET /proyectos?titulo=visual
```

Filtro por estado:

```text
GET /proyectos?estado=pendiente
```

Filtro por usuario responsable:

```text
GET /proyectos?usuarioId=1
```

Paginación:

```text
GET /proyectos?pagina=1&limite=10
```

### Ejemplo de creación de proyecto

```json
{
  "titulo": "Campaña audiovisual Orion",
  "descripcion": "Producción de una campaña para redes sociales.",
  "estado": "pendiente",
  "fechaEntrega": "2026-11-30",
  "presupuesto": 350000,
  "usuarioId": 2
}
```

## Relación entre modelos

La aplicación implementa una relación uno-a-muchos:

```text
Usuario 1 ─────── N Proyecto
```

Un usuario puede tener varios proyectos y cada proyecto pertenece a un usuario.

La relación se consulta mediante:

```text
GET /usuarios/1/proyectos
```

También se utiliza `include` de Sequelize para obtener al usuario responsable de cada proyecto.

## Comparación SQL manual y Sequelize ORM

El archivo:

```text
scripts/compararConsultas.js
```

realiza la misma consulta de dos maneras:

1. SQL manual mediante `SELECT` e `INNER JOIN`.
2. Sequelize ORM mediante `findAll()` e `include`.

Ejecutar la comparación:

```bash
node scripts/compararConsultas.js
```

El resultado confirma si ambas consultas devuelven los mismos registros:

```text
¿Ambas consultas entregan el mismo resultado? SÍ
```

## Transacciones y rollback

El archivo:

```text
scripts/probarTransaccion.js
```

demuestra una transacción que realiza dos operaciones:

1. Crea un usuario temporal.
2. Crea un proyecto asociado al usuario.

Luego se provoca un error controlado y se ejecuta:

```text
ROLLBACK
```

Finalmente, el script verifica que ninguno de los registros temporales haya quedado almacenado.

Ejecutar la prueba:

```bash
node scripts/probarTransaccion.js
```

Resultado esperado:

```text
[ROLLBACK] Transacción revertida correctamente.
[VERIFICACIÓN] ¿El usuario quedó guardado? NO - CORRECTO
[VERIFICACIÓN] ¿El proyecto quedó guardado? NO - CORRECTO
```

## Manejo de errores

La API posee middlewares para:

- Capturar rutas inexistentes.
- Centralizar errores.
- Validar identificadores.
- Informar recursos no encontrados.
- Validar datos recibidos.
- Evitar correos electrónicos duplicados.
- Evitar exponer información privada.

Las respuestas mantienen una estructura similar a:

```json
{
  "status": "success",
  "message": "Operación realizada correctamente.",
  "data": {}
}
```

En caso de error:

```json
{
  "status": "error",
  "message": "Descripción del error.",
  "data": null
}
```

## Seguridad

- Las contraseñas se cifran con bcrypt.
- `passwordHash` se excluye de las respuestas.
- Las credenciales se almacenan en `.env`.
- `.env` está excluido mediante `.gitignore`.
- `.env.example` no contiene contraseñas reales.
- Las consultas ORM reducen la manipulación directa de SQL.

## Justificación de decisiones técnicas

### Elección de PostgreSQL y el cliente de conexión

Se eligió PostgreSQL porque es una base de datos relacional robusta, permite definir relaciones entre entidades y soporta transacciones para mantener la consistencia de los datos.

Se utilizó `pg` porque es el controlador de PostgreSQL para Node.js y permite que Sequelize se comunique con la base de datos. Sequelize facilita la creación de modelos, consultas, validaciones, relaciones y transacciones.

### Protección de datos sensibles

Las credenciales de PostgreSQL se almacenan en el archivo `.env`, el cual está excluido de Git mediante `.gitignore`. El archivo `.env.example` solamente contiene valores de referencia.

Las contraseñas de los usuarios se cifran con bcrypt antes de almacenarse y `passwordHash` se excluye de todas las respuestas públicas.

### Actualización controlada de campos

En las operaciones `PUT` solamente se permiten campos definidos previamente. Esto evita modificar accidentalmente identificadores, fechas de creación, contraseñas cifradas u otros valores internos.

También permite validar cada campo antes de actualizarlo y conservar los valores que no fueron enviados en la solicitud.

### Validaciones aplicadas

La aplicación valida:

- Que los identificadores sean números enteros positivos.
- Que el registro exista antes de actualizarlo o eliminarlo.
- Que los campos obligatorios no estén vacíos.
- Que los correos electrónicos no estén duplicados.
- Que los estados de los proyectos sean válidos.
- Que los presupuestos sean números iguales o superiores a cero.
- Que las fechas utilicen el formato esperado.
- Que el usuario responsable de un proyecto exista.

### Ventajas del ORM

Sequelize permite trabajar con objetos y métodos de JavaScript en lugar de escribir SQL manual para cada operación. Esto facilita la reutilización del código, las validaciones, las relaciones entre modelos y el mantenimiento de la aplicación.

La comparación realizada demuestra que la consulta SQL manual y la consulta con Sequelize devuelven los mismos resultados. El ORM reduce código repetitivo, mientras que el SQL manual ofrece mayor control directo sobre consultas específicas.

### Uso de transacciones

La transacción agrupa la creación de un usuario y un proyecto como una sola operación lógica. Si alguna acción falla, `ROLLBACK` revierte todos los cambios, evitando que la base de datos quede con registros incompletos o inconsistentes.

## Repositorio

[CreativeFlow Backend en GitHub](https://github.com/Zkeh-x7/creativeflow-backend)