import z from "zod";
import { TipoEmpresaEnumSchema } from "./tipo-empresa.schema";

export const EmpresaSchema = z.object({
  codigo: z.number(),
  sigla: z.string(),
  descricao: z.string(),
  tipo: TipoEmpresaEnumSchema.optional()
});

export type EmpresaOutput = z.infer<typeof EmpresaSchema>;
 