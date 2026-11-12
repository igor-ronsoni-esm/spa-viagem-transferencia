import z from "zod";
import { TipoMotoristaSchemaEnum } from "./tipo-motorista.schema";

export const MotoristaViagemSchema = z.object({
  codigo: z.number(),
  tipo: TipoMotoristaSchemaEnum,
  funcionario: z.object({
    codigo: z.number(),
    nome: z.string(),
  }),
});

export type MotoristaOutput = z.output<typeof MotoristaViagemSchema>;