import FastcrudSearchHttpProvider from "@infra/providers/fastcrud-search/fastcrud-search.http.provider";
import MetadataFastcrudSearchUseCase from "../usecases/metadata-fastcrud-search.usecase";
import { mapeiaErroFastcrudSearch } from "./mapeia-erro-fastcrud-search";

export default class MetadataFastcrudSearchService implements MetadataFastcrudSearchUseCase {
  private readonly provider = new FastcrudSearchHttpProvider();

  public async execute(key: string): Promise<unknown> {
    try {
      return await this.provider.metadata(key);
    } catch (error) {
      throw mapeiaErroFastcrudSearch("MetadataFastcrudSearchService", error);
    }
  }
}
