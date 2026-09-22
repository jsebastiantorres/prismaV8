// importamos la DB
import { db } from "../prisma/db.ts";

// CREAR categoria
export const crearCategoria = async (req, res) => {
  try {
    const { name } = req.body;

    const categoriaCreada = db.orm.public.Category.create({
      name: name,
    });
    console.log("Se creo la categoria");
    res
      .status(200)
      .json({ message: "Categoria creada", categoria: categoriaCreada });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

// LEER todas las categorias
export const leerCategorias = async (req, res) => {
  try {
    const obtenerCategorias = await db.orm.public.Category.all();
    console.log("Se obtuvieron todas las categorias");

    res.status(200).json(obtenerCategorias);
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

// OBTENER categoria por ID
export const obtenerCategoriaId = async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);
    const obtenerCategoria = await db.orm.public.Category.where({
      categoryId: idCategoria,
    }).first();
    console.log("Se ha encontrado la categoria buscada");
    res.status(200).json(obtenerCategoria);
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

// ACTUALIZAR categoria
export const actualizarCategoria = async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);
    const { name } = req.body;
    const actualizarCat = await db.orm.public.Category.where({
      categoryId: idCategoria,
    }).update({ name: name });
    console.log("Categoria actualizada");
    res
      .status(200)
      .json({ message: "Categoria Actualizada", categoria: actualizarCat });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

// ELIMINAR categoria
export const eliminarCategoria = async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);
    const eliminarCat = await db.orm.public.Category.where({
      categoryId: idCategoria,
    }).delete();
    console.log("Se ha eliminado la categoria");
    res.status(200).json({ message: "Categoria eliminada" });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};
