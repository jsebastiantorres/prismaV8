// importamos servicios
import {
  readActor,
  readAllActors,
  createActor,
  updateActor,
  deleteActor,
} from "../repository/actorRepository.js";

// Obtener TODOS (all) los actores desde repository
export const obtenerActoresAll = async (req, res) => {
  try {
    // repository
    const actores = await readAllActors();

    res.status(200).json({ message: "Actores", actores: actores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// obtener ACTOR por ID desde repository
export const obtenerActorId = async (req, res) => {
  try {
    const idActor = Number(req.params.id);

    // repository
    const actorBuscado = await readActor(idActor);

    console.log(actorBuscado);
    res.status(200).json(actorBuscado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREAR ACTOR desde repository
export const crearActor = async (req, res) => {
  try {
    // datos del form
    const { first_name, last_name } = req.body;

    // repository
    const nuevoActor = await createActor(first_name, last_name);

    console.log("se ha creado el actor");
    res.status(200).json({ message: "actor creado", actor: nuevoActor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ACTUALIZAR ACTOR desde repository
export const actualizarActor = async (req, res) => {
  try {
    const idActor = req.params.id;
    const { first_name, last_name } = req.body;

    // repository
    const actualizarDatos = await updateActor(idActor, first_name, last_name);

    res
      .status(200)
      .json({ message: "Datos actualizados", actor: actualizarDatos });
    res.status(500).json({ error: error.message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ELIMINAR ACTOR desde repository
export const eliminarActor = async (req, res) => {
  try {
    const idActor = req.params.id;

    // repository
    const eliminarActor = await deleteActor(idActor);

    res
      .status(200)
      .json({ message: "Se ha eliminado el actor", actor: eliminarActor });
  } catch (error) {
    console.log("Error en controlador");

    res.status(500).json({ error: error.message });
  }
};
