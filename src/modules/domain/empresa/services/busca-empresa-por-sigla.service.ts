import BaseHttpConnector from "@infra/connectors/base-http.connector";
import {
  HttpConnectorNetworkError,
  HttpConnectorResponseError,
  HttpConnectorTimeoutError,
} from "@infra/connectors/http-connector.errors";
import {
  CHAVE_FASTCRUD_EMPRESAS_TIPO_FILIAIS,
  converteRegistroFastcrudParaEmpresa,
  EmpresaEntity,
} from "../entities/empresa.entity";
import BuscaEmpresaPorSiglaUseCase from "../usecases/busca-empresa-por-sigla.usecase";

type RespostaFiltroFastcrud = { data?: unknown[] };

export default class BuscaEmpresaPorSiglaService implements BuscaEmpresaPorSiglaUseCase {
  // Host relativo: `/api/fastcrud` é a rota deste próprio SPA (proxy para o api-fc-search),
  // não um host externo — chamado do navegador, na tela de filtros (Client Component).
  private readonly connector = new BaseHttpConnector({ host: "/api/fastcrud" });

  /**
   * Valida a sigla digitada pelo usuário (RF12/RF13/RF18). O `EsmInputTextButton` resolve o
   * texto digitado por PK (`GET /search/lookup/{key}/{id}`), não por sigla — inútil aqui.
   * `data: []` é resposta válida de "não encontrado" (HTTP 200), não erro.
   */
  public async execute(sigla: string): Promise<EmpresaEntity | null> {
    try {
      const resposta = await this.connector.post<RespostaFiltroFastcrud>("/search/filter", {
        searchKey: CHAVE_FASTCRUD_EMPRESAS_TIPO_FILIAIS,
        filterKey: "",
        filters: [{ field: "EMP_CODAG", operation: "=", value: sigla }],
      });

      const registro = resposta?.data?.[0];
      return registro ? converteRegistroFastcrudParaEmpresa(registro) : null;
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private mapError(error: unknown): Error {
    if (error instanceof HttpConnectorTimeoutError) {
      return new Error("O serviço de consulta de empresas demorou demais para responder.");
    }
    if (error instanceof HttpConnectorNetworkError) {
      return new Error("Não foi possível conectar ao serviço de consulta de empresas.");
    }
    if (error instanceof HttpConnectorResponseError) {
      console.error(
        `[BuscaEmpresaPorSiglaService] HTTP ${error.status} ao validar sigla: ${error.body.slice(0, 500)}`,
      );
      return new Error("Não foi possível validar a unidade informada.");
    }
    if (error instanceof SyntaxError) {
      console.error("[BuscaEmpresaPorSiglaService] corpo da resposta não é JSON válido:", error);
      return new Error("O serviço retornou uma resposta inválida.");
    }
    // Erro não reconhecido (ex.: TypeError do runtime) pode trazer texto técnico ou URL
    // interna — a mensagem crua vai só para o log; o `Swal.fire` de `validarSigla` exibe
    // `error.message`, então aqui nunca sai nada além do texto amigável.
    console.error("[BuscaEmpresaPorSiglaService] erro inesperado ao validar sigla:", error);
    return new Error("Erro inesperado ao validar a unidade informada.");
  }
}
