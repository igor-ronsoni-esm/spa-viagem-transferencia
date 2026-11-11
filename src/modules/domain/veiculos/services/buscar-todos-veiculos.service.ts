import z from "zod";
import { VeiculoInputSchema, VeiculoOutput } from "../schemas/veiculo.schema";
import BuscarTodosVeiculosUseCase from "../usecases/buscar-todos-veiculos.usecase";
import ApiVeiculosHttpProvider from "@modules/infra/providers/api-veiculos/api-veiculos.http.provider";

export default class BuscarTodosVeiculosService implements BuscarTodosVeiculosUseCase {
  private readonly provider = new ApiVeiculosHttpProvider();
  
  async execute(): Promise<VeiculoOutput[]> {
    const resultado = await this.provider.listarVeiculos();
    const veiculos = z.array(VeiculoInputSchema).parse(resultado?.data);
    return veiculos;
  }
}