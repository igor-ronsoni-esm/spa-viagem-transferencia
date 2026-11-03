import ApiEmpresasHttpProvider from "@modules/infra/providers/api-empresas/api-empresas.http.provider";
import { EmpresaOutput } from "../schemas/empresa.schema";
import BuscarTodasEmpresasUseCase from "../usecases/buscar-todas-empresas.usecase";

export default class BuscarTodasEmpresasService implements BuscarTodasEmpresasUseCase {
  private readonly provider = new ApiEmpresasHttpProvider();
  
  async execute(): Promise<EmpresaOutput[]> {
    const resultado = await this.provider.listarEmpresas();
    const empresas = resultado?.data?.map((item: any) => ({
      codigo: item.codigo,
      descricao: item.nomeFantasia,
      sigla: item.codigoAgencia
    }));
    return empresas;
  }
}