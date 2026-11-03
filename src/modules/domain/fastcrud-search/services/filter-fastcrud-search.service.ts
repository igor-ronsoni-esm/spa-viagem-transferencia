import FastcrudSearchHttpProvider from "@modules/infra/providers/fastcrud-search/fastcrud-search.http.provider";
import FilterFastcrudSearchUseCase, { RequestFiltroFastcrudSearchEntity } from "../usecases/filter-fastcrud-search.usecase";
import { mapeiaErroFastcrudSearch } from "./mapeia-erro-fastcrud-search";
import ResponseFastcrudEntity from "../entities/response-fastcrud.entity";

export default class FilterFastcrudSearchService implements FilterFastcrudSearchUseCase {
  private readonly provider = new FastcrudSearchHttpProvider();

  public async execute(body: RequestFiltroFastcrudSearchEntity): Promise<ResponseFastcrudEntity> {
    try {
      return await this.provider.filter(body);
    } catch (error) {
      throw mapeiaErroFastcrudSearch("FilterFastcrudSearchService", error);
    }
  }
}
