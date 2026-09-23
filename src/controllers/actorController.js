// se importa o se instancia el modelo general de prisma
import { db } from "../prisma/db.ts";

// importamos servicios
import { readActor } from "../repository/actorRepository.js";

// Obtener TODOS (all) los actores
export const obtenerActoresAll = async (req, res) => {
  try {
    // Sintaxis de prisma 8 para traer todos los registros
    const actores = await db.orm.public.Actor.all();
    res.status(200).json(actores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// obtener ACTOR por ID
export const obtenerActorId = async (req, res) => {
  try {
    const idActor = Number(req.params.id);

    const actorBuscado = await readActor(idActor);

    console.log(actorBuscado);
    res.status(200).json(actorBuscado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREAR ACTOR
export const crearActor = async (req, res) => {
  try {
    // datos del form
    const { first_name, last_name } = req.body;

    const nuevoActor = await db.orm.public.Actor.create({
      first_name: first_name,
      last_name: last_name,
    });

    console.log("se ha creado el actor");
    res.status(200).json({ message: "actor creado", actor: nuevoActor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ACTUALIZAR ACTOR
export const actualizarActor = async (req, res) => {
  try {
    const idActor = req.params.id;
    const { first_name, last_name } = req.body;
    const actualizarDatos = db.orm.public.Actor.where({
      actorId: idActor,
    }).update({
      firstName: first_name,
      lastName: last_name,
    });

    console.log("Se ha actualizado el actor");
    res
      .status(200)
      .json({ message: "Datos actualizados", actor: actualizarDatos });
    res.status(500).json({ error: error.message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ELIMINAR ACTOR
export const eliminarActor = async (req, res) => {
  try {
    const idActor = req.params.id;

    const eliminarActor = db.orm.public.Actor.where({
      actorId: idActor,
    }).delete();

    res
      .status(200)
      .json({ message: "Se ha eliminado el actor", actor: eliminarActor });
  } catch (error) {
    console.log("Error en controlador");

    res.status(500).json({ error: error.message });
  }
};
