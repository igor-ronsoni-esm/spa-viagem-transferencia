import ApiConsultaHttpProvider from "@modules/infra/providers/api-consulta/api-consulta.http.provider";
import FiltrarDadosUseCase from "../usecases/filtrar-dados.usecase";
import { ColunaInput } from "../schemas/coluna.schema";
import { FiltroInput, FiltroRequest } from "../schemas/filtro.schema";
import { DadoOutput } from "../schemas/dados.entity";

export default class FiltrarDadosService implements FiltrarDadosUseCase {
  private readonly provider = new ApiConsultaHttpProvider();
  
  async execute(chave: string, filtros: FiltroInput[], colunas: ColunaInput[]): Promise<DadoOutput[]> {
    const filtro: FiltroRequest = {
      customQuery: this.#criarFiltro(filtros),
      queryName: chave,
    }

    const resultado = await this.provider.filter<unknown[][]>(filtro);
    return resultado.map((valores) => this.#toDadoOutput(valores, colunas));
  }

  #criarFiltro(filtros: FiltroInput[]): string {
    return filtros.filter(f => f.valor !== undefined && f.valor !== null).map(f => `AND ${f.campo} ${f.operacao} '${f.valor}'`).join(" ");
  }

  #toDadoOutput(valores: unknown[], colunas: ColunaInput[]): DadoOutput {
    if (valores.length !== colunas.length) {
      throw new Error(
        `Registro com ${valores.length} valores, esperado ${colunas.length}. A estrutura da query pode ter mudado.`,
      );
    }
  
    const row: DadoOutput = {};
    colunas.forEach((col, i) => {
      row[col.fieldName] = valores[i];
    });
    return row;
  }
}
