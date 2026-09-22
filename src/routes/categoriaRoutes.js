// importamos express
import express from "express";

// importamos los controladores CRUD
import { crearCategoria } from "../controllers/categoriaController.js";

// utilizamos router
const router = express.Router();

// CREAR categoria
router.post("/crearCategoria/", crearCategoria);

export default router;
