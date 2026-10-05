// importamos la database
import { db } from "../prisma/db.ts";

// iniciar sesion por nombre usuario
export async function loginUser(usuario) {
  return db.orm.public.Usuario.where({ usuario: usuario }).first();
}
