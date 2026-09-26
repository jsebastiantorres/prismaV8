// importamos la DB
import { db } from "../prisma/db.ts";


// FILTER films por categoria
export async function filterFilmCategory(idCategoria) {
  return db.orm.public.FilmCategory.where({ categoryId: idCategoria })
    .include("film")
    .all();
}
