import { z } from "zod";
import { EmpresaSchema } from "../../empresa/schemas/empresa.schema";

export const TipoTransferenciaSchema = z.enum([
  "ESCALA",
  "EXTRA",
  "ROTA_ALTERNATIVA",
]);

export const TipoSchema = z.enum(["TRANSFERENCIA", "VAZIO"]);

const TipoInclusaoSchema = z.enum(["MANUAL_GESTAO", "MANUAL_VIAGEM", "AUTOMATICO"]);

export const OcorrenciaSchema = z.enum([
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
  "VIAGEM_INICIADA",
  "PROCESSAMENTO_DOCUMENTOS_TERCEIRO",
  "DESCONHECIDO"
]);

const VeiculoTipoSchemaEnum = z.enum([
  "PROPRIO",
  "AGREGADO",
  "DIARISTA",
  "TERCEIRO"
]);

const TipoPesoM3Schema = z.enum(["PESO", "M3"]);

const VeiculoTipoSchema = z.enum(["P", "A", "D", "T"]).transform((tipo) => {
  const tipos = {
    P: "PROPRIO",
    A: "AGREGADO",
    D: "DIARISTA",
    T: "TERCEIRO",
    DESCONHECIDO: "DESCONHECIDO",
  } as const;

  return tipos[tipo] ?? "DESCONHECIDO";
});

const MotoristaTipoSchemaEnum = z.enum(["TITULAR", "CARONA", "RESERVA"]);

const MotoristaTipoSchema = z.enum(["T", "C", "R"]).transform((tipo) => {
  const tipos = {
    T: "TITULAR",
    C: "CARONA",
    R: "RESERVA",
    DESCONHECIDO: "DESCONHECIDO",
  } as const;

  return tipos[tipo] ?? "DESCONHECIDO";
});

const TipoViagemSchema = z
  .enum(["T", "V"])
  .transform((tipo) => {
    const tipos = {
      T: "TRANSFERENCIA",
      V: "VAZIO",
    } as const;

    return tipos[tipo];
  })
  .pipe(TipoSchema);

const TipoTransferenciaViagemSchema = z
  .enum(["E", "X", "A"])
  .transform((tipo) => {
    const tipos = {
      E: "ESCALA",
      X: "EXTRA",
      A: "ROTA_ALTERNATIVA",
    } as const;

    return tipos[tipo];
  })
  .pipe(TipoTransferenciaSchema);

const SituacaoDescarregamentoSchemaEnum = z.enum(["S", "N"])

const TipoPesoM3DocumentoSchemaEnum = z.enum(["P", "M"]).transform((tipo) => {
  const tipos = {
    P: "PESO",
    M: "M3",
  } as const;

  return tipos[tipo] ?? "PESO";
}).pipe(TipoPesoM3Schema);

const LinhaLancamentoSchema = z.object({
  codigo: z.number(),
  viagemExecucao: z.object({
    codigo: z.number(),
    linha: z.object({
      codigo: z.number(),
    }),
  }),
});

const TrechoSchema = z.object({
  codigo: z.number(),
  origem: EmpresaSchema,
  destino: EmpresaSchema,
});

const LinhaSchema = z.object({
  codigo: z.number(),
  id: z.number(),
  descricao: z.string(),
  trecho: TrechoSchema,
});

const RastreioSchema = z.object({
  codigo: z.number(),
  rota: z.number(),
  descricao: z.string(),
  rastreioViagem: z.string().nullable(),
});

const VeiculoSchema = z.object({
  codigo: z.number(),
  placa: z.string(),
  descricao: z.string(),
  tipo: VeiculoTipoSchema,
});

const VeiculoViagemSchema = z.object({
  codigo: z.number(),
  principal: z.boolean(),
  veiculo: VeiculoSchema,
});

const MotoristaViagemSchema = z.object({
  codigo: z.number(),
  tipo: MotoristaTipoSchema,
  funcionario: z.object({
    codigo: z.number(),
    nome: z.string(),
  }),
});

const LacreSchema = z.object({
  ordem: z.number(),
  numero: z.string(),
});

const ConhecimentoSchema = z.object({
  codigo: z.number(),
  numero: z.string(),
  quantidade: z.number(),
  peso: z.number(),
  m3: z.number(),
  tipoPesoM3: TipoPesoM3DocumentoSchemaEnum,
  valor: z.number(),
  remetente: EmpresaSchema,
  destinatario: EmpresaSchema,
  dataEmissao: z.string().default(new Date().toISOString()), // Alterar,
})

const NotaFiscalSchema = z.object({
  codigo: z.number(),
  numero: z.string(),
  quantidade: z.number(),
  peso: z.number(),
  m3: z.number(),
  tipoPesoM3: TipoPesoM3DocumentoSchemaEnum,
  valor: z.number(),
})

const ControleSchema = z.object({
  marcado: z.boolean().nullable().default(false),
  codigo: z.number(),
  chave: z.string(),
  origem: EmpresaSchema,
  destino: EmpresaSchema,
  tipoInclusao: TipoInclusaoSchema.nullable(),
  ctes: z.array(ConhecimentoSchema),
  nfes: z.array(NotaFiscalSchema).optional()
});

const DescarregamentoControleSchema = z.object({
  destino: z.string(),
  controles: z.array(ControleSchema)
});

const DocumentoSchema = z.object({
  descarregamento: DescarregamentoControleSchema,
});

const TrocaMotoristaSchema = z.object({
  codigo: z.number(),
  empresa: EmpresaSchema,
  pontoControle: z.object({
    descricao: z.string(),
  })
})

const DescarregamentoSchema = z.object({
  codigo: z.number(),
  situacao: z.string(),
  empresa: EmpresaSchema,
  percurso: z.string(),
});

export const ExtraTipoSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);

const OcorrenciaViagemSchema = z.object({
  codigo: z.number(),
  chave: OcorrenciaSchema,
  vigente: z.boolean(),
  dataLancamento: z.string(),
});

const TipoDocumentoFiscalSchemaEnum = z.enum([
  "CIOT",
  "VPO",
  "MDFE"
])

const StatusDocumentoFiscalSchemaEnum = z.enum([
  "AGUARDANDO_AUTORIZACAO",
  "AGUARDANDO_CANCELAMENTO",
  "AGUARDANDO_ENCERRAMENTO",
  "AUTORIZADO",
  "CANCELADO",
  "ENCERRADO",
  "REJEITADO",
  "PENDENTE",
  "COMPRADO",
  "NAO_ELEGIVEL",
  "DESCONHECIDO",
  "ERRO"
])

const DocumentoFiscalSchema = z.object({
  codigo: z.number(),
  tipo: TipoDocumentoFiscalSchemaEnum,
  numero: z.string().nullable(),
  dataGeracao: z.string(),
  dataRetorno: z.string().nullable(),
  status: StatusDocumentoFiscalSchemaEnum.nullable().default("DESCONHECIDO"),
  motivoRejeicao: z.string().nullable()
});

export const ViagemSchema = z.object({
  codigo: z.number().nullable(),
  codigoAgencia: z.number(),
  status: OcorrenciaSchema.nullable(),
  dataViagem: z.string(),
  tipoViagem: TipoViagemSchema,
  tipoTransferencia: TipoTransferenciaViagemSchema,
  extraTipo: ExtraTipoSchema.nullable(),
  linhaLancamento: LinhaLancamentoSchema,
  linha: LinhaSchema,
  previsaoSaida: z.string(),
  rastreio: RastreioSchema,
  veiculos: z.array(VeiculoViagemSchema),
  motoristas: z.array(MotoristaViagemSchema),
  trocasMotorista: z.array(TrocaMotoristaSchema),
  lacres: z.array(LacreSchema),
  descarregamentos: z.array(DescarregamentoSchema),
  documentos: z.array(DocumentoSchema),
  ocorrencias: z.array(OcorrenciaViagemSchema),
  documentosFiscais: z.array(DocumentoFiscalSchema),
});

export const OcorrenciaViagemEnum = OcorrenciaSchema.enum;;
export const TipoTransferenciaEnum = TipoTransferenciaSchema.enum;
export const TipoViagemEnum = TipoSchema.enum;
export const MotoristaTipoEnum = MotoristaTipoSchemaEnum.enum;
export const StatusDocumentoFiscalEnum = StatusDocumentoFiscalSchemaEnum.enum;
export const TipoDocumentoFiscalEnum = TipoDocumentoFiscalSchemaEnum.enum;
export const SituacaoDescarregamentoEnum = SituacaoDescarregamentoSchemaEnum.enum;
export const TipoPesoM3Enum = TipoPesoM3Schema.enum;
export const TipoInclusaoEnum = TipoInclusaoSchema.enum;
export const TipoVeiculoEnum = VeiculoTipoSchemaEnum.enum;

export type OcorrenciaViagemEnumOutput = z.infer<typeof OcorrenciaSchema>;
export type SituacaoDescarregamentoEnumOutput = z.infer<typeof SituacaoDescarregamentoSchemaEnum>;

export type TipoTransferenciaOutput = z.infer<typeof TipoTransferenciaSchema>;
export type TipoViagemOutput = z.infer<typeof TipoSchema>;
export type ViagemOutput = z.infer<typeof ViagemSchema>;
export type OcorrenciaViagemOutput = z.infer<typeof OcorrenciaViagemSchema>;
export type DocumentoFiscalOutput = z.infer<typeof DocumentoFiscalSchema>;
export type DescarregamentoOutput = z.infer<typeof DescarregamentoSchema>;
export type ControleOutput = z.infer<typeof ControleSchema>;
export type TipoVeiculoOutput = z.infer<typeof VeiculoTipoSchema>;