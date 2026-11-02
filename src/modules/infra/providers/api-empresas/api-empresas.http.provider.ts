import EnvConfiguration from "@configs/environment/env.config";
import BaseHttpConnector from "../../connectors/base-http.connector";

export default class ApiEmpresasHttpProvider {
  private readonly connector: BaseHttpConnector;

  constructor() {
    const config = EnvConfiguration.get().api_empresas;
    this.connector = new BaseHttpConnector({
      host: config.host,
      headers: {},
    });
  }

  public listarEmpresas(): Promise<any> {
    return this.connector.get<any>("empresas/v1", { });
  }
}
