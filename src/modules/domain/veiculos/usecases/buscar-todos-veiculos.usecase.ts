import { VeiculoOutput } from "../schemas/veiculo.schema";

export default interface BuscarTodosVeiculosUseCase {
  execute(): Promise<VeiculoOutput[]>;
}