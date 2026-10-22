import EnvConfiguration from "@configs/environment/env.config";
import BaseHttpConnector from "../../connectors/base-http.connector";

export default class FastcrudSearchHttpProvider {
  private readonly connector: BaseHttpConnector;

  constructor() {
    const config = EnvConfiguration.get().api_fastcrud_search;
    this.connector = new BaseHttpConnector({ host: config.host });
  }

  public filter<T>(body: unknown): Promise<T> {
    return this.connector.post<T>("/search/filter", body);
  }

  public metadata<T>(key: string): Promise<T> {
    return this.connector.get<T>(`/metadata/chave/${key}`);
  }
}
