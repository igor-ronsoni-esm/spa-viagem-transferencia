import EnvConfiguration from "@configs/environment/env.config";
import BaseHttpConnector from "../../connectors/base-http.connector";
import { FiltroViagensInput } from "@modules/domain/viagem/schemas/filtro-viagens.schema";
import TokenCache from "@modules/utils/token-cache.util";

export default class ViagemTransferenciaHttpProvider {
  private static readonly TTL_TOKEN_MS = 15_000;
  private static readonly tokenCache = new TokenCache(() => {
    const config = EnvConfiguration.get().api_viagem_transferencia;
    return BaseHttpConnector.generateToken(
      config.secret ?? "",
      { iss: "api-base-rest", sub: "Expresso São Miguel" },
      ViagemTransferenciaHttpProvider.TTL_TOKEN_MS,
    );
  }, ViagemTransferenciaHttpProvider.TTL_TOKEN_MS);

  private readonly connector: BaseHttpConnector;

  constructor() {
    const config = EnvConfiguration.get().api_viagem_transferencia;
    this.connector = new BaseHttpConnector({
      host: config.host,
      headers: {},
    });
  }

  private headers() {
    return { token: ViagemTransferenciaHttpProvider.tokenCache.obter() };
  }
  public listarViagens(filtro: FiltroViagensInput): Promise<any> {
    return this.connector.post<any>("v1/viagem-controle/buscar-viagens", {
      body: filtro,
      headers: this.headers(),
    });
  }

  public buscarPorExecucao(
    codigoExecucao: number,
    empresa: number,
  ): Promise<any> {
    return this.connector.get<any>(
      `v1/viagem-controle/buscar-por-execucao/${codigoExecucao}/${empresa}`,
      { headers: this.headers() },
    );
  }
}
