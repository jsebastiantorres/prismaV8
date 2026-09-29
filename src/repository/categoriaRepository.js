import { db } from "../prisma/db.ts";

// CREATE categoria
export async function crearCategory(name) {
  return db.orm.public.Category.create({ name: name });
}

// READ categorias all
export async function obtenerTodasCategorias() {
  return db.orm.public.Category.all();
}

// READ categoria por ID
export async function readCategoriaId(id) {
  return db.orm.public.Category.where({ categoryId: id }).first();
}

// UPDATE categoria
export async function updateCategory(id, name) {
  return db.orm.public.Category.where({ categoryId: id }).update({
    name: name,
  });
}

// ELIMINAR x id
export async function deleteCategory(id) {
  return db.orm.public.Category.where({ categoryId: id }).delete();
}

// ELIMINAR x nombre
export async function eliminarCategoryName(name) {
  return db.orm.public.Category.where({ name: name }).deleteAll();
}
