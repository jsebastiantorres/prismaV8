// import express
import express from "express";

import {iniciarSesion, registrarse } from "../controllers/autenticacionController.js"

// express
const router = express.Router();

router.post("/registro", registrarse);

router.post("/login", iniciarSesion);

export default router;
