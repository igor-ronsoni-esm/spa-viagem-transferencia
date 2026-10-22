import ViagemTransferenciaHttpProvider from "@/src/modules/infra/providers/viagem-transferencia/viagem-transferencia.http.provider";
import { FiltroViagensInput, FiltroViagensSchema } from "../schemas/filtro-viagens.schema";
import { ResultadoConsultaViagensOutput, ResultadoConsultaViagensSchema } from "../schemas/resultado-consulta-viagens.schema";
import { ConsultarViagensUseCase } from "../usecases/consultar-viagens.usecase";

export class ConsultarViagensService implements ConsultarViagensUseCase {
  private readonly provider = new ViagemTransferenciaHttpProvider();
  
  public async execute(filtro: FiltroViagensInput): Promise<ResultadoConsultaViagensOutput> {
    const data = FiltroViagensSchema.parse(filtro);
    const resultado = await this.provider.listarViagens(data);
    return ResultadoConsultaViagensSchema.parse(resultado.data); 
  }
}