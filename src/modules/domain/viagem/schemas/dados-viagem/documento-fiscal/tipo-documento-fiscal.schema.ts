import z from "zod";

export const TipoDocumentoFiscalSchemaEnum = z.enum([
  "CIOT",
  "VPO",
  "MDFE"
])

export const TipoDocumentoFiscalEnum = TipoDocumentoFiscalSchemaEnum.enum;
