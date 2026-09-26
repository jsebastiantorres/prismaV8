import express from "express";

// Importamos controladores de film
import {obtenerFilmAll} from "../controllers/filmController.js" 

const router = express.Router();

// rutas

// Obtener todos los films
router.get("/", obtenerFilmAll)


export default router;
