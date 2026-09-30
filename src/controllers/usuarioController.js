import { loginUser } from "../repository/usuarioRepository.js";

export const iniciarSesion = async (req, res) => {
  try {
    const { usuario } = req.body;
    console.log(typeof usuario);

    const loginUsuario = await loginUser(usuario);
    console.log(loginUsuario);

    if (!loginUsuario) {
      res.status(400).json({ message: "usuario incorrecto" });
    } else if (loginUsuario.usuario === usuario) {
      res.status(200).json({ message: "Bienvenido", usuario: loginUsuario });
    }
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};
