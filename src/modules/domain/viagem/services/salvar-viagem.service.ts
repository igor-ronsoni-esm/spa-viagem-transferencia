import { SalvarViagemSchema } from "../schemas/salvar-viagem.schema";
import { ViagemInput } from "../schemas/viagem.schema";
import SalvarViagemUseCase from "../usecases/salvar-viagem.usecase";

export default class SalvarViagemService implements SalvarViagemUseCase {
  async execute(data: ViagemInput): Promise<void> {
    console.log(SalvarViagemSchema.parse(data))
    // Preciso fazer esperar 10 segundos
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}