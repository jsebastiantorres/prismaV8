import { db } from "../prisma/db.ts";

export async function register(nombre, usuario, pass) {
    console.log("repo   ");
    console.log(usuario, pass);

  return db.orm.public.Usuario.create({
    nombre: nombre,
    usuario: usuario,
    password_hash: pass,
  });
}

export async function login(usuario) {
  return db.orm.public.Usuario.where({ usuario: usuario }).first();
}
