import z from "zod";
import { TipoRodadoVeiculoEnumSchema, TipoRodadoVeiculoLiteralSchema } from "./tipo-rodado.schema";
import { TipoVeiculoSchemaEnum } from "./tipo-veiculo.schema";
import { TipoVeiculoSubSchemaEnum } from "./tipo-veiculo.sub-schema";
import { TipoRodadoVeiculoSubSchema } from "./tipo-rodado-veiculo.sub-schema";

export const VeiculoSchema = z.object({
  codigo: z.number(),
  placa: z.string(),
  descricao: z.string(),
  tipo: TipoVeiculoSchemaEnum,
  codigoEmpresa: z.number(),
  tipoRodado: TipoRodadoVeiculoEnumSchema,
});

export type VeiculoOutput = z.output<typeof VeiculoSchema>;
 
export const VeiculoInputSchema = VeiculoSchema
  .omit({
    tipoRodado: true,
    descricao: true,
  })
  .extend({
    tipo: TipoVeiculoSubSchemaEnum,
    modelo: z.string(),
    codigoRodadoMdfeId: TipoRodadoVeiculoSubSchema
  })
  .transform(({ modelo, codigoRodadoMdfeId, tipo, ...veiculo }): VeiculoOutput => ({
    ...veiculo,
    tipoRodado: codigoRodadoMdfeId,
    descricao: modelo,
    tipo: tipo,
  }));

export type VeiculoInput = z.input<typeof VeiculoInputSchema>;