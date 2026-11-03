import z from "zod";
import { VeiculoSchema } from "./veiculo.schema";

export const VeiculoViagemSchema = z.object({
  codigo: z.number(),
  principal: z.boolean(),
  veiculo: VeiculoSchema,
});