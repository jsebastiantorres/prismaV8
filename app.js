console.log("¡Proyecto de Node.js iniciado con éxito!");

// Importacion de ruta de actores
import actorRoutes from "./src/routes/actorRoutes.js";

// Importacion de ruta de clientes
import clienteReportesRoutes from "./src/routes/reportesClienteRoutes.js";

// Importacion de ruta para films
import vistasfilmsRoutes from "./src/routes/vistasFilmsRoutes.js";

// Importacion de ruta para categorias
import categoriaRoutes from "./src/routes/categoriaRoutes.js";

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


// LEER categoria por ID

app.get("/categoria/:id", async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);

    const categoriaBuscada = await db.orm.public.Category.where({
      categoryId: idCategoria,
    }).first();

    console.log(categoriaBuscada);
    res.status(200).json(categoriaBuscada);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

// UPDATE categoria
app.patch("/categoria/update/:id", async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);
    const { name } = req.body;

    const categoriaEditar = await db.orm.public.Category.where({
      categoryId: idCategoria,
    }).update({ name: name });

    const categoriaNueva = await db.orm.public.Category.where({
      categoryId: idCategoria,
    }).first();

    console.log(
      `datos anteriores: ${categoriaEditar.name}, datos nuevos: ${categoriaNueva.name}`,
    );
    res.status(200).json(categoriaNueva);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

// DELETE categoria
app.delete("/categoria/delete/:id", async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);

    const categoriaEliminar = await db.orm.public.Category.where({
      categoryId: idCategoria,
    }).delete();

    if (!categoriaEliminar) {
      console.log("No se encontro la categoria");
      res.status(200).json({ err: "No se encontro la categoria" });
    }

    console.log("se elimino la categoria");
    res.status(200).json(categoriaEliminar);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

// FILMS Filtro por categoria
app.get("/film/:categoria", async (req, res) => {
  try {
    const idCategoria = Number(req.params.categoria);
    console.log(idCategoria);

    const filtroCategoria = await db.orm.public.FilmCategory.include("film")
      .where({ categoryId: idCategoria })
      .all();

    if (!filtroCategoria) {
      console.log("no se ejecuto la accion");
      res.status(200).json({ err: "no se ejecuto la accion" });
    }

    console.log("Se ejecuto la accion");
    res.status(200).json(filtroCategoria);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

app.get("/films", async (req, res) => {
  console.log("Films");
  try {
    const films = await db.orm.public.Film.all();
    res.status(200).json(films);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
});
