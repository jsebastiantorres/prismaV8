// Importar la DB
import { db } from "../prisma/db.ts";

// Reporte total pagado cliente
export const totalPagadoCliente = async (req, res) => {
  try {
    // idCliente
    const idCliente = Number(req.params.id);
    // construccion de la consulta SQL
    const totalPagado = db.raw
      .sql`SELECT * FROM total_pagado_cliente(${idCliente})`
      .returnsRow({
        total_pagado_cliente: "pg/float8@1",
      })
      .build();

    // ejecucion de la consulta SQL
    const [rows] = await db.runtime().query(totalPagado);
    console.log(rows);

    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};
