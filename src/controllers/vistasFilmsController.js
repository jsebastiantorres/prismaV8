// importamos la db
import { db } from "../prisma/db.ts";

export const vistaGeneralFilms = async (req, res) => {
  try {
    // construir la consulta
    const obtenerVistaFilms = db.raw
      .sql`SELECT * FROM film_list ORDER BY fid DESC`
      .returnsRow({
        title: "pg/text@1",
        description: "pg/text@1",
        category: "pg/text@1",
        rating: "pg/text@1",
        actors: "pg/text@1",
      })
      .build();

    // ejecutar la consulta
    const rows = await db.runtime().query(obtenerVistaFilms);
    console.log("consulta exitosa");

    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};
