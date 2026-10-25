"use server"

import { ResponseServerAction, success, error } from "@modules/utils/handling/response-server-action";
import { ResultadoConsultaViagensOutput } from "@modules/domain/viagem/schemas/resultado-consulta-viagens.schema";
import { ConsultarViagensUseCase } from "@modules/domain/viagem/usecases/consultar-viagens.usecase";
import { container } from "@modules/domain/DI";
import { dataAoMeioDia } from "../modules/utils/data.util";
import { ViagemOutput } from "../modules/domain/viagem/schemas/viagem.schema";
import { ConsultarViagemPorCodigoExecucaoUseCase } from "../modules/domain/viagem/usecases/consultar-viagem-por-codigo-execucao.usecase";


export async function buscarViagens(dataSelecionada: string): Promise<ResponseServerAction<ResultadoConsultaViagensOutput>> {
  try {
    const usecase: ConsultarViagensUseCase = container.get("ConsultarViagensUseCase");
    const viagens = await usecase.execute({
      codigoEmpresa: 64,
      dataReferencia: dataAoMeioDia(dataSelecionada).toISOString(),
      direcao: "O",
      viagensPendentes: true,
      filtros: {
        status: "T"
      },
      paginacao: { page: 1, limit: -1 }
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

export async function buscarViagemPorCodigoExecucao(viagem: number, empresa: number): Promise<ResponseServerAction<ViagemOutput>> {
  try {
    const usecase: ConsultarViagemPorCodigoExecucaoUseCase = container.get("ConsultarViagemPorCodigoExecucaoUseCase");
    const viagemResult = await usecase.execute(viagem, empresa);
  
    return success(viagemResult);
  } catch (err) {
    console.error(
        "[BUSCAR VIAGEM] Erro ao buscar viagem por código de execução:",
        err,
    );
    return error(
        err instanceof Error
            ? err.message
            : "Erro inesperado ao buscar viagem por código de execução.",
    );
  }
}


 