import { z } from "zod";

export const FiltroViagensSchema = z.object({
  codigoEmpresa: z.number(),
  dataReferencia: z.date().default(new Date()),
  direcao: z.string().default("O"),
  viagensPendentes: z.boolean().default(true),
  filtros: z.object({
      status: z.string().optional().nullable(),
      controleEmViagem: z.boolean().optional().nullable(),
      unidadeDestino: z.string().optional().nullable(),
      unidadeOrigem: z.string().optional().nullable(),
      codigoLinha: z.string().optional().nullable(),
  }).optional(),
  paginacao: z.object({
      page: z.number().default(1),
      limit: z.number().default(-1),
  }).optional(),
});

export type FiltroViagensOutput = z.infer<typeof FiltroViagensSchema>;
export type FiltroViagensInput = z.input<typeof FiltroViagensSchema>;