import z from "zod";
import { OcorrenciaSchemaEnum } from "./ocorrencias.schema";

export const OcorrenciaViagemSchema = z.object({
  codigo: z.number(),
  chave: OcorrenciaSchemaEnum,
  vigente: z.boolean(),
  dataLancamento: z.string(),
});

export type OcorrenciaViagemOutput = z.infer<typeof OcorrenciaViagemSchema>;