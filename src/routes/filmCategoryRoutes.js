// importamos express
import express from "express";

// importamos el controladores
import { filtarFilmCategoria } from "../controllers/filmCategoryController.js";

// utilizamos el router de express
const router = express.Router();

// rutas
router.get("/:categoria", filtarFilmCategoria);

// exportamos router
export default router;
