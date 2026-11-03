import z from "zod";

export const SituacaoDescarregamentoSchemaEnum = z.enum(["S", "N"])

export const SituacaoDescarregamentoEnum = SituacaoDescarregamentoSchemaEnum.enum;

export type SituacaoDescarregamentoEnumOutput = z.infer<typeof SituacaoDescarregamentoSchemaEnum>;
