// express para router
import express from "express";

// importar controladores
import { iniciarSesion } from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/login", iniciarSesion);

export default router;
