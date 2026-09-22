// importamos express
import express from "express";

// importamos los controladores CRUD
import { crearCategoria, leerCategorias } from "../controllers/categoriaController.js";

// utilizamos router
const router = express.Router();

// CREAR categoria
router.post("/crearCategoria/", crearCategoria);


// LEER todos
router.get("/leerTodas", leerCategorias)

export default router;
