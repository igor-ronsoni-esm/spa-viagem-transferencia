import { OcorrenciaViagemEnum } from "@modules/domain/viagem/schemas/dados-viagem/ocorrencia/ocorrencias.schema";
import { ConfigLabelType } from "./type";
import { DOCUMENTO_FISCAL_STATUS_TRADUCAO, STATUS_TRADUCAO } from "./traducao";
import { StatusDocumentoFiscalEnum } from "@modules/domain/viagem/schemas/dados-viagem/documento-fiscal/status-documento-fiscal.schema";

type Config = Record<string, ConfigLabelType>;

export const STATUS_CONFIG: Config = {
  [OcorrenciaViagemEnum.PRE_VIAGEM]: { label: STATUS_TRADUCAO[OcorrenciaViagemEnum.PRE_VIAGEM].label, color: 'bg-blue-100', text: 'text-blue-700' },
  [OcorrenciaViagemEnum.AGUARDANDO_AUTORIZACAO]: { label: STATUS_TRADUCAO[OcorrenciaViagemEnum.AGUARDANDO_AUTORIZACAO].label, color: 'bg-orange-100', text: 'text-orange-700' },
  [OcorrenciaViagemEnum.REJEICAO_AUTORIZACAO]: { label: STATUS_TRADUCAO[OcorrenciaViagemEnum.REJEICAO_AUTORIZACAO].label, color: 'bg-red-100', text: 'text-red-700' },
  [OcorrenciaViagemEnum.VIAGEM_DISPONIBILIZADA]: { label: STATUS_TRADUCAO[OcorrenciaViagemEnum.VIAGEM_DISPONIBILIZADA].label, color: 'bg-green-100', text: 'text-green-700' },
  [OcorrenciaViagemEnum.VIAGEM_INICIADA]: { label: STATUS_TRADUCAO[OcorrenciaViagemEnum.VIAGEM_INICIADA].label, color: 'bg-green-700', text: 'text-white' },
  [OcorrenciaViagemEnum.FIM_DE_VIAGEM]: { label: STATUS_TRADUCAO[OcorrenciaViagemEnum.FIM_DE_VIAGEM].label, color: 'bg-gray-700', text: 'text-white' },
  [OcorrenciaViagemEnum.VIAGEM_CANCELADA]: { label: STATUS_TRADUCAO[OcorrenciaViagemEnum.VIAGEM_CANCELADA].label, color: 'bg-red-700', text: 'text-white' },
  [OcorrenciaViagemEnum.PROCESSAMENTO_DOCUMENTOS_TERCEIRO]: { label: STATUS_TRADUCAO[OcorrenciaViagemEnum.PROCESSAMENTO_DOCUMENTOS_TERCEIRO].label, color: 'bg-orange-100', text: 'text-orange-700' },
  SEM_STATUS: { label: STATUS_TRADUCAO.SEM_STATUS.label, color: 'bg-gray-200', text: 'text-gray-500' },
  DESCONHECIDO: { label: STATUS_TRADUCAO.DESCONHECIDO.label, color: 'bg-gray-200', text: 'text-gray-500' },
};

export const DOCUMENTO_FISCAL_STATUS_CONFIG: Config = {
  [StatusDocumentoFiscalEnum.AGUARDANDO_AUTORIZACAO]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.AGUARDANDO_AUTORIZACAO].label, color: 'bg-blue-50', text: 'text-blue-600' },
  [StatusDocumentoFiscalEnum.AGUARDANDO_CANCELAMENTO]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.AGUARDANDO_CANCELAMENTO].label, color: 'bg-blue-50', text: 'text-blue-600' },
  [StatusDocumentoFiscalEnum.AGUARDANDO_ENCERRAMENTO]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.AGUARDANDO_ENCERRAMENTO].label, color: 'bg-blue-50', text: 'text-blue-600' },
  [StatusDocumentoFiscalEnum.AUTORIZADO]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.AUTORIZADO].label, color: 'bg-green-50', text: 'text-green-600' },
  [StatusDocumentoFiscalEnum.ENCERRADO]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.ENCERRADO].label, color: 'bg-gray-100', text: 'text-gray-600' },
  [StatusDocumentoFiscalEnum.CANCELADO]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.CANCELADO].label, color: 'bg-red-50', text: 'text-red-600' },
  [StatusDocumentoFiscalEnum.REJEITADO]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.REJEITADO].label, color: 'bg-orange-50', text: 'text-orange-600' },
  [StatusDocumentoFiscalEnum.PENDENTE]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.PENDENTE].label, color: 'bg-blue-50', text: 'text-blue-600' },
  [StatusDocumentoFiscalEnum.COMPRADO]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.COMPRADO].label, color: 'bg-blue-50', text: 'text-blue-600' },
  [StatusDocumentoFiscalEnum.ERRO]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.ERRO].label, color: 'bg-red-50', text: 'text-red-600' },
  [StatusDocumentoFiscalEnum.NAO_ELEGIVEL]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.NAO_ELEGIVEL].label, color: 'bg-gray-100', text: 'text-gray-600' },
  [StatusDocumentoFiscalEnum.DESCONHECIDO]: { label: DOCUMENTO_FISCAL_STATUS_TRADUCAO[StatusDocumentoFiscalEnum.DESCONHECIDO].label, color: 'bg-gray-200', text: 'text-gray-500' },
};

