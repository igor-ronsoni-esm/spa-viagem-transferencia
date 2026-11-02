import z from "zod";

export const EmpresaSchema = z.object({
  codigo: z.number(),
  sigla: z.string(),
  descricao: z.string(),
});

export type EmpresaOutput = z.infer<typeof EmpresaSchema>;
 