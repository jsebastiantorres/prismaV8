// importamos express
import express from "express";

// importamos los controladores CRUD
import {
  crearCategoria,
  leerCategorias,
  obtenerCategoriaId,
  actualizarCategoria,
} from "../controllers/categoriaController.js";

// utilizamos router
const router = express.Router();

// CREAR categoria
router.post("/crearCategoria/", crearCategoria);

// LEER todos
router.get("/leerTodas", leerCategorias);

// LEER categoria por ID
router.get("/:id", obtenerCategoriaId);

// ACTUALIZAR categoria
router.patch("/update/:id", actualizarCategoria);

export default router;
