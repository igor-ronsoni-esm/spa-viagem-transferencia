import { VeiculoSchema } from "@modules/domain/veiculos/schemas/veiculo.schema";
import z from "zod";

export const VeiculoViagemSchema = z.object({
  codigo: z.number().nullable(),
  principal: z.boolean(),
  veiculo: VeiculoSchema.omit({ codigoEmpresa: true })
});

export type VeiculoViagem = z.output<typeof VeiculoViagemSchema>;