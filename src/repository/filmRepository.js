// importar db
import { db } from "../prisma/db.ts";

// READ all films
export function readFilmAll() {
  return db.orm.public.Film.orderBy((f) => f.rating.desc()).all();
}
