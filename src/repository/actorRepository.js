// importamos DB
import { db } from "../prisma/db.ts";

// READ user por ID
export async function readActor(idActor) {
  return db.orm.public.Actor.where({ actorId: idActor }).all().firstOrThrow();
}
