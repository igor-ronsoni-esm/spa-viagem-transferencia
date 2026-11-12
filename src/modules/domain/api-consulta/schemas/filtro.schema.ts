import z from "zod";

export const OperacaoSchema = z.enum(["=", "<>", "like", ">", "<", ">=", "<="]);
export type Operacao = z.infer<typeof OperacaoSchema>;

const CAMPO_SQL = /^[A-Za-z_]\w*(\.[A-Za-z_]\w*)?$/;

const FiltroConsultaSchema = z.object({
  campo: z.string().regex(CAMPO_SQL, "Nome de campo inválido"),
  operacao: OperacaoSchema,
  valor: z.unknown()
})

const FiltroRequestSchema = z.object({
  filters: z.array(z.unknown()).default([]),
  queryName: z.string(),
  filterName: z.string().default(""),
  customQuery: z.string(),
  parameters: z.array(z.unknown()).default([]),
})

export type FiltroInput = z.infer<typeof FiltroConsultaSchema>;

export type FiltroRequest = z.input<typeof FiltroRequestSchema>;
