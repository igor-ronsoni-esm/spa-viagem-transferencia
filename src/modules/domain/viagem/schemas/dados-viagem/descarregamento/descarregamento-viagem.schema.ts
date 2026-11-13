import z from "zod";
import { SituacaoDescarregamentoSchemaEnum } from "./situacao.schema";
import { EmpresaSchema } from "@modules/domain/empresa/schemas/empresa.schema";

export const DescarregamentoViagemSchema = z.object({
  codigo: z.number().nullable(),
  situacao: SituacaoDescarregamentoSchemaEnum,
  empresa: EmpresaSchema,
  percurso: z.string(),
  incluidoNaEdicao: z.boolean().default(false)
});

export type DescarregamentoViagemOutput = z.infer<typeof DescarregamentoViagemSchema>;