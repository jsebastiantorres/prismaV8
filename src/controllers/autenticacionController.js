// import el repositorio
import { register, login } from "../repository/autenticacionRepository.js";

// // import express-session
// import session from 'express-session'

//import bcrypt
import bcrypt from "bcryptjs";

// registrarse
export const registrarse = async (req, res) => {
  try {
    const { nombre, usuario, password } = req.body;
    console.log(nombre, usuario, password);

    const validacionCredenciales = await login(usuario);
    if (validacionCredenciales) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // se hashea la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // se crean las credenciales de acceso
    const crearCredenciales = await register(nombre, usuario, passwordHash);

    res.status(200).json({ message: "Se crean las credenciales de acceso" });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

// Login
export const iniciarSesion = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      console.log("faltan datos");
      return res.status(500).json({ message: "faltan datos" });
    }

    // se hashea la contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    // validacion credenciales
    const validacionCredenciales = await login(usuario);
    const validacionDePassword = await bcrypt.compare(
      password,
      validacionCredenciales.passwordHash,
    );

    console.log(validacionCredenciales);

    // validaciones
    if (!validacionCredenciales || !validacionDePassword) {
      return res.status(500).json({ error: "Caredenciales inválidas" });
    }

    // Regenerar el ID sesion al iniciar session (evita: "session fixation")
    console.log(req.session);

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ error: "Error de sesion" });
      }

      // guardar solo lo necesario
      req.session.usuario = {
        id: validacionCredenciales.usuario_id,
        rol: validacionCredenciales.perfil_id,
      };

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ error: "Error de sesión" });
        }
        res.json({ message: "sesion iniciada" });
      });
    });

    // res.status(200).json({ message: "bienvenido" });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};
