import ViagemTransferenciaHttpProvider from "@/src/modules/infra/providers/viagem-transferencia/viagem-transferencia.http.provider";
import { ViagemOutput, ViagemSchema } from "../schemas/viagem.schema";
import { ConsultarViagemPorCodigoExecucaoUseCase } from "../usecases/consultar-viagem-por-codigo-execucao.usecase";

export class ConsultarViagemPorCodigoExecucaoService implements ConsultarViagemPorCodigoExecucaoUseCase {
    private readonly provider = new ViagemTransferenciaHttpProvider();
  
  public async execute(viagem: number, empresa: number): Promise<ViagemOutput> {
    const resultado = await this.provider.buscarPorExecucao(viagem, empresa);
    return ViagemSchema.parse(resultado); 
  }
}