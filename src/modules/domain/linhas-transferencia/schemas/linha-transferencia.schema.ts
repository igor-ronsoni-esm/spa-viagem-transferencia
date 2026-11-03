import z from "zod";
import { TrechoSchema } from "./trecho.schema";

export const LinhaTransferenciaSchema = z.object({
  codigo: z.number(),
  id: z.number(),
  descricao: z.string(),
  trecho: TrechoSchema.optional().nullable()
});