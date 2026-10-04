// importamos la db contract
import { db } from "../prisma/db.ts";

// GET vista films
export async function vistasFilmsRepository() {
  console.log("repo");
  const filmList = db.raw.sql`SELECT * FROM  film_list`
    .returnsRow({
      fid: "pg/int4@1",
      title: "pg/text@1",
      description: "pg/text@1",
      category: "pg/text@1",
      price: "pg/text@1",
      length: "pg/int4@1",
      rating: "pg/text@1",
      actors: "pg/text@1",
    })
    .build();
  const result = await db.runtime().query(filmList);
  return result;
  // return db.orm.public.FilmList.all();
}
