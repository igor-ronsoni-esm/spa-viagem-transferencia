import z from "zod";
import { TipoPesoM3SchemaEnum } from "./tipo-medida.schema";
import { EmpresaSchema } from "@modules/domain/empresa/schemas/empresa.schema";

export const ConhecimentoSchema = z.object({
  codigo: z.number(),
  numero: z.string(),
  quantidade: z.number(),
  peso: z.number(),
  m3: z.number(),
  tipoPesoM3: TipoPesoM3SchemaEnum,
  valor: z.number(),
  remetente: EmpresaSchema,
  destinatario: EmpresaSchema,
  dataEmissao: z.string()
})