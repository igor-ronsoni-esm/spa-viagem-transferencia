import z from "zod";
import { TipoInclusaoControleEmViagemSchemaEnum } from "./tipo-inclusao.schema";
import { ConhecimentoSchema } from "./conhecimento.schema";
import { NotaFiscalSchema } from "./nota-fiscal.schema";
import { EmpresaSchema } from "@modules/domain/empresa/schemas/empresa.schema";

export const ControleSchema = z.object({
  marcado: z.boolean().nullable().default(false),
  codigo: z.number(),
  chave: z.string(),
  origem: EmpresaSchema,
  destino: EmpresaSchema,
  tipoInclusao: TipoInclusaoControleEmViagemSchemaEnum.nullable(),
  ctes: z.array(ConhecimentoSchema),
  nfes: z.array(NotaFiscalSchema).optional().nullable()
});

export type ControleOutput = z.infer<typeof ControleSchema>;