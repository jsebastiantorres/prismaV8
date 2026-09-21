// Importar express
import express from "express";

// Importamos el controlador
import { totalPagadoCliente } from "../controllers/reportesClienteController.js";

// Utilizar Router
const router = express.Router();

// Determinar total pagado cliente
router.get("/totalPagado/:id", totalPagadoCliente);

// Se exporta router para leerlo desde app.js
export default router;
