import { EmpresaEntity } from "../entities/empresa.entity";

export default interface BuscaEmpresaPorSiglaUseCase {
  execute(sigla: string): Promise<EmpresaEntity | null>;
}
