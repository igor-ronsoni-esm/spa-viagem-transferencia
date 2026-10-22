import {
  HttpConnectorNetworkError,
  HttpConnectorResponseError,
  HttpConnectorTimeoutError,
} from "@infra/connectors/http-connector.errors";

export function mapeiaErroFastcrudSearch(
  origem: string,
  error: unknown,
): Error {
  if (error instanceof HttpConnectorTimeoutError) {
    return new Error("O serviço de consulta demorou demais para responder.");
  }
  if (error instanceof HttpConnectorNetworkError) {
    return new Error("Não foi possível conectar ao serviço de consulta.");
  }
  if (error instanceof HttpConnectorResponseError) {
    console.error(
      `[${origem}] HTTP ${error.status} do api-fastcrud-search: ${error.body.slice(0, 500)}`,
    );
    return new Error("Não foi possível concluir a consulta.");
  }
  return error instanceof Error
    ? error
    : new Error("Erro inesperado ao consultar o api-fastcrud-search.");
}
