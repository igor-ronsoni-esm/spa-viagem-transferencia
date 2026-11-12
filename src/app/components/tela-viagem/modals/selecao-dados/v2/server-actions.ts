"use server";

import { error, ResponseServerAction, success } from "@modules/utils/handling/response-server-action";
import { ColunaOutput } from "@modules/domain/api-consulta/schemas/coluna.schema";
import BuscarColunasUseCase from "@modules/domain/api-consulta/usecases/buscar-colunas.usecase";
import { container } from "@modules/domain/DI";
import FiltrarDadosUseCase from "@modules/domain/api-consulta/usecases/filtrar-dados.usecase";
import { FiltroInput } from "@modules/domain/api-consulta/schemas/filtro.schema";
import { DadoOutput } from "@modules/domain/api-consulta/schemas/dados.entity";

export async function buscarColunas(chave: string): Promise<ResponseServerAction<ColunaOutput[]>> {
  try {
    const usecase: BuscarColunasUseCase = container.get("BuscarColunasUseCase");
    const resultado = await usecase.execute(chave);

    return success(resultado);
  } catch (err) {
    console.error(`[BUSCA_COLUNAS] [${chave}] Erro ao buscar colunas:`, err);
    return error(
        err instanceof Error
            ? err.message
            : "Erro inesperado ao buscar colunas.",
    );
  }
}

export async function buscarDados(chave: string, filtro: FiltroInput[], colunas: ColunaOutput[]): Promise<ResponseServerAction<DadoOutput[]>> {
  try {
    const usecase: FiltrarDadosUseCase = container.get("FiltrarDadosUseCase");
    const resultado = await usecase.execute(chave, filtro, colunas);

    return success(resultado);
  } catch (err) {
    console.error(`[BUSCA_DADOS] [${chave}] Erro ao buscar dados:`, err);
    return error(
        err instanceof Error
            ? err.message
            : "Erro inesperado ao buscar dados.",
    );
  }
}