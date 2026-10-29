import { OcorrenciaViagemEnum, StatusDocumentoFiscalEnum, TipoTransferenciaEnum, TipoViagemEnum } from '@modules/domain/viagem/schemas/viagem.schema';
import { Empresa } from './types';

type DefinicaoTraducao = {
  label: string;
}

type DefinicaoConfig = {
  label: string;
  color: string;
  text: string;
}

type Config = Record<string, DefinicaoConfig>;
type Traducao = Record<string, DefinicaoTraducao>;

export const COLORS = {
  primary: '#280070',
  secondary: '#f9f9f9',
  success: '#10b981',
  info: '#3b82f6',
  muted: '#6b7280',
  danger: '#ef4444',
};

export enum ABAS_TELA_VIAGEM_ENUM {
  DADOS_GERAIS = 'DADOS GERAIS',
  DOCUMENTOS = 'DOCUMENTOS',
  OCORRENCIAS = 'OCORRÊNCIAS',
  DOCUMENTOS_FISCAIS = 'DOCUMENTOS FISCAIS',
}

export const EXTRA_TIPO_TRADUCAO = {
  1: "Aproveitamento",
  2: "Demanda Excedente de Carga",
  3: "Devolução",
  4: "Atrasos na Chegada",
  5: "Operação Comprometida",
  6: "Transferência de Veículo",
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

export const FISCAL_STATUS_CONFIG: Record<string, { label: string; color: string; text: string }> = {
  'AGUARDANDO AUTORIZACAO': { label: 'Aguardando Autorização', color: 'bg-blue-50', text: 'text-blue-600' },
  'CANCELADO': { label: 'Cancelado', color: 'bg-red-50', text: 'text-red-600' },
  'CANCELADA': { label: 'Cancelado', color: 'bg-red-50', text: 'text-red-600' },
  'REJEITADO': { label: 'Rejeitado', color: 'bg-orange-50', text: 'text-orange-600' },
  'REJEITADA': { label: 'Rejeitado', color: 'bg-orange-50', text: 'text-orange-600' },
  'AUTORIZADO': { label: 'Autorizado', color: 'bg-green-50', text: 'text-green-600' },
  'SUCESSO': { label: 'Autorizado', color: 'bg-green-50', text: 'text-green-600' },
  'ENCERRADO': { label: 'Encerrado', color: 'bg-gray-100', text: 'text-gray-600' },
  'PENDENTE': { label: 'Pendente', color: 'bg-yellow-50', text: 'text-yellow-600' },
};

export const TRIP_TYPES = ['Normal', 'Extra'] as const;
export const SECTION_TYPES = ['Transferencia', 'Vazio'] as const;

export const DEFAULT_COMPANIES: Empresa[] = [
  { id: 'emp-a', codigo: 'A', nome: 'Porto Alegre', label: 'A - Porto Alegre', cidade: 'Porto Alegre', uf: 'RS' },
  { id: 'emp-g', codigo: 'G', nome: 'Chapeco', label: 'G - Chapeco', cidade: 'Chapecó', uf: 'SC' },
  { id: 'emp-ft', codigo: 'FT', nome: 'CD Chapeco', label: 'FT - CD Chapeco', cidade: 'Chapecó - CD', uf: 'SC' },
  { id: 'emp-sp', codigo: 'SP', nome: 'São Paulo Matriz', label: 'SP - São Paulo', cidade: 'São Paulo', uf: 'SP' },
  { id: 'emp-cwb', codigo: 'CWB', nome: 'Curitiba Filial', label: 'CWB - Curitiba', cidade: 'Curitiba', uf: 'PR' },
  { id: 'emp-rio', codigo: 'RIO', nome: 'Rio de Janeiro Filial', label: 'RIO - Rio de Janeiro', cidade: 'Rio de Janeiro', uf: 'RJ' },
  { id: 'emp-bhz', codigo: 'BHZ', nome: 'Belo Horizonte Filial', label: 'BHZ - Belo Horizonte', cidade: 'Belo Horizonte', uf: 'MG' },
  { id: 'emp-fln', codigo: 'FLN', nome: 'Florianópolis', label: 'FLN - Florianópolis', cidade: 'Florianópolis', uf: 'SC' },
  { id: 'emp-joi', codigo: 'JOI', nome: 'Joinville Filial', label: 'JOI - Joinville', cidade: 'Joinville', uf: 'SC' },
  { id: 'emp-pas', codigo: 'PAS', nome: 'Passo Fundo', label: 'PAS - Passo Fundo', cidade: 'Passo Fundo', uf: 'RS' },
  { id: 'emp-cas', codigo: 'CAS', nome: 'Cascavel', label: 'CAS - Cascavel', cidade: 'Cascavel', uf: 'PR' },
  { id: 'emp-mar', codigo: 'MAR', nome: 'Maringá', label: 'MAR - Maringá', cidade: 'Maringá', uf: 'PR' },
  { id: 'emp-blu', codigo: 'BLU', nome: 'Blumenau', label: 'BLU - Blumenau', cidade: 'Blumenau', uf: 'SC' },
  { id: 'emp-ita', codigo: 'ITA', nome: 'Itajaí', label: 'ITA - Itajaí', cidade: 'Itajaí', uf: 'SC' },
  { id: 'emp-cxs', codigo: 'CXS', nome: 'Caxias do Sul', label: 'CXS - Caxias do Sul', cidade: 'Caxias do Sul', uf: 'RS' },
  { id: 'emp-sm', codigo: 'SM', nome: 'Santa Maria', label: 'SM - Santa Maria', cidade: 'Santa Maria', uf: 'RS' },
  { id: 'emp-pg', codigo: 'PG', nome: 'Ponta Grossa', label: 'PG - Ponta Grossa', cidade: 'Ponta Grossa', uf: 'PR' },
  { id: 'emp-foz', codigo: 'FOZ', nome: 'Foz do Iguaçu', label: 'FOZ - Foz do Iguaçu', cidade: 'Foz do Iguaçu', uf: 'PR' },
  { id: 'emp-lnd', codigo: 'LND', nome: 'Londrina', label: 'LND - Londrina', cidade: 'Londrina', uf: 'PR' },
  { id: 'emp-cps', codigo: 'CPS', nome: 'Campinas Terminal', label: 'CPS - Campinas', cidade: 'Campinas', uf: 'SP' },
  { id: 'emp-sjc', codigo: 'SJC', nome: 'São José dos Campos', label: 'SJC - São José dos Campos', cidade: 'São José dos Campos', uf: 'SP' },
  { id: 'emp-rpo', codigo: 'RPO', nome: 'Ribeirão Preto', label: 'RPO - Ribeirão Preto', cidade: 'Ribeirão Preto', uf: 'SP' },
  { id: 'emp-uber', codigo: 'UBER', nome: 'Uberlândia', label: 'UBER - Uberlândia', cidade: 'Uberlândia', uf: 'MG' },
  { id: 'emp-gyn', codigo: 'GYN', nome: 'Goiânia', label: 'GYN - Goiânia', cidade: 'Goiânia', uf: 'GO' },
  { id: 'emp-bsb', codigo: 'BSB', nome: 'Brasília', label: 'BSB - Brasília', cidade: 'Brasília', uf: 'DF' },
  { id: 'emp-cgb', codigo: 'CGB', nome: 'Cuiabá', label: 'CGB - Cuiabá', cidade: 'Cuiabá', uf: 'MT' },
  { id: 'emp-cgr', codigo: 'CGR', nome: 'Campo Grande', label: 'CGR - Campo Grande', cidade: 'Campo Grande', uf: 'MS' },
];
