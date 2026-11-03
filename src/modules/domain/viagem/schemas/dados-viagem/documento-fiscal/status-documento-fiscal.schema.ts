import z from "zod";

export const StatusDocumentoFiscalSchemaEnum = z.enum([
  "AGUARDANDO_AUTORIZACAO",
  "AGUARDANDO_CANCELAMENTO",
  "AGUARDANDO_ENCERRAMENTO",
  "AUTORIZADO",
  "CANCELADO",
  "ENCERRADO",
  "REJEITADO",
  "PENDENTE",
  "COMPRADO",
  "NAO_ELEGIVEL",
  "DESCONHECIDO",
  "ERRO"
])

export const StatusDocumentoFiscalEnum = StatusDocumentoFiscalSchemaEnum.enum;