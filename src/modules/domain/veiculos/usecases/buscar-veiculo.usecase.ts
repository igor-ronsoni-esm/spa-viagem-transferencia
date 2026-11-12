import { VeiculoOutput } from "../schemas/veiculo.schema";

export default interface BuscarVeiculoUseCase {
  execute(codigo: number): Promise<VeiculoOutput>;
}