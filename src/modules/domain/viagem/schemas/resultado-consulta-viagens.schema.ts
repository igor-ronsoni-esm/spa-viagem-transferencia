import { z } from "zod";

const empresa = z.object({
  codigo: z.number(),
  sigla: z.string(),
  nome: z.string()
});

const linha = z.object({
  codigo: z.number(),
  id: z.number(),
  descricao: z.string()
});

const OcorrenciaSchema = z.enum([
  "AGUARDANDO_AUTORIZACAO",
  "COMPARTILHAMENTO_CANCELADO",
  "DISPONIBILIZACAO_VIAGEM_CANCELADA",
  "FIM_DE_VIAGEM",
  "INICIO_VIAGEM_CANCELADA",
  "LIBERADO_CONTINGENCIA",
  "PRE_VIAGEM",
  "RASTREAMENTO_AGUARDANDO_AGENDAMENTO",
  "RASTREAMENTO_AGUARDANDO_CANCELAMENTO",
  "RASTREAMENTO_AGUARDANDO_FIM",
  "RASTREAMENTO_AGUARDANDO_INICIO",
  "RASTREAMENTO_ERRO_AGENDAMENTO",
  "RASTREAMENTO_ERRO_CANCELAMENTO",
  "RASTREAMENTO_ERRO_FIM",
  "RASTREAMENTO_ERRO_INICIO",
  "RASTREAMENTO_VIAGEM_AGENDADA",
  "RASTREAMENTO_VIAGEM_CANCELADA",
  "RASTREAMENTO_VIAGEM_FINALIZADA",
  "RASTREAMENTO_VIAGEM_INICIADA",
  "REJEICAO_AUTORIZACAO",
  "TROCA_MOTORISTA_FINALIZADA",
  "TROCA_MOTORISTA_INICIADA",
  "VIAGEM_CANCELADA",
  "VIAGEM_COMPARTILHADA",
  "VIAGEM_DISPONIBILIZADA",
  "VIAGEM_INICIADA"
]);

const TipoTransferenciaSchema = z.enum(["ESCALA", "EXTRA", "ROTA_ALTERNATIVA"]);
const TipoSchema = z.enum(["TRANSFERENCIA", "VAZIO"]);
const execucao = z.object({
  codigo: z.number()
});

const viagemConfiguracao = z.object({
  codigo: z.number().nullable(),
  tipoTransferencia: TipoTransferenciaSchema,
  tipo: TipoSchema,
  status: z.string().nullable(),
  chaveStatus: OcorrenciaSchema.nullable(),
  execucao: execucao,
  dataSaida: z.string(),
  dataChegada: z.string()
});

const escala = z.object({
  dia: z.number(),
  dataInicio: z.string(),
  dataFim: z.string()
});

const paginacao = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPaginas: z.number()
});

const ViagemSchema = z.object({
  codigo: z.number(),
  linha: linha,
  viagem: viagemConfiguracao,
  origem: empresa,
  destino: empresa,
  quantidadeDocumentosEmViagem: z.number(),
  quantidadeDocsOrigemOuDestino: z.number()
})

export const ResultadoConsultaViagensSchema = z.object({
  escala: escala,
  paginacao: paginacao,
  viagens: z.array(ViagemSchema)
});

export type ResultadoConsultaViagensOutput = z.infer<typeof ResultadoConsultaViagensSchema>;
export type ViagemOutput = z.infer<typeof ViagemSchema>;

export const OcorrenciaViagem = OcorrenciaSchema.enum;
export const TipoTransferencia = TipoTransferenciaSchema.enum;
export type OcorrenciaViagemOutput = z.infer<typeof OcorrenciaSchema>;
export type TipoTransferenciaOutput = z.infer<typeof TipoTransferenciaSchema>;