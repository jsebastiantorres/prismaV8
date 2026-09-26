import { db } from "../prisma/db.ts";

// OBTENER lo total pagato por el cliente
export function pagadoCliente(idCliente) {
  const totalPagado = db.raw
    .sql`SELECT * FROM total_pagado_cliente(${idCliente})`
    .returnsRow({
      total_pagado_cliente: "pg/float8@1",
    })
    .build();

  // ejecucion de la consulta SQL
  return db.runtime().query(totalPagado);
}
