/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trip, TripStatus, Line, Agency, CTe, Occurrence, FiscalDocument, Driver, Vehicle, ControleCarga, Empresa } from '@app/types';
import { DEFAULT_COMPANIES } from '@app/constants';
import { container } from '../modules/domain/DI';
import { ConsultarViagensUseCase } from '../modules/domain/viagem/usecases/consultar-viagens.usecase';

export const logisticsService = {
  async getAgencies(): Promise<Agency[]> {
    return [
      {
        id: '64',
        nome: 'Chapeco',
        sigla: 'G'
      },
      {
        id: '4',
        nome: 'Porto Alegre',
        sigla: 'A'
      },
      {
        id: '180',
        nome: 'CD Chapeco',
        sigla: 'FT'
      },
      {
        id: '112',
        nome: 'Xaxim',
        sigla: 'DQ'
      }
    ]
  },

  async getLines(): Promise<Line[]> {
   return [
    {
      id: "1",
      codigo: 1,
      nome: 'Linha 1',
      origemAgenciaId: '64',
      destinoAgenciaId: '180',
      horarioSaida: '08:00',
      diasExecucao: ['Segunda', 'Quarta', 'Sexta']
    }
   ]
  },

  async getTrips(): Promise<Trip[]> {
    return []
  },

  async getDrivers(): Promise<Driver[]> {
    return []
  },

  async getVehicles(): Promise<Vehicle[]> {
    return []
  },

  async getAvailableCTes(): Promise<CTe[]> {
    return []
  },

  async getCompanies(): Promise<Empresa[]> {
    return DEFAULT_COMPANIES;
  },

  async getAvailableControles(empresaCodigo?: string): Promise<ControleCarga[]> {
    return []
  },

  async getControleByChave(chave: string): Promise<ControleCarga | null> {
    return null
  },

  async addSampleControleForRoute(origemSigla: string, destinoSigla: string): Promise<ControleCarga> {
    const autoKey = `CC-${Math.floor(1000 + Math.random() * 9000)}-${origemSigla}-${destinoSigla}`;
    const newControle: ControleCarga = {
      id: `cc-auto-${Date.now()}`,
      chave: autoKey,
      origemSigla,
      destinoSigla,
      ctes: [
        {
          id: `cte-auto-${Date.now()}-1`,
          chave: `352609${Math.floor(100000000000000000 + Math.random() * 900000000000000000)}570010000000001000000011`,
          origemSigla,
          destinoSigla,
          remetente: `Logística ${origemSigla} Express Ltda`,
          destinatario: `Comércio ${destinoSigla} Distribuidora`,
          valor: 3750.0,
        },
        {
          id: `cte-auto-${Date.now()}-2`,
          chave: `352609${Math.floor(100000000000000000 + Math.random() * 900000000000000000)}570010000000002000000022`,
          origemSigla,
          destinoSigla,
          remetente: `Indústria ${origemSigla} Central S.A.`,
          destinatario: `Rede Varejo ${destinoSigla} S.A.`,
          valor: 5200.0,
        },
      ],
    };
    try {
      return newControle;
    } catch (e) {
      console.warn("Could not persist generated controle:", e);
    }
    return newControle;
  },

  async createTrip(trip: Partial<Trip>): Promise<string> {
    const data: any = {
      ...trip,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Clean undefined fields to avoid Firestore error
    const cleanData: any = {};
    for (const key of Object.keys(data)) {
      if (data[key] !== undefined) {
        cleanData[key] = data[key];
      }
    }

    return "123";
  },

  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
    return null;
  },

  async deleteTrip(tripId: string): Promise<void> {
    return null
  },

  // API Methods
  async gerarCIOT(tripId: string): Promise<FiscalDocument> {
    return null;
  },

  async gerarMDFE(tripId: string): Promise<FiscalDocument> {
    return null;
  },

  async startViagem(tripId: string): Promise<void> {
    return null;
  },

  async resetTrip(tripId: string): Promise<Trip> {
    return null;
  },

  // Mock Scale Generation Logic
  async generateScales(): Promise<void> {
    const lines = await this.getLines();
    const trips = await this.getTrips();
    
    // Check if scales already generated for today
    const today = new Date().toISOString().split('T')[0];
    const scalesExist = trips.some(t => t.isPreGenerated && t.dataViagem.startsWith(today));
    
    if (scalesExist) return;

    for (const line of lines) {
      // Find agency siglas
      const agencies = await this.getAgencies();
      const origin = agencies.find(a => a.id === line.origemAgenciaId);
      const dest = agencies.find(a => a.id === line.destinoAgenciaId);

      if (origin && dest) {
        // Link sample cargo controls to the first 2 scale lines to simulate documents in Pendentes
        const isFirstOrSecond = line.id === lines[0]?.id || line.id === lines[1]?.id;
        const sampleControle: ControleCarga[] = isFirstOrSecond ? [{
          id: `cc-scale-${line.id}`,
          chave: `CC-${line.codigo || '1001'}-${origin.sigla}-${dest.sigla}`,
          origemSigla: origin.sigla,
          destinoSigla: dest.sigla,
          ctes: [
            {
              id: `cte-scale-${line.id}-1`,
              chave: `352609000000000000005700100000000${line.codigo || '1001'}00000001`,
              origemSigla: origin.sigla,
              destinoSigla: dest.sigla,
              remetente: `Indústria ${origin.sigla} Ltda`,
              destinatario: `Comércio ${dest.sigla} S.A.`,
              valor: 3450.00
            }
          ]
        }] : [];

        await this.createTrip({
          linhaId: line.id,
          nomeLinha: line.nome,
          agenciaOrigemSigla: origin.sigla,
          agenciaDestinoSigla: dest.sigla,
          status: 'PRE_VIAGEM',
          tipoViagem: 'Normal',
          tipoTrecho: 'Transferencia',
          horarioSaida: line.horarioSaida,
          dataViagem: new Date().toISOString(),
          isPreGenerated: true,
          motoristas: [],
          veiculos: [],
          ctes: sampleControle.length > 0 ? sampleControle[0].ctes : [],
          controlesCarga: sampleControle,
          ocorrencias: [{ tipo: 'PRE VIAGEM', dataGeracao: new Date().toISOString() }],
          documentosFiscais: [],
          codigo: 0,
        });
      }
    }
  },

  // Ensure example trips in Resolvidas (PRONTA), Iniciadas (INICIADA), and Finalizadas (FINALIZADA)
  // and guarantee that trips have documentos da viagem (controlesCarga + CT-es)
  async ensureSampleTrips(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const trips = await this.getTrips();
    const todayTrips = trips.filter(t => t.dataViagem && t.dataViagem.startsWith(today));
    
    const hasPronta = todayTrips.some(t => t.status === 'PRONTA');
    const hasIniciada = todayTrips.some(t => t.status === 'INICIADA');
    const hasFinalizada = todayTrips.some(t => t.status === 'FINALIZADA');

    const [drivers, vehicles, ctes] = await Promise.all([
      this.getDrivers(),
      this.getVehicles(),
      this.getAvailableCTes(),
    ]);

    const d1 = drivers[0] || { id: 'd1', codigo: 101, nome: 'João Silva', cpf: '123.456.789-00', isPrincipal: true };
    const d2 = drivers[1] || { id: 'd2', codigo: 102, nome: 'Maria Santos', cpf: '987.654.321-11', isPrincipal: true };
    const d3 = drivers[2] || { id: 'd3', codigo: 103, nome: 'Carlos Souza', cpf: '222.333.444-55', isPrincipal: true };
    const d4 = drivers[3] || { id: 'd4', codigo: 104, nome: 'Ricardo Oliveira', cpf: '456.789.012-33', isPrincipal: true };
    const d5 = drivers[4] || { id: 'd5', codigo: 105, nome: 'Fernanda Lima', cpf: '111.222.333-44', isPrincipal: true };
    const d6 = drivers[5] || { id: 'd6', codigo: 106, nome: 'Ana Costa', cpf: '333.444.555-66', isPrincipal: true };

    const v1 = vehicles[0] || { id: 'v1', placa: 'ABC-1234', modelo: 'Volvo FH 540', tipo: 'TRUCK' };
    const v2 = vehicles[1] || { id: 'v2', placa: 'XYZ-5678', modelo: 'Scania R450', tipo: 'TOCO' };
    const v3 = vehicles[2] || { id: 'v3', placa: 'LMN-9012', modelo: 'Mercedes-Benz Actros', tipo: 'V-TRUCK' };

    const c1: CTe = ctes[0] || { id: 'c1', chave: '35240500000000000000570010000000011000000011', origemSigla: 'SAO', destinoSigla: 'RIO', remetente: 'Logistica SP Ltda', destinatario: 'Commerce RJ S.A.', valor: 1500 };
    const c2: CTe = ctes[1] || { id: 'c2', chave: '35240500000000000000570010000000011000000022', origemSigla: 'SAO', destinoSigla: 'CWB', remetente: 'Móveis Sul S.A.', destinatario: 'Distribuidora PR', valor: 2350.5 };
    const c3: CTe = ctes[2] || { id: 'c3', chave: '35240500000000000000570010000000011000000033', origemSigla: 'RIO', destinoSigla: 'BHZ', remetente: 'Textil Rio', destinatario: 'Moda MG', valor: 890 };
    const c4: CTe = ctes[3] || { id: 'c4', chave: '35240500000000000000570010000000011000000044', origemSigla: 'SAO', destinoSigla: 'RIO', remetente: 'Eletronicos SP', destinatario: 'Varejo RJ', valor: 4200 };

    const cc1: ControleCarga = {
      id: 'cc-sao-rio-1',
      chave: 'CC-0001-SAO-RIO',
      origemSigla: 'SAO',
      destinoSigla: 'RIO',
      ctes: [c1, c4]
    };

    const cc2: ControleCarga = {
      id: 'cc-sao-cwb-1',
      chave: 'CC-0002-SAO-CWB',
      origemSigla: 'SAO',
      destinoSigla: 'CWB',
      ctes: [c2]
    };

    const cc3: ControleCarga = {
      id: 'cc-rio-bhz-1',
      chave: 'CC-0003-RIO-BHZ',
      origemSigla: 'RIO',
      destinoSigla: 'BHZ',
      ctes: [c3]
    };

    const cc4: ControleCarga = {
      id: 'cc-sao-bhz-1',
      chave: 'CC-0005-SAO-BHZ',
      origemSigla: 'SAO',
      destinoSigla: 'BHZ',
      ctes: [
        {
          id: 'cte-bhz-1',
          chave: '35260900000000000000570010000000011000000088',
          origemSigla: 'SAO',
          destinoSigla: 'BHZ',
          remetente: 'Cargas Expresso SP',
          destinatario: 'Minas Distribuição',
          valor: 2750.00
        }
      ]
    };

    const cc5: ControleCarga = {
      id: 'cc-cwb-poa-1',
      chave: 'CC-0004-CWB-POA',
      origemSigla: 'CWB',
      destinoSigla: 'POA',
      ctes: [
        {
          id: 'cte-poa-1',
          chave: '35260900000000000000570010000000011000000077',
          origemSigla: 'CWB',
          destinoSigla: 'POA',
          remetente: 'Alimentos Sul',
          destinatario: 'Supermercados RS',
          valor: 5400.00
        }
      ]
    };

    const nowIso = new Date().toISOString();

    // 1. RESOLVIDAS (PRONTA)
    if (!hasPronta) {
      // Exemplo 1: Escala Resolvida (Pronta para iniciar) com Controles e CTes
      await this.createTrip({
        codigo: 48210,
        nomeLinha: 'SAO x RIO - EXPRESSO',
        codigoLinha: 1001,
        agenciaOrigemSigla: 'SAO',
        agenciaDestinoSigla: 'RIO',
        status: 'PRONTA',
        tipoViagem: 'Normal',
        tipoTransferencia: 'Escala',
        horarioSaida: '14:00',
        dataViagem: `${today}T14:00:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: false,
        motoristas: [{ ...d1, isPrincipal: true }],
        veiculos: [v1],
        ctes: cc1.ctes,
        controlesCarga: [cc1],
        ocorrencias: [
          { tipo: 'CRIADO', dataGeracao: nowIso },
          { tipo: 'DOCUMENTOS GERADOS', dataGeracao: nowIso }
        ],
        documentosFiscais: [
          {
            tipo: 'CIOT',
            status: 'AUTORIZADO',
            numero: '918237192837',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'CIOT autorizado pelo órgão regulador.'
          },
          {
            tipo: 'MDF-E',
            status: 'PENDENTE',
            numero: '000182472',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'MDF-e aguardando retorno SEFAZ.'
          }
        ]
      });

      // Exemplo 2: Viagem Extra Resolvida com Extra Tipo: "Demanda Excedente" com Controles e CTes
      await this.createTrip({
        codigo: 49102,
        nomeLinha: 'SAO x BHZ - EXTRA',
        agenciaOrigemSigla: 'SAO',
        agenciaDestinoSigla: 'BHZ',
        status: 'PRONTA',
        tipoViagem: 'Extra',
        tipoTransferencia: 'Extra',
        extraTipo: 'Demanda Excedente',
        horarioSaida: '16:30',
        dataViagem: `${today}T16:30:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: false,
        motoristas: [{ ...d3, isPrincipal: true }],
        veiculos: [v3],
        ctes: cc4.ctes,
        controlesCarga: [cc4],
        ocorrencias: [
          { tipo: 'VIAGEM EXTRA CRIADA', dataGeracao: nowIso },
          { tipo: 'DOCUMENTOS GERADOS', dataGeracao: nowIso }
        ],
        documentosFiscais: [
          {
            tipo: 'CIOT',
            status: 'REJEITADO',
            numero: '827103948192',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'CIOT rejeitado por divergência cadastral.',
            motivosRejeicao: ['Divergência nas informações fiscais informadas']
          },
          {
            tipo: 'MDF-E',
            status: 'AUTORIZADO',
            numero: '000291039',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'MDF-e autorizado via SEFAZ.'
          }
        ]
      });
    }

    // 2. INICIADAS (INICIADA)
    if (!hasIniciada) {
      // Exemplo 3: Escala Iniciada com Controles e CTes
      await this.createTrip({
        codigo: 51204,
        nomeLinha: 'SAO x CWB - NOTURNO',
        codigoLinha: 1002,
        agenciaOrigemSigla: 'SAO',
        agenciaDestinoSigla: 'CWB',
        status: 'INICIADA',
        tipoViagem: 'Normal',
        tipoTransferencia: 'Escala',
        horarioSaida: '08:30',
        dataViagem: `${today}T08:30:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: false,
        motoristas: [{ ...d2, isPrincipal: true }],
        veiculos: [v2],
        ctes: cc2.ctes,
        controlesCarga: [cc2],
        ocorrencias: [
          { tipo: 'CRIADO', dataGeracao: nowIso },
          { tipo: 'DOCUMENTOS GERADOS', dataGeracao: nowIso },
          { tipo: 'VIAGEM INICIADA', dataGeracao: nowIso }
        ],
        documentosFiscais: [
          {
            tipo: 'CIOT',
            status: 'AUTORIZADO',
            numero: '718293041928',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'CIOT autorizado pelo órgão regulador.'
          },
          {
            tipo: 'MDF-E',
            status: 'PENDENTE',
            numero: '000381920',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'MDF-e aguardando retorno.'
          }
        ]
      });

      // Exemplo 4: Viagem Extra Iniciada com Controles e CTes
      await this.createTrip({
        codigo: 52319,
        nomeLinha: 'RIO x BHZ - EXTRA',
        agenciaOrigemSigla: 'RIO',
        agenciaDestinoSigla: 'BHZ',
        status: 'INICIADA',
        tipoViagem: 'Extra',
        tipoTransferencia: 'Extra',
        extraTipo: 'Devolução de Veículo',
        horarioSaida: '10:00',
        dataViagem: `${today}T10:00:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: false,
        motoristas: [{ ...d4, isPrincipal: true }],
        veiculos: [v1],
        ctes: cc3.ctes,
        controlesCarga: [cc3],
        ocorrencias: [
          { tipo: 'VIAGEM EXTRA SOLICITADA', dataGeracao: nowIso },
          { tipo: 'DOCUMENTOS GERADOS', dataGeracao: nowIso },
          { tipo: 'VIAGEM INICIADA', dataGeracao: nowIso }
        ],
        documentosFiscais: [
          {
            tipo: 'CIOT',
            status: 'REJEITADO',
            numero: '619283019283',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'CIOT rejeitado.',
            motivosRejeicao: ['Dados do contratado incoerentes']
          },
          {
            tipo: 'MDF-E',
            status: 'AUTORIZADO',
            numero: '000491823',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'MDF-e autorizado via SEFAZ.'
          }
        ]
      });
    }

    // 3. FINALIZADAS (FINALIZADA)
    if (!hasFinalizada) {
      // Exemplo 5: Escala Finalizada com Controles e CTes
      await this.createTrip({
        codigo: 39182,
        nomeLinha: 'CWB x POA - SUL',
        agenciaOrigemSigla: 'CWB',
        agenciaDestinoSigla: 'POA',
        status: 'FINALIZADA',
        tipoViagem: 'Normal',
        tipoTransferencia: 'Escala',
        horarioSaida: '05:00',
        dataViagem: `${today}T05:00:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: false,
        motoristas: [{ ...d5, isPrincipal: true }],
        veiculos: [v2],
        ctes: cc5.ctes,
        controlesCarga: [cc5],
        ocorrencias: [
          { tipo: 'CRIADO', dataGeracao: nowIso },
          { tipo: 'VIAGEM INICIADA', dataGeracao: nowIso },
          { tipo: 'VIAGEM FINALIZADA', dataGeracao: nowIso }
        ],
        documentosFiscais: [
          {
            tipo: 'CIOT',
            status: 'ENCERRADO',
            numero: '519283019284',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'CIOT encerrado com sucesso.'
          },
          {
            tipo: 'MDF-E',
            status: 'ENCERRADO',
            numero: '000581920',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'MDF-e encerrado na SEFAZ.'
          }
        ]
      });

      // Exemplo 6: Viagem Extra Finalizada com Controles e CTes
      await this.createTrip({
        codigo: 38901,
        nomeLinha: 'SAO x RIO - EXTRA',
        agenciaOrigemSigla: 'SAO',
        agenciaDestinoSigla: 'RIO',
        status: 'FINALIZADA',
        tipoViagem: 'Extra',
        tipoTransferencia: 'Extra',
        extraTipo: 'Outros',
        horarioSaida: '06:15',
        dataViagem: `${today}T06:15:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: false,
        motoristas: [{ ...d6, isPrincipal: true }],
        veiculos: [v3],
        ctes: cc1.ctes,
        controlesCarga: [cc1],
        ocorrencias: [
          { tipo: 'VIAGEM EXTRA SOLICITADA', dataGeracao: nowIso },
          { tipo: 'VIAGEM INICIADA', dataGeracao: nowIso },
          { tipo: 'VIAGEM FINALIZADA', dataGeracao: nowIso }
        ],
        documentosFiscais: [
          {
            tipo: 'CIOT',
            status: 'ENCERRADO',
            numero: '419283019285',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'CIOT encerrado com sucesso.'
          },
          {
            tipo: 'MDF-E',
            status: 'ENCERRADO',
            numero: '000681921',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'MDF-e encerrado na SEFAZ.'
          }
        ]
      });
    }

    // Assign empresaCodigo: 'A' to any existing trips that don't have empresaCodigo
    for (const t of trips) {
      if (!t.empresaCodigo) {
        await this.updateTrip(t.id, {
          empresaCodigo: 'A',
          empresaNome: 'Porto Alegre'
        });
      }
    }

    // Also verify and populate existing trips that have empty controlesCarga
    for (const t of todayTrips) {
      if (!t.controlesCarga || t.controlesCarga.length === 0) {
        let assignedCC: ControleCarga[] = [];
        if (t.agenciaDestinoSigla === 'RIO') assignedCC = [cc1];
        else if (t.agenciaDestinoSigla === 'CWB') assignedCC = [cc2];
        else if (t.agenciaDestinoSigla === 'BHZ') assignedCC = [cc3];
        else if (t.agenciaDestinoSigla === 'POA') assignedCC = [cc5];
        else assignedCC = [cc1];

        // For trips in PRONTA, INICIADA, FINALIZADA, ensure they have documentos
        if (['PRONTA', 'INICIADA', 'FINALIZADA'].includes(t.status)) {
          await this.updateTrip(t.id, {
            controlesCarga: assignedCC,
            ctes: assignedCC[0]?.ctes || []
          });
        }
      }
    }

    // Ensure at least 2 trips in PRE_VIAGEM (Pendentes) for today have controlesCarga
    const pendingToday = todayTrips.filter(t => t.status === 'PRE_VIAGEM');
    const pendingWithDocs = pendingToday.filter(t => t.controlesCarga && t.controlesCarga.length > 0);
    if (pendingWithDocs.length < 2 && pendingToday.length > 0) {
      const candidates = pendingToday.slice(0, 2);
      for (const cand of candidates) {
        const assignedCC = cand.agenciaDestinoSigla === 'CWB' ? [cc2] : [cc1];
        await this.updateTrip(cand.id, {
          controlesCarga: assignedCC,
          ctes: assignedCC[0]?.ctes || []
        });
      }
    }

    // --- Ensure Trips and Documents for G - Chapeco ---
    const hasCompanyG = trips.some(t => t.empresaCodigo === 'G' && t.dataViagem && t.dataViagem.startsWith(today));
    if (!hasCompanyG) {
      const ccG: ControleCarga = {
        id: 'cc-g-xap-cwb-1',
        chave: 'CC-7001-XAP-CWB',
        origemSigla: 'XAP',
        destinoSigla: 'CWB',
        empresaCodigo: 'G',
        empresaNome: 'Chapeco',
        ctes: [
          {
            id: 'cte-g-1',
            chave: '42260900000000000000570010000000070010000011',
            origemSigla: 'XAP',
            destinoSigla: 'CWB',
            remetente: 'Agroindustrial Oeste Chapecó',
            destinatario: 'Distribuidora Paranaense CWB',
            valor: 6800.00
          }
        ]
      };

      await this.createTrip({
        codigo: 49201,
        nomeLinha: 'XAP x CWB - OESTE',
        codigoLinha: 2001,
        agenciaOrigemSigla: 'XAP',
        agenciaDestinoSigla: 'CWB',
        empresaCodigo: 'G',
        empresaNome: 'Chapeco',
        status: 'PRONTA',
        tipoViagem: 'Normal',
        tipoTransferencia: 'Escala',
        horarioSaida: '15:00',
        dataViagem: `${today}T15:00:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: false,
        motoristas: [{ ...d3, isPrincipal: true }],
        veiculos: [v1],
        ctes: ccG.ctes,
        controlesCarga: [ccG],
        ocorrencias: [{ tipo: 'CRIADO', dataGeracao: nowIso }, { tipo: 'DOCUMENTOS GERADOS', dataGeracao: nowIso }],
        documentosFiscais: [
          {
            tipo: 'MDF-E',
            status: 'AUTORIZADO',
            numero: '000720182',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'MDF-e autorizado SEFAZ/SC.'
          },
          {
            tipo: 'CIOT',
            status: 'AUTORIZADO',
            numero: '718293019280',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'CIOT autorizado ANTT.'
          }
        ]
      });

      await this.createTrip({
        codigo: 49202,
        nomeLinha: 'XAP x POA - SUL',
        codigoLinha: 2002,
        agenciaOrigemSigla: 'XAP',
        agenciaDestinoSigla: 'POA',
        empresaCodigo: 'G',
        empresaNome: 'Chapeco',
        status: 'PRE_VIAGEM',
        tipoViagem: 'Normal',
        tipoTransferencia: 'Escala',
        horarioSaida: '21:30',
        dataViagem: `${today}T21:30:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: true,
        motoristas: [],
        veiculos: [],
        ctes: ccG.ctes,
        controlesCarga: [ccG],
        ocorrencias: [{ tipo: 'PRE VIAGEM', dataGeracao: nowIso }],
        documentosFiscais: []
      });

      await this.createTrip({
        codigo: 52410,
        nomeLinha: 'XAP x SAO - EXTRA',
        agenciaOrigemSigla: 'XAP',
        agenciaDestinoSigla: 'SAO',
        empresaCodigo: 'G',
        empresaNome: 'Chapeco',
        status: 'INICIADA',
        tipoViagem: 'Extra',
        tipoTransferencia: 'Extra',
        extraTipo: 'Demanda Excedente',
        horarioSaida: '09:00',
        dataViagem: `${today}T09:00:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: false,
        motoristas: [{ ...d4, isPrincipal: true }],
        veiculos: [v2],
        ctes: ccG.ctes,
        controlesCarga: [ccG],
        ocorrencias: [{ tipo: 'VIAGEM INICIADA', dataGeracao: nowIso }],
        documentosFiscais: [
          {
            tipo: 'MDF-E',
            status: 'AUTORIZADO',
            numero: '000720199',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso
          }
        ]
      });
    }

    // --- Ensure Trips and Documents for FT - CD Chapeco ---
    const hasCompanyFT = trips.some(t => t.empresaCodigo === 'FT' && t.dataViagem && t.dataViagem.startsWith(today));
    if (!hasCompanyFT) {
      const ccFT: ControleCarga = {
        id: 'cc-ft-xap-pas-1',
        chave: 'CC-8001-CD-PAS',
        origemSigla: 'XAP',
        destinoSigla: 'PAS',
        empresaCodigo: 'FT',
        empresaNome: 'CD Chapeco',
        ctes: [
          {
            id: 'cte-ft-1',
            chave: '42260900000000000000570010000000080010000011',
            origemSigla: 'XAP',
            destinoSigla: 'PAS',
            remetente: 'Centro de Distribuição Chapecó FT',
            destinatario: 'Filial Logística Passo Fundo',
            valor: 9400.00
          }
        ]
      };

      await this.createTrip({
        codigo: 49301,
        nomeLinha: 'CD-XAP x PAS - TRANSFERÊNCIA',
        codigoLinha: 3001,
        agenciaOrigemSigla: 'XAP',
        agenciaDestinoSigla: 'PAS',
        empresaCodigo: 'FT',
        empresaNome: 'CD Chapeco',
        status: 'PRONTA',
        tipoViagem: 'Normal',
        tipoTransferencia: 'Escala',
        horarioSaida: '16:00',
        dataViagem: `${today}T16:00:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: false,
        motoristas: [{ ...d5, isPrincipal: true }],
        veiculos: [v3],
        ctes: ccFT.ctes,
        controlesCarga: [ccFT],
        ocorrencias: [{ tipo: 'CRIADO', dataGeracao: nowIso }, { tipo: 'DOCUMENTOS GERADOS', dataGeracao: nowIso }],
        documentosFiscais: [
          {
            tipo: 'MDF-E',
            status: 'AUTORIZADO',
            numero: '000830111',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'MDF-e autorizado CD Chapecó.'
          },
          {
            tipo: 'CIOT',
            status: 'AUTORIZADO',
            numero: '819283011928',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso,
            observacao: 'CIOT autorizado CD Chapecó.'
          }
        ]
      });

      await this.createTrip({
        codigo: 49302,
        nomeLinha: 'CD-XAP x CAS - OESTE',
        codigoLinha: 3002,
        agenciaOrigemSigla: 'XAP',
        agenciaDestinoSigla: 'CAS',
        empresaCodigo: 'FT',
        empresaNome: 'CD Chapeco',
        status: 'PRE_VIAGEM',
        tipoViagem: 'Normal',
        tipoTransferencia: 'Escala',
        horarioSaida: '22:00',
        dataViagem: `${today}T22:00:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: true,
        motoristas: [],
        veiculos: [],
        ctes: ccFT.ctes,
        controlesCarga: [ccFT],
        ocorrencias: [{ tipo: 'PRE VIAGEM', dataGeracao: nowIso }],
        documentosFiscais: []
      });

      await this.createTrip({
        codigo: 52510,
        nomeLinha: 'CD-XAP x CWB - LINHA CD',
        agenciaOrigemSigla: 'XAP',
        agenciaDestinoSigla: 'CWB',
        empresaCodigo: 'FT',
        empresaNome: 'CD Chapeco',
        status: 'INICIADA',
        tipoViagem: 'Normal',
        tipoTransferencia: 'Escala',
        horarioSaida: '07:30',
        dataViagem: `${today}T07:30:00.000Z`,
        tipoTrecho: 'Transferencia',
        isPreGenerated: false,
        motoristas: [{ ...d6, isPrincipal: true }],
        veiculos: [v1],
        ctes: ccFT.ctes,
        controlesCarga: [ccFT],
        ocorrencias: [{ tipo: 'VIAGEM INICIADA', dataGeracao: nowIso }],
        documentosFiscais: [
          {
            tipo: 'MDF-E',
            status: 'AUTORIZADO',
            numero: '000830222',
            dataGeracao: nowIso,
            dataAtualizacao: nowIso
          }
        ]
      });
    }
  }
};
