// importamos express
import express from "express";

// importamos el controlador de vistas para films
import {vistaGeneralFilms} from "../controllers/vistasFilmsController.js";

// usamos router de express
const router = express.Router();

// rutas controllador
router.get("/vistaGeneral", vistaGeneralFilms);

// exportamos router
export default router;
