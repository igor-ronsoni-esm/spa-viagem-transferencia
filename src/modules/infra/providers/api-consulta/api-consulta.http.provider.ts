import EnvConfiguration from "@configs/environment/env.config";
import BaseHttpConnector from "../../connectors/base-http.connector";

export default class ApiConsultaHttpProvider {
  private readonly connector: BaseHttpConnector;

  constructor() {
    const config = EnvConfiguration.get().api_consulta;
    this.connector = new BaseHttpConnector({ 
      host: config.host, 
      headers: {
        agencia: '64',
        token: config.headers.token
      } 
    });
  }

  public filter<T>(body: unknown): Promise<T> {
    return this.connector.post<T>("/search/filter", { body });
  }

  public search<T>(chave: string): Promise<T> {
    return this.connector.post<T>(`/search/`, { body: { queryName: chave } });
  }
}
