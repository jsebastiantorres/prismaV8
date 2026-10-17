// importar express
import express from "express";

// importar controllers
import {
  obtenerActoresAll,
  obtenerActorId,
  crearActor,
  actualizarActor,
  eliminarActor,
} from "../controllers/actorController.js";


// importar middleware
import {comprobarPermiso} from '../middlewares/rolAdminMiddleware.js'

// utilizar Router()
const router = express.Router();

// LEER todos los actores
router.get("/", comprobarPermiso, obtenerActoresAll);

// ACTOR por ID
router.get("/:id", obtenerActorId);

// ACTOR CREAR
router.post("/crear", crearActor);

// ACTUALIZAR ACTOR
router.patch("/actualizar/:id", actualizarActor);

// ELIMINAR ACTOR
router.delete("/eliminar/:id", eliminarActor);

// Se Exporta Ruta
export default router;
