import { FiltroViagensInput } from "../schemas/filtro-viagens.schema";
import { ResultadoConsultaViagensOutput } from "../schemas/resultado-consulta-viagens.schema";

export interface ConsultarViagensUseCase {
  execute(filtro: FiltroViagensInput): Promise<ResultadoConsultaViagensOutput>;
}