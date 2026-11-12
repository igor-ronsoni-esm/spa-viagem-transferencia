import { ColunaInput } from "../schemas/coluna.schema";
import { DadoOutput } from "../schemas/dados.entity";
import { FiltroInput } from "../schemas/filtro.schema";

export default interface FiltrarDadosUseCase {
  execute(chave: string, filtro: FiltroInput[], colunas: ColunaInput[]): Promise<DadoOutput[]>;
}
