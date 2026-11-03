import z from "zod";
import { EmpresaSchema } from "../../empresa/schemas/empresa.schema";

export const TrechoSchema = z.object({
  codigo: z.number(),
  origem: EmpresaSchema,
  destino: EmpresaSchema,
});