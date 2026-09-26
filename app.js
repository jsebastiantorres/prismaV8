console.log("¡Proyecto de Node.js iniciado con éxito!");

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

// puerto para pruebas
const port = process.env.PORT || 5000;

// configuracion de la base de datos
import { db } from "./src/prisma/db.ts";

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
app.use("/film", filmRoutes)


app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
});
