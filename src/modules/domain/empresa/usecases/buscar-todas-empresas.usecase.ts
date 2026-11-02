import { EmpresaOutput } from "../schemas/empresa.schema";

export default interface BuscarTodasEmpresasUseCase {
  execute(): Promise<EmpresaOutput[]>;
}