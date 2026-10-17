// import el repositorio
import { register, login } from "../repository/autenticacionRepository.js";

// importar el pool
import { pool } from "../db/pool.js";

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
    req.session.regenerate(async (err) => {
      if (err) {
        return res.status(500).json({ error: "Error de sesion" });
      }

      try {
        const { rows } = await pool.query(
          `INSERT INTO historial_session (usuario_id, inicio, fin, ip)
       VALUES ($1, now(), $2, $3)
       RETURNING id`,
          [
            validacionCredenciales.usuarioId,
            req.session.cookie.expires,
            req.ip,
          ],
        );

        // guardar solo lo necesario
        req.session.usuario = {
          id: validacionCredenciales.usuarioId,
          rol: validacionCredenciales.perfilId,
          histId: rows[0].id,
        };

        console.log("Session Usuario", req.session.usuario);

        req.session.save(() => res.json({ message: "sesion iniciada" }));
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Error de sesión" });
      }
    });

    // res.status(200).json({ message: "bienvenido" });
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

// Cerrar sesion
export const cerrarSesion = async (req, res) => {
  const histId = req.session.usuario?.histId;
  console.log(`Se cierra sesion de ${histId}`);

  try {
    if (histId) {
      const resultado = await pool.query(
        `UPDATE historial_session SET fin = now() WHERE id = $1`,
        [histId],
      );
      console.log("filas actualizadas", resultado.rowCount, resultado.rows);
    }
  } catch (error) {
    console.log("error en update", error);
  }

  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "No se pudo cerrar sesión" });
    res.clearCookie("connect.sid");
    res.json({ mensaje: "Sesión cerrada" });
  });
};
