import { OcorrenciaViagemEnum, OcorrenciaViagemEnumOutput } from "@modules/domain/viagem/schemas/dados-viagem/ocorrencia/ocorrencias.schema";
import { TipoTransferenciaEnum, TipoTransferenciaEnumOutput } from "@modules/domain/viagem/schemas/dados-viagem/tipo-transferencia.schema";

const OCORRENCIAS_VIAGEM_PENDENTE = new Set<OcorrenciaViagemEnumOutput>([
  OcorrenciaViagemEnum.DISPONIBILIZACAO_VIAGEM_CANCELADA,
  OcorrenciaViagemEnum.PRE_VIAGEM,
  OcorrenciaViagemEnum.RASTREAMENTO_AGUARDANDO_CANCELAMENTO,
  OcorrenciaViagemEnum.REJEICAO_AUTORIZACAO,
]);

const OCORRENCIAS_VIAGEM_INICIADA = new Set<OcorrenciaViagemEnumOutput>([
  OcorrenciaViagemEnum.RASTREAMENTO_VIAGEM_INICIADA,
  OcorrenciaViagemEnum.TROCA_MOTORISTA_FINALIZADA,
  OcorrenciaViagemEnum.TROCA_MOTORISTA_INICIADA,
  OcorrenciaViagemEnum.VIAGEM_INICIADA,
]);


const OCORRENCIAS_VIAGEM_FINALIZADA = new Set<OcorrenciaViagemEnumOutput>([
  OcorrenciaViagemEnum.FIM_DE_VIAGEM,
  OcorrenciaViagemEnum.RASTREAMENTO_AGUARDANDO_FIM,
  OcorrenciaViagemEnum.RASTREAMENTO_ERRO_FIM,
  OcorrenciaViagemEnum.RASTREAMENTO_VIAGEM_FINALIZADA,
]);

const OCORRENCIAS_VIAGEM_PRONTA = new Set<OcorrenciaViagemEnumOutput>([
  OcorrenciaViagemEnum.AGUARDANDO_AUTORIZACAO,
  OcorrenciaViagemEnum.INICIO_VIAGEM_CANCELADA,
  OcorrenciaViagemEnum.RASTREAMENTO_AGUARDANDO_AGENDAMENTO,
  OcorrenciaViagemEnum.RASTREAMENTO_AGUARDANDO_INICIO,
  OcorrenciaViagemEnum.RASTREAMENTO_ERRO_AGENDAMENTO,
  OcorrenciaViagemEnum.RASTREAMENTO_ERRO_CANCELAMENTO,
  OcorrenciaViagemEnum.RASTREAMENTO_ERRO_INICIO,
  OcorrenciaViagemEnum.RASTREAMENTO_VIAGEM_AGENDADA,
  OcorrenciaViagemEnum.RASTREAMENTO_VIAGEM_CANCELADA,
  OcorrenciaViagemEnum.VIAGEM_DISPONIBILIZADA,
  OcorrenciaViagemEnum.PROCESSAMENTO_DOCUMENTOS_TERCEIRO,
]);

export function isViagemPendente(status: OcorrenciaViagemEnumOutput) {
  return OCORRENCIAS_VIAGEM_PENDENTE.has(status) || status === null || status === OcorrenciaViagemEnum.DESCONHECIDO;
}

export function isViagemIniciada(status: OcorrenciaViagemEnumOutput) {
  return OCORRENCIAS_VIAGEM_INICIADA.has(status);
}

export function isViagemFinalizada(status: OcorrenciaViagemEnumOutput) {
  return OCORRENCIAS_VIAGEM_FINALIZADA.has(status);
}

export function isViagemPronta(status: OcorrenciaViagemEnumOutput) {
  return OCORRENCIAS_VIAGEM_PRONTA.has(status);
}

export function isTipoTransferenciaExtra(tipo: TipoTransferenciaEnumOutput) {
  return tipo === TipoTransferenciaEnum.EXTRA;
}

export function isTipoTransferenciaEscala(tipo: TipoTransferenciaEnumOutput) {
  return tipo === TipoTransferenciaEnum.ESCALA;
}

export function isTipoTransferenciaRotaAlternativa(tipo: TipoTransferenciaEnumOutput) {
  return tipo === TipoTransferenciaEnum.ROTA_ALTERNATIVA;
}