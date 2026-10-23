import { OcorrenciaViagem } from '@modules/domain/viagem/schemas/resultado-consulta-viagens.schema';
import { Empresa } from './types';

export const COLORS = {
  primary: '#280070',
  secondary: '#f9f9f9',
  success: '#10b981',
  info: '#3b82f6',
  muted: '#6b7280',
  danger: '#ef4444',
};

export const STATUS_CONFIG = {
  [OcorrenciaViagem.PRE_VIAGEM]: { label: 'Pré viagem', color: 'bg-blue-100', text: 'text-blue-700' },
  [OcorrenciaViagem.AGUARDANDO_AUTORIZACAO]: { label: 'Aguard. Autorização', color: 'bg-orange-100', text: 'text-orange-700' },
  [OcorrenciaViagem.REJEICAO_AUTORIZACAO]: { label: 'Autorização Rejeitada', color: 'bg-red-100', text: 'text-red-700' },
  [OcorrenciaViagem.VIAGEM_DISPONIBILIZADA]: { label: 'Disponibilizada', color: 'bg-green-100', text: 'text-green-700' },
  [OcorrenciaViagem.VIAGEM_INICIADA]: { label: 'Iniciada', color: 'bg-green-700', text: 'text-white' },
  [OcorrenciaViagem.FIM_DE_VIAGEM]: { label: 'Finalizada', color: 'bg-gray-700', text: 'text-white' },
  [OcorrenciaViagem.VIAGEM_CANCELADA]: { label: 'Cancelada', color: 'bg-red-700', text: 'text-white' },
  DESCONHECIDO: { label: 'Não Gerada', color: 'bg-gray-200', text: 'text-gray-500' },
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
