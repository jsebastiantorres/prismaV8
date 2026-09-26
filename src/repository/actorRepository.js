// importamos DB
import { db } from "../prisma/db.ts";

// READ actor por ID
export async function readActor(idActor) {
  return db.orm.public.Actor.where({ actorId: idActor }).all().firstOrThrow();
}

// READ todos los actores
export async function readAllActors() {
  return db.orm.public.Actor.all();
}

// CREATE actor
export async function createActor(first_name, last_name) {
  return db.orm.public.Actor.create({
    firstName: first_name,
    lastName: last_name,
  });
}

// UPDATE actor
export async function updateActor(idActor, first_name, last_name) {
  return db.orm.public.Actor.where({ actorId: idActor }).update({
    firstName: first_name,
    lastName: last_name,
  });
}

// DELETE actor
export async function deleteActor(idActor) {
  return db.orm.public.Actor.where({ actorId: idActor }).delete();
}
