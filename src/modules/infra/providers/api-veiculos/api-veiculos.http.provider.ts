import EnvConfiguration from "@configs/environment/env.config";
import BaseHttpConnector from "../../connectors/base-http.connector";

export default class ApiVeiculosHttpProvider {
  private readonly connector: BaseHttpConnector;

  constructor() {
    const config = EnvConfiguration.get().api_veiculos;
    this.connector = new BaseHttpConnector({
      host: config.host,
      headers: {
        "API-Key": config.headers.apiKey
      },
    });
  }

  public async listarVeiculos(): Promise<any> {
    return await this.connector.get<any>("vehicles/all", { });
  }

  public async buscarVeiculo(codigo: number): Promise<any> {
    return await this.connector.get<any>(`vehicles/${codigo}`, { });
  }
}
