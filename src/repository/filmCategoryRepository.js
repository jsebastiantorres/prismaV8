// importamos la DB
import { db } from "../prisma/db.ts";

export async function filterFilmCategory(idCategoria) {
  return db.orm.public.FilmCategory.where({ categoryId: idCategoria })
    .include("film")
    .all();
}
