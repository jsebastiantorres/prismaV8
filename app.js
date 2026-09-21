console.log("¡Proyecto de Node.js iniciado con éxito!");

// Importacion de ruta de actores
import actorRoutes from "./src/routes/actorRoutes.js";

// Importacion de ruta de clientes
import clienteReportesRoutes from "./src/routes/reportesCliente.js";

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

// ejecución vista para films
app.get("/films/", async (req, res) => {
  try {
    // 1 instancia del runtime
    const runtime = db.runtime();

    // 2 construir la consulta
    const films = db.raw.sql`SELECT * FROM film_list ORDER BY fid ASC`
      .returnsRow({
        fid: "pg/text@1",
        title: "pg/text@1",
        description: "pg/text@1",
        category: "pg/text@1",
        price: "pg/text@1",
        length: "pg/text@1",
        rating: "pg/text@1",
        actors: "pg/text@1",
      })
      .build();

    // 3 ejecutar la consulta
    const resultado = await runtime.query(films);
    console.log(resultado);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
});

// crud categoria

// create categoria
app.post("/categoria/crear", async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);

    const categoriaNueva = await db.orm.public.Category.create({
      name: name,
    });

    console.log("Se ha creado la categoria");
    res.status(200).json(categoriaNueva);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

// LEER categorias
app.get("/categoria/leertodos", async (req, res) => {
  try {
    // const todasCategorias = await db.orm.public.Category.all();
    const todasCategorias = await db.orm.public.Category.all();

    console.log(todasCategorias);
    res.status(200).json(todasCategorias);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

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
