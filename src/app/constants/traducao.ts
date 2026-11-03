import { OcorrenciaViagemEnum } from "@modules/domain/viagem/schemas/dados-viagem/ocorrencia/ocorrencias.schema";
import { TraducaoType } from "./type";
import { TipoViagemEnum } from "@modules/domain/viagem/schemas/dados-viagem/tipo-viagem.schema";
import { TipoTransferenciaEnum } from "@modules/domain/viagem/schemas/dados-viagem/tipo-transferencia.schema";
import { StatusDocumentoFiscalEnum } from "@modules/domain/viagem/schemas/dados-viagem/documento-fiscal/status-documento-fiscal.schema";
import { TipoVeiculoEnum } from "@modules/domain/viagem/schemas/dados-viagem/veiculo/tipo-veiculo.schema";
import { TipoInclusaoControleEmViagemEnum } from "@modules/domain/viagem/schemas/dados-viagem/documentos/tipo-inclusao.schema";

type Traducao = Record<string, TraducaoType>;

export const EXTRA_TIPO_TRADUCAO: Traducao = {
  1: { label: "Aproveitamento" },
  2: { label: "Demanda Excedente de Carga" },
  3: { label: "Devolução" },
  4: { label: "Atrasos na Chegada" },
  5: { label: "Operação Comprometida" },
  6: { label: "Transferência de Veículo" },
} as const;

export const STATUS_TRADUCAO: Traducao = {
  [OcorrenciaViagemEnum.COMPARTILHAMENTO_CANCELADO]: { label: 'Compartilhamento Cancelado' },
  [OcorrenciaViagemEnum.DISPONIBILIZACAO_VIAGEM_CANCELADA]: { label: 'Disponibilização Viagem Cancelada' },
  [OcorrenciaViagemEnum.INICIO_VIAGEM_CANCELADA]: { label: 'Início Viagem Cancelada' },
  [OcorrenciaViagemEnum.LIBERADO_CONTINGENCIA]: { label: 'Liberado Contingência' },
  [OcorrenciaViagemEnum.PRE_VIAGEM]: { label: 'Pré Viagem' },
  [OcorrenciaViagemEnum.RASTREAMENTO_AGUARDANDO_AGENDAMENTO]: { label: 'Rastreamento Aguardando Agendamento' },
  [OcorrenciaViagemEnum.RASTREAMENTO_AGUARDANDO_CANCELAMENTO]: { label: 'Rastreamento Aguardando Cancelamento' },
  [OcorrenciaViagemEnum.RASTREAMENTO_AGUARDANDO_FIM]: { label: 'Rastreamento Aguardando Fim' },
  [OcorrenciaViagemEnum.RASTREAMENTO_AGUARDANDO_INICIO]: { label: 'Rastreamento Aguardando Início' },
  [OcorrenciaViagemEnum.RASTREAMENTO_ERRO_AGENDAMENTO]: { label: 'Rastreamento Erro Agendamento' },
  [OcorrenciaViagemEnum.RASTREAMENTO_ERRO_CANCELAMENTO]: { label: 'Rastreamento Erro Cancelamento' },
  [OcorrenciaViagemEnum.RASTREAMENTO_ERRO_FIM]: { label: 'Rastreamento Erro Fim' },
  [OcorrenciaViagemEnum.RASTREAMENTO_ERRO_INICIO]: { label: 'Rastreamento Erro Início' },
  [OcorrenciaViagemEnum.RASTREAMENTO_VIAGEM_AGENDADA]: { label: 'Rastreamento Viagem Agendada' },
  [OcorrenciaViagemEnum.RASTREAMENTO_VIAGEM_CANCELADA]: { label: 'Rastreamento Viagem Cancelada' },
  [OcorrenciaViagemEnum.RASTREAMENTO_VIAGEM_FINALIZADA]: { label: 'Rastreamento Viagem Finalizada' },
  [OcorrenciaViagemEnum.RASTREAMENTO_VIAGEM_INICIADA]: { label: 'Rastreamento Viagem Iniciada' },
  [OcorrenciaViagemEnum.TROCA_MOTORISTA_FINALIZADA]: { label: 'Troca Motorista Finalizada' },
  [OcorrenciaViagemEnum.TROCA_MOTORISTA_INICIADA]: { label: 'Troca Motorista Iniciada' },
  [OcorrenciaViagemEnum.VIAGEM_COMPARTILHADA]: { label: 'Viagem Compartilhada' },
  [OcorrenciaViagemEnum.AGUARDANDO_AUTORIZACAO]: { label: 'Aguardando Autorização' },
  [OcorrenciaViagemEnum.REJEICAO_AUTORIZACAO]: { label: 'Autorização Rejeitada' },
  [OcorrenciaViagemEnum.VIAGEM_DISPONIBILIZADA]: { label: 'Disponibilizada' },
  [OcorrenciaViagemEnum.VIAGEM_INICIADA]: { label: 'Iniciada' },
  [OcorrenciaViagemEnum.FIM_DE_VIAGEM]: { label: 'Finalizada' },
  [OcorrenciaViagemEnum.VIAGEM_CANCELADA]: { label: 'Cancelada' },
  [OcorrenciaViagemEnum.PROCESSAMENTO_DOCUMENTOS_TERCEIRO]: { label: 'Processamento Docs Terceiro' },
  SEM_STATUS: { label: 'Não Gerada' },
  DESCONHECIDO: { label: 'Status Desconhecido' },
};

