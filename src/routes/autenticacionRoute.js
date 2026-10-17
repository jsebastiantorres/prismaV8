// import express
import express from "express";

import {registrarse, iniciarSesion, cerrarSesion } from "../controllers/autenticacionController.js"

// express
const router = express.Router();

router.post("/registro", registrarse);

router.post("/login", iniciarSesion);

router.post("/logout", cerrarSesion)

export default router;
