import z from "zod";

export const EscalaSchema = z.object({
  dia: z.number(),
  dataInicio: z.string(),
  dataFim: z.string()
});

export type EscalaOutput = z.infer<typeof EscalaSchema>;