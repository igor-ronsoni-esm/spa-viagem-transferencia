import { ColunaOutput } from "../schemas/coluna.schema";

export default interface BuscarColunasUseCase {
  execute(chave: string): Promise<ColunaOutput[]>;
}
