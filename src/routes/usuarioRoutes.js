// express para router
import express from "express";

// importar controladores
import { iniciarSesion } from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/login", iniciarSesion);

export default router;
