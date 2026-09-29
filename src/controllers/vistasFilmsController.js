// importamos la db
import { db } from "../prisma/db.ts";

// import repository de viewGeneralFilms
import { vistasFilmsRepository } from "../repository/vistasFilmsRepository.js";

// VIEW general de films con vista mapeada desde contract con repository
export const vistaGeneralFilms = async (req, res) => {
  try {
    // repository
    const obtenerVistaFilms = await vistasFilmsRepository();
    console.log("consulta exitosa");
    res.status(200).json(obtenerVistaFilms);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};
