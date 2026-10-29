import { z } from "zod";

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

const VeiculoTipoSchema = z.enum(["P", "A", "D", "T"]).transform((tipo) => {
  const tipos = {
    P: "PRINCIPAL",
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
  origem: z.object({
    codigo: z.number(),
    sigla: z.string(),
    descricao: z.string(),
  }),
  destino: z.object({
    codigo: z.number(),
    sigla: z.string(),
    descricao: z.string(),
  }),
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

const EmpresaSchema = z.object({
  codigo: z.number(),
  sigla: z.string(),
  descricao: z.string(),
});

const ConhecimentoSchema = z.object({
  codigo: z.number(),
  numero: z.string(),
  quantidade: z.number(),
  peso: z.number(),
  valor: z.number(),
  remetente: EmpresaSchema,
  destinatario: EmpresaSchema,
})

const ControleSchema = z.object({
  codigo: z.number(),
  chave: z.string(),
  origem: EmpresaSchema,
  destino: EmpresaSchema,
  tipoInclusao: TipoInclusaoSchema.nullable(),
  ctes: z.array(ConhecimentoSchema),
});

const DocumentoSchema = z.object({
  descarregamento: z.object({
    destino: z.string(),
    controles: z.array(ControleSchema)
  })
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

export type TipoTransferenciaOutput = z.infer<typeof TipoTransferenciaSchema>;
export type TipoViagemOutput = z.infer<typeof TipoSchema>;
export type ViagemOutput = z.infer<typeof ViagemSchema>;
export type OcorrenciaViagemEnumOutput = z.infer<typeof OcorrenciaSchema>;
export type OcorrenciaViagemOutput = z.infer<typeof OcorrenciaViagemSchema>;
export type DocumentoFiscalSchemaOutput = z.infer<typeof DocumentoFiscalSchema>;