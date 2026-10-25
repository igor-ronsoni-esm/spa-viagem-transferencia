import { z } from "zod";
import { OcorrenciaSchema, TipoSchema, TipoTransferenciaSchema } from "./viagem.schema";

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



const execucao = z.object({
  codigo: z.number()
});

const viagemConfiguracao = z.object({
  codigo: z.number().nullable(),
  tipoTransferencia: TipoTransferenciaSchema,
  tipo: TipoSchema,
  status: z.string().nullable(),
  chaveStatus: OcorrenciaSchema.nullable().catch("DESCONHECIDO").default("DESCONHECIDO"),
  execucao: execucao,
  dataSaida: z.string(),
  dataChegada: z.string()
});

const EscalaSchema = z.object({
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
  escala: EscalaSchema,
  paginacao: paginacao,
  viagens: z.array(ViagemSchema)
});

export type ResultadoConsultaViagensOutput = z.infer<typeof ResultadoConsultaViagensSchema>;
export type ViagemListagemOutput = z.infer<typeof ViagemSchema>;
export type EscalaOutput = z.infer<typeof EscalaSchema>;