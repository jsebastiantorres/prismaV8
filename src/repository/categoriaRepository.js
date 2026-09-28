import { db } from "../prisma/db.ts";

export async function crearCategory(name) {
  return db.orm.public.Category.create({ name: name });
}
