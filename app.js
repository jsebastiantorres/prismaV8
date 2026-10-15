console.log("¡Proyecto de Node.js iniciado con éxito!");

// importacion de ruta para utenticacion
import autenticacionRoute from "./src/routes/autenticacionRoute.js";

// Importacion de ruta para usuario
import usuarioRoutes from "./src/routes/usuarioRoutes.js";

// Importacion de ruta de actores
import actorRoutes from "./src/routes/actorRoutes.js";

// Importacion de ruta de clientes
import clienteReportesRoutes from "./src/routes/reportesClienteRoutes.js";

// Importacion de ruta para vistas films
import vistasfilmsRoutes from "./src/routes/vistasFilmsRoutes.js";

// Importacion de ruta para categorias
import categoriaRoutes from "./src/routes/categoriaRoutes.js";

// Importarción de ruta tabla intermedia filmCategoryRoutes
import filmCategoryRoutes from "./src/routes/filmCategoryRoutes.js";

// Importación de rutas para film
import filmRoutes from "./src/routes/filmRoutes.js";

// Configuracion de express
import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// importar configuracion de dotenv
import "dotenv/config";

// import express-session
import session from "express-session";

// import connect para postgreSQL
import connectPgSimple from "connect-pg-simple";
const PgSession = connectPgSimple(session);

// import pg de pg
import pg from "pg";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// configuracion del pool de sesion
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: false,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  }),
);

// puerto para pruebas
const port = process.env.PORT || 5000;

// configuracion de la base de datos
import { db } from "./src/prisma/db.ts";

// RUTA PARA AUTENTICACION
app.use("/autenticacion", autenticacionRoute);

// RUTA DE USUARIOS
app.use("/usuarios", usuarioRoutes);

// RUTA DE ACTORES
app.use("/actores", actorRoutes);

// RUTA REPORTES CLIENTE
app.use("/reportesCliente", clienteReportesRoutes);

// RUTA DE FILMS
app.use("/vistasFilms", vistasfilmsRoutes);

// RUTA DE CATEGORIAS
app.use("/categoria", categoriaRoutes);

// FILMCATEGORIAS
app.use("/filmCategory", filmCategoryRoutes);

// RUTA FILMS
app.use("/film", filmRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
});
