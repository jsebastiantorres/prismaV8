
// importamos los servicios del repository
import { pagadoCliente } from "../repository/clienteFuncionesRepository.js";

// Reporte total pagado cliente con repository
export const totalPagadoCliente = async (req, res) => {
  try {
    // idCliente
    const idCliente = Number(req.params.id);
    // construccion de la consulta SQL

    // repository
    const totalPagado = await pagadoCliente(idCliente)
    console.log(totalPagado);

    res.status(200).json(totalPagado);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};
