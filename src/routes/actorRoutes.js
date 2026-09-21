// importar express
import express from "express";

// importar controllers
import {
  obtenerActoresAll,
  obtenerActorId,
  crearActor,
  actualizarActor,
  eliminarActor,
} from "../controllers/actoreController.js";

// utilizar Router()
const router = express.Router();

// LEER todos los actores
router.get("/", obtenerActoresAll);

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
