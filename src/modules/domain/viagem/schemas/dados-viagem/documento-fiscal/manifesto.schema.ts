import z from "zod";
import { StatusDocumentoFiscalSchemaEnum } from "./status-documento-fiscal.schema";
import { TipoDocumentoFiscalSchemaEnum } from "./tipo-documento-fiscal.schema";

export const DocumentoFiscalSchema = z.object({
  codigo: z.number(),
  tipo: TipoDocumentoFiscalSchemaEnum,
  numero: z.string().nullable(),
  dataGeracao: z.string(),
  dataRetorno: z.string().nullable(),
  status: StatusDocumentoFiscalSchemaEnum.nullable().default("DESCONHECIDO"),
  motivoRejeicao: z.string().nullable()
});

export type DocumentoFiscalOutput = z.infer<typeof DocumentoFiscalSchema>;
