import ApiConsultaHttpProvider from "@modules/infra/providers/api-consulta/api-consulta.http.provider";
import { ColunaOutput } from "../schemas/coluna.schema";
import BuscarColunasUseCase from "../usecases/buscar-colunas.usecase";

export default class BuscarColunasService implements BuscarColunasUseCase {
  private readonly provider = new ApiConsultaHttpProvider();
  
  async execute(chave: string): Promise<ColunaOutput[]> {
    const colunas: any = await this.provider.search(chave);
    return colunas.fields;
  }
}
