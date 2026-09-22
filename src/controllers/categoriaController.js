// importamos la DB
import { db } from "../prisma/db.ts";

// CREAR categoria
export const crearCategoria = async (req, res) => {
  try {
    const { name } = req.body;

    const categoriaCreada = db.orm.public.Category.create({
      name: name,
    });
    console.log("Se creo la categoria");
    res
      .status(200)
      .json({ message: "Categoria creada", categoria: categoriaCreada });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};