export const TIPO_VIAGEM_TRADUCAO: Traducao = {
  [TipoViagemEnum.TRANSFERENCIA]: { label: 'Transferência' },
  [TipoViagemEnum.VAZIO]: { label: 'Vazio' },
};

export const TIPO_TRANSFERENCIA_TRADUCAO: Traducao = {
  [TipoTransferenciaEnum.ESCALA]: { label: 'Escala' },
  [TipoTransferenciaEnum.EXTRA]: { label: 'Extra' },
  [TipoTransferenciaEnum.ROTA_ALTERNATIVA]: { label: 'Rota Alternativa' },
};

export const TIPO_INCLUSAO_CONTROLE_TRADUCAO: Traducao = {
  [TipoInclusaoControleEmViagemEnum.AUTOMATICO]: { label: 'Automático' },
  [TipoInclusaoControleEmViagemEnum.MANUAL_GESTAO]: { label: 'Manual via Gestão' },
  [TipoInclusaoControleEmViagemEnum.MANUAL_VIAGEM]: { label: 'Manual via Viagem' },
};

export const DOCUMENTO_FISCAL_STATUS_TRADUCAO: Traducao = {
  [StatusDocumentoFiscalEnum.AGUARDANDO_AUTORIZACAO]: { label: 'Aguardando Autorização' },
  [StatusDocumentoFiscalEnum.AGUARDANDO_CANCELAMENTO]: { label: 'Aguardando Cancelamento' },
  [StatusDocumentoFiscalEnum.AGUARDANDO_ENCERRAMENTO]: { label: 'Aguardando Encerramento' },
  [StatusDocumentoFiscalEnum.AUTORIZADO]: { label: 'Autorizado' },
  [StatusDocumentoFiscalEnum.CANCELADO]: { label: 'Cancelado' },
  [StatusDocumentoFiscalEnum.ENCERRADO]: { label: 'Encerrado' },
  [StatusDocumentoFiscalEnum.REJEITADO]: { label: 'Rejeitado' },
  [StatusDocumentoFiscalEnum.NAO_ELEGIVEL]: { label: 'Não Elegível' },
  [StatusDocumentoFiscalEnum.PENDENTE]: { label: 'Pendente' },
  [StatusDocumentoFiscalEnum.COMPRADO]: { label: 'Comprado' },
  [StatusDocumentoFiscalEnum.ERRO]: { label: 'Erro' },
  [StatusDocumentoFiscalEnum.DESCONHECIDO]: { label: 'Status Desconhecido' },
  SEM_STATUS: { label: 'Sem Status' },
};

export const TIPO_VEICULO_TRADUCAO: Traducao = {
  [TipoVeiculoEnum.PROPRIO]: { label: 'Próprio' },
  [TipoVeiculoEnum.AGREGADO]: { label: 'Agregado' },
  [TipoVeiculoEnum.DIARISTA]: { label: 'Diarista' },
  [TipoVeiculoEnum.TERCEIRO]: { label: 'Terceiro' },
  DESCONHECIDO: { label: 'Desconhecido' },
};

