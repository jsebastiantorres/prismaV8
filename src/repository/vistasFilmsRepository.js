// importamos la db contract
import { db } from "../prisma/db.ts";

// GET vista films
export async function vistasFilmsRepository() {
  return db.orm.public.FilmList.all();
}
