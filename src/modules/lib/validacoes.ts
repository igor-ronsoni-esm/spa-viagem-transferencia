import { OcorrenciaViagem, OcorrenciaViagemOutput, TipoTransferencia, TipoTransferenciaOutput } from "../domain/viagem/schemas/resultado-consulta-viagens.schema";

const OCORRENCIAS_VIAGEM_PENDENTE = new Set<OcorrenciaViagemOutput>([
  OcorrenciaViagem.DISPONIBILIZACAO_VIAGEM_CANCELADA,
  OcorrenciaViagem.PRE_VIAGEM,
  OcorrenciaViagem.RASTREAMENTO_AGUARDANDO_CANCELAMENTO,
  OcorrenciaViagem.REJEICAO_AUTORIZACAO,
]);

const OCORRENCIAS_VIAGEM_INICIADA = new Set<OcorrenciaViagemOutput>([
  OcorrenciaViagem.RASTREAMENTO_VIAGEM_INICIADA,
  OcorrenciaViagem.TROCA_MOTORISTA_FINALIZADA,
  OcorrenciaViagem.TROCA_MOTORISTA_INICIADA,
  OcorrenciaViagem.VIAGEM_INICIADA,
]);


const OCORRENCIAS_VIAGEM_FINALIZADA = new Set<OcorrenciaViagemOutput>([
  OcorrenciaViagem.FIM_DE_VIAGEM,
  OcorrenciaViagem.RASTREAMENTO_AGUARDANDO_FIM,
  OcorrenciaViagem.RASTREAMENTO_ERRO_FIM,
  OcorrenciaViagem.RASTREAMENTO_VIAGEM_FINALIZADA,
]);

const OCORRENCIAS_VIAGEM_PRONTA = new Set<OcorrenciaViagemOutput>([
  OcorrenciaViagem.AGUARDANDO_AUTORIZACAO,
  OcorrenciaViagem.INICIO_VIAGEM_CANCELADA,
  OcorrenciaViagem.RASTREAMENTO_AGUARDANDO_AGENDAMENTO,
  OcorrenciaViagem.RASTREAMENTO_AGUARDANDO_INICIO,
  OcorrenciaViagem.RASTREAMENTO_ERRO_AGENDAMENTO,
  OcorrenciaViagem.RASTREAMENTO_ERRO_CANCELAMENTO,
  OcorrenciaViagem.RASTREAMENTO_ERRO_INICIO,
  OcorrenciaViagem.RASTREAMENTO_VIAGEM_AGENDADA,
  OcorrenciaViagem.RASTREAMENTO_VIAGEM_CANCELADA,
  OcorrenciaViagem.VIAGEM_DISPONIBILIZADA,
  OcorrenciaViagem.PROCESSAMENTO_DOCUMENTOS_TERCEIRO,
]);

export function isViagemPendente(status: OcorrenciaViagemOutput) {
  return OCORRENCIAS_VIAGEM_PENDENTE.has(status) || status === null || status === OcorrenciaViagem.DESCONHECIDO;
}

export function isViagemIniciada(status: OcorrenciaViagemOutput) {
  return OCORRENCIAS_VIAGEM_INICIADA.has(status);
}

export function isViagemFinalizada(status: OcorrenciaViagemOutput) {
  return OCORRENCIAS_VIAGEM_FINALIZADA.has(status);
}

export function isViagemPronta(status: OcorrenciaViagemOutput) {
  return OCORRENCIAS_VIAGEM_PRONTA.has(status);
}

export function isTipoTransferenciaExtra(tipo: TipoTransferenciaOutput) {
  return tipo === TipoTransferencia.EXTRA;
}

export function isTipoTransferenciaEscala(tipo: TipoTransferenciaOutput) {
  return tipo === TipoTransferencia.ESCALA;
}

export function isTipoTransferenciaRotaAlternativa(tipo: TipoTransferenciaOutput) {
  return tipo === TipoTransferencia.ROTA_ALTERNATIVA;
}