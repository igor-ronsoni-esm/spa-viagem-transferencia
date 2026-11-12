import z from "zod";
import { VeiculoInputSchema, VeiculoOutput } from "../schemas/veiculo.schema";
import ApiVeiculosHttpProvider from "@modules/infra/providers/api-veiculos/api-veiculos.http.provider";
import BuscarVeiculoUseCase from "../usecases/buscar-veiculo.usecase";

export default class BuscarVeiculoService implements BuscarVeiculoUseCase {
  private readonly provider = new ApiVeiculosHttpProvider();
  
  async execute(codigo: number): Promise<VeiculoOutput> {
    const resultado = await this.provider.buscarVeiculo(codigo);
    return VeiculoInputSchema.parse(resultado?.data);
  }
}