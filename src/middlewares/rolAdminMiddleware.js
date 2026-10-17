// Middleware para confirmar permiso a la funcion
export const comprobarPermiso = (req, res, next) => {
  // Listado ROLES 1:admin, 2:usuario
  const simucionRoles = [1, 2];
  const rol = req.session.usuario?.rol;

  try {
    if (!rol) {
      return res.json({ err: "no hay rol" });
    }

    if (rol != 1) {
      return res
        .status(400)
        .json({ message: "NO TIENE permiso para esta función" });
    }
    // return res.status(200).json({ message: "SI TIENE PERMISO para esta función" });
    console.log("SI TIENE PERMISO para esta función");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  next();
};
