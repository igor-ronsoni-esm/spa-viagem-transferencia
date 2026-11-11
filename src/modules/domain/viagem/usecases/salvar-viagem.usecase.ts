import { ViagemInput } from "../schemas/viagem.schema";

export default interface SalvarViagemUseCase {
  execute(data: ViagemInput): Promise<void>;
}