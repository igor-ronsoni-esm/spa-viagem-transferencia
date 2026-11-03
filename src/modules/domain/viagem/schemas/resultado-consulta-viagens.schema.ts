import { z } from "zod";
import { LinhaTransferenciaSchema } from "../../linhas-transferencia/schemas/linha-transferencia.schema";
import { EmpresaSchema } from "../../empresa/schemas/empresa.schema";
import { TipoViagemSchema } from "./dados-viagem/tipo-viagem.schema";
import { EscalaSchema } from "./dados-viagem/escala-viagem.schema";
import { TipoTransferenciaSchemaEnum } from "./dados-viagem/tipo-transferencia.schema";
import { OcorrenciaSchemaEnum } from "./dados-viagem/ocorrencia/ocorrencias.schema";

const EmpresaEntradaSchema = z.object({
  codigo: z.number(),
  sigla: z.string(),
  nome: z.string()
}).transform(({ nome, ...resto }) => ({
  ...resto,
  descricao: nome,
}))
.pipe(EmpresaSchema);


const ExecucaoSchema = z.object({
  codigo: z.number()
});

const ViagemControleSchema = z.object({
  codigo: z.number().nullable(),
  tipoTransferencia: TipoTransferenciaSchemaEnum,
  tipo: TipoViagemSchema,
  status: z.string().nullable(),
  chaveStatus: OcorrenciaSchemaEnum.nullable().catch("DESCONHECIDO").default("DESCONHECIDO"),
  execucao: ExecucaoSchema,
  dataSaida: z.string(),
  dataChegada: z.string()
});

const PaginacaoSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPaginas: z.number()
});

const ViagemResumoSchema = z.object({
  codigo: z.number(),
  linha: LinhaTransferenciaSchema,
  viagem: ViagemControleSchema,
  origem: EmpresaEntradaSchema,
  destino: EmpresaEntradaSchema,
  quantidadeDocumentosEmViagem: z.number(),
  quantidadeDocsOrigemOuDestino: z.number()
})

export const ResultadoConsultaViagensSchema = z.object({
  escala: EscalaSchema,
  paginacao: PaginacaoSchema,
  viagens: z.array(ViagemResumoSchema)
});

export type ResultadoConsultaViagensOutput = z.infer<typeof ResultadoConsultaViagensSchema>;
export type ViagemResumoOutput = z.infer<typeof ViagemResumoSchema>;
