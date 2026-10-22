import EnvConfiguration from "@configs/environment/env.config";
import BaseHttpConnector from "../../connectors/base-http.connector";

export default class FastcrudSearchHttpProvider {
  private readonly connector: BaseHttpConnector;

  constructor() {
    const config = EnvConfiguration.get().api_fastcrud_search;
    this.connector = new BaseHttpConnector({ host: config.host });
  }

  public consulta<T>(parametros: string[], chave: string): Promise<T> {
    return this.connector.post<T>("/buscar/consulta", {
      body: {
        sqlWhere: "",
        valoresParametros: parametros,
      },
      headers: {
        "chave": chave
      }
    });
  }
}
