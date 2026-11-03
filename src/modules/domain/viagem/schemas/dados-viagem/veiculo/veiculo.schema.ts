import z from "zod";
import { TipoVeiculoSchemaEnum } from "./tipo-veiculo.schema";

export const VeiculoSchema = z.object({
  codigo: z.number(),
  placa: z.string(),
  descricao: z.string(),
  tipo: TipoVeiculoSchemaEnum,
});