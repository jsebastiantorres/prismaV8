// importamos los servicios del repository
import { readFilmAll } from "../repository/filmRepository.js";

// obtener todos los film con repository
export const obtenerFilmAll = async (req, res) => {
  try {
    //repository
    const obtenerFilms = await readFilmAll();
    res.status(200).json(obtenerFilms);
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};
