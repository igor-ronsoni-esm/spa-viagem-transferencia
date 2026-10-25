import { ViagemOutput } from "../schemas/viagem.schema";

export interface ConsultarViagemPorCodigoExecucaoUseCase {
  execute(viagem: number, empresa: number): Promise<ViagemOutput>;
}