import z from "zod";
import { SituacaoDescarregamentoSchemaEnum } from "./situacao.schema";
import { EmpresaSchema } from "@modules/domain/empresa/schemas/empresa.schema";

export const DescarregamentoViagemSchema = z.object({
  codigo: z.number(),
  situacao: SituacaoDescarregamentoSchemaEnum,
  empresa: EmpresaSchema,
  percurso: z.string(),
});

export type DescarregamentoViagemOutput = z.infer<typeof DescarregamentoViagemSchema>;