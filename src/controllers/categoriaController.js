// importamos la DB
import { db } from "../prisma/db.ts";

// importar repositorio de categoria
import {
  crearCategory,
  obtenerTodasCategorias,
  readCategoriaId,
  updateCategory,
  deleteCategory,
  eliminarCategoryName,
} from "../repository/categoriaRepository.js";

// CREAR categoria con repository
export const crearCategoria = async (req, res) => {
  try {
    const { name } = req.body;

    const categoriaCreada = await crearCategory(name);
    console.log("Se creo la categoria");
    res
      .status(200)
      .json({ message: "Categoria creada", categoria: categoriaCreada });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

// LEER todas las categorias con repository
export const leerCategorias = async (req, res) => {
  try {
    // repository
    const obtenerCategorias = await obtenerTodasCategorias();
    console.log("Se obtuvieron todas las categorias");

    res.status(200).json(obtenerCategorias);
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

// OBTENER categoria por ID con repository
export const obtenerCategoriaId = async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);
    const obtenerCategoria = await readCategoriaId(idCategoria);
    console.log("Se ha encontrado la categoria buscada");
    res.status(200).json(obtenerCategoria);
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

// ACTUALIZAR categoria con repository
export const actualizarCategoria = async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);
    const { name } = req.body;
    const actualizarCat = updateCategory(idCategoria, name);
    console.log("Categoria actualizada");
    res
      .status(200)
      .json({ message: "Categoria Actualizada", categoria: actualizarCat });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

// ELIMINAR categoria x id con repository
export const eliminarCategoria = async (req, res) => {
  try {
    const idCategoria = Number(req.params.id);
    const eliminarCat = await deleteCategory(idCategoria);
    console.log("Se ha eliminado la categoria");
    res.status(200).json({ message: "Categoria eliminada" });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

// ELIMINAR categoria x name con repository
export const eliminarCategoriaNombre = async (req, res) => {
  try {
    const nameCategory = req.params.name;
    console.log(typeof nameCategory);
    console.log(nameCategory);
    
    // repository
    const eliminarCategory = await eliminarCategoryName(nameCategory);
    res.status(200).json({
      message: `Se elimino la categoria que tenia nombre ${nameCategory}`,
      categoriaEliminada: eliminarCategory,
    });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};
