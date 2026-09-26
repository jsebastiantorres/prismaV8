console.log("¡Proyecto de Node.js iniciado con éxito!");

// Importacion de ruta de actores
import actorRoutes from "./src/routes/actorRoutes.js";

// Importacion de ruta de clientes
import clienteReportesRoutes from "./src/routes/reportesClienteRoutes.js";

// Importacion de ruta para films
import vistasfilmsRoutes from "./src/routes/vistasFilmsRoutes.js";

// Importacion de ruta para categorias
import categoriaRoutes from "./src/routes/categoriaRoutes.js";

// Importarción de ruta tabla intermedia filmCategoryRoutes
import filmCategoryRoutes from "./src/routes/filmCategoryRoutes.js";

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

// // FILMS Filtro por categoria
// app.get("/film/:categoria", async (req, res) => {
//   try {
//     const idCategoria = Number(req.params.categoria);
//     console.log(idCategoria);

//     const filtroCategoria = await db.orm.public.FilmCategory.include("film")
//       .where({ categoryId: idCategoria })
//       .all();

//     if (!filtroCategoria) {
//       console.log("no se ejecuto la accion");
//       res.status(200).json({ err: "no se ejecuto la accion" });
//     }

//     console.log("Se ejecuto la accion");
//     res.status(200).json(filtroCategoria);
//   } catch (error) {
//     res.status(400).json({ err: error.message });
//   }
// });

// app.get("/films", async (req, res) => {
//   console.log("Films");
//   try {
//     const films = await db.orm.public.Film.all();
//     res.status(200).json(films);
//   } catch (error) {
//     res.status(500).json({ err: error.message });
//   }
// });

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
});
