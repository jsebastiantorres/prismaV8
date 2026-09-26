// importamos el repository
import { filterFilmCategory } from "../repository/filmCategoryRepository.js";


// Filtro films por categoria desde repository
export const filtarFilmCategoria = async (req, res) => {
    console.log("controller");
    
  try {
    const idCategoria = Number(req.params.categoria);

    const filtro = await filterFilmCategory(idCategoria);

    res.status(200).json(filtro);
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};
