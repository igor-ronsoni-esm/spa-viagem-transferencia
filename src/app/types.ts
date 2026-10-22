/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ViagemOutput } from "../modules/domain/viagem/schemas/resultado-consulta-viagens.schema";

export type TripStatus = 'PRE_VIAGEM' | 'PENDENTE' | 'REJEITADA' | 'PRONTA' | 'INICIADA' | 'FINALIZADA' | 'CANCELADA';
export type TripType = 'Normal' | 'Extra';
export type SectionType = 'Transferencia' | 'Vazio';

export type ViagensResult = {
  viagens: ViagemOutput[];
}

export interface Empresa {
  id: string;
  codigo: string;
  nome: string;
  label: string;
  cidade?: string;
  uf?: string;
}

export interface Agency {
  id: string;
  nome: string;
  sigla: string;
}

export interface Line {
  id: string;
  codigo?: number;
  nome: string;
  origemAgenciaId: string;
  destinoAgenciaId: string;
  horarioSaida: string;
  diasExecucao: string[];
}

export interface CTe {
  id: string;
  chave: string;
  origemSigla: string;
  destinoSigla: string;
  remetente: string;
  destinatario: string;
  valor: number;
}

export interface ControleCarga {
  id: string;
  chave: string;
  origemSigla: string;
  destinoSigla: string;
  empresaCodigo?: string;
  empresaNome?: string;
  ctes: CTe[];
}

export interface Occurrence {
  tipo: string;
  dataGeracao: string;
}

export interface FiscalDocument {
  tipo: 'CIOT' | 'MDF-E';
  status: 'AGUARDANDO AUTORIZACAO' | 'AGUARDANDO RETORNO' | 'CANCELADO' | 'REJEITADO' | 'AUTORIZADO' | 'ENCERRADO' | 'PENDENTE';
  numero?: string;
  dataGeracao: string;
  dataAtualizacao: string;
  dataRetorno?: string;
  observacao?: string;
  motivoRejeicao?: string;
  motivosRejeicao?: string[];
}

export interface Driver {
  id: string;
  codigo: number;
  nome: string;
  cpf: string;
  isPrincipal?: boolean;
}

export interface Vehicle {
  id: string;
  placa: string;
  modelo: string;
  tipo?: string;
  codigo?: number;
  fotoUrl?: string;
}

export interface Trip {
  id: string;
  codigo?: number;
  linhaId?: string;
  nomeLinha: string;
  agenciaOrigemSigla: string;
  agenciaDestinoSigla: string;
  status: TripStatus;
  tipoViagem: TripType;
  tipoTrecho: SectionType;
  horarioSaida: string;
  dataViagem: string;
  motoristas: Driver[];
  veiculos: Vehicle[];
  ctes: CTe[];
  controlesCarga: ControleCarga[];
  ocorrencias: Occurrence[];
  documentosFiscais: FiscalDocument[];
  isPreGenerated: boolean;
  codigoLinha?: number;
  descricaoLinha?: string;
  codigoTrecho?: string;
  origemTrecho?: string;
  destinoTrecho?: string;
  empresaCodigo?: string;
  empresaNome?: string;
  chaveRastreio?: string;
  codigoRastreio?: string;
  codigoRotaRastreio?: string;
  descricaoRotaRastreio?: string;
  previsaoSaida?: string;
  tipoTransferencia?: 'Escala' | 'Extra';
  extraTipo?: string;
  lacres?: string[];
  createdAt: string;
  updatedAt: string;
}
