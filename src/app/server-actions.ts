"use server"

import { ResponseServerAction, success, error } from "@modules/utils/handling/response-server-action";
import { ResultadoConsultaViagensOutput } from "@modules/domain/viagem/schemas/resultado-consulta-viagens.schema";
import { ConsultarViagensUseCase } from "@modules/domain/viagem/usecases/consultar-viagens.usecase";
import { container } from "@modules/domain/DI";


export async function buscarViagens(): Promise<ResponseServerAction<ResultadoConsultaViagensOutput>> {
  try {
    const usecase: ConsultarViagensUseCase = container.get("ConsultarViagensUseCase");
    const viagens = await usecase.execute({
      codigoEmpresa: 64,
      dataReferencia: new Date(),
      direcao: "O",
      viagensPendentes: true,
      filtros: {
        status: "T"
      }
    });
  
    return success(viagens);
  } catch (err) {
    console.error(
        "[BUSCAR_VIAGENS] Erro ao buscar viagens:",
        err,
    );
    return error(
        err instanceof Error
            ? err.message
            : "Erro inesperado ao buscar viagens.",
    );
  }
}


 