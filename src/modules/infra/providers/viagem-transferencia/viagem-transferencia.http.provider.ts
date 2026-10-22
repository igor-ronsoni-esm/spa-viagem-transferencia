import EnvConfiguration from "@configs/environment/env.config";
import BaseHttpConnector from "../../connectors/base-http.connector";
import { FiltroViagensInput } from "@modules/domain/viagem/schemas/filtro-viagens.schema";
import { ResultadoConsultaViagensOutput } from "@modules/domain/viagem/schemas/resultado-consulta-viagens.schema";

export default class ViagemTransferenciaHttpProvider {
  private readonly connector: BaseHttpConnector;

  constructor() {
    const config = EnvConfiguration.get().api_viagem_transferencia;
    this.connector = new BaseHttpConnector({
      host: config.host,
      headers: { "token": BaseHttpConnector.generateToken(config.secret ?? "", {iss: "api-base-rest", sub: "Expresso São Miguel"}, 15_000) },
    });
  }

  public listarViagens(filtro: FiltroViagensInput): Promise<any> {
    return this.connector.post<any>("v1/viagem-controle/buscar-viagens", { body: filtro });
  }
}
