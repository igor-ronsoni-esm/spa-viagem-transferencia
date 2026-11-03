import z from "zod";
import { ControleSchema } from "../documentos/controle.schema";

export const DescarregamentoDocumentosSchema = z.object({
  destino: z.string(),
  controles: z.array(ControleSchema)
});