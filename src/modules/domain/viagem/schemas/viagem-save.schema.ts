// import { z } from "zod";

// export const TipoTransferenciaSchema = z.enum([
//   "ESCALA",
//   "EXTRA",
//   "ROTA_ALTERNATIVA",
// ]);

// export const TipoSchema = z.enum(["TRANSFERENCIA", "VAZIO"]);

// const TipoViagemSchema = z
//   .enum(["T", "V"])
//   .transform((tipo) => {
//     const tipos = {
//       T: "TRANSFERENCIA",
//       V: "VAZIO",
//     } as const;

//     return tipos[tipo];
//   })
//   .pipe(TipoSchema);

// const TipoTransferenciaViagemSchema = z
//   .enum(["E", "X", "A"])
//   .transform((tipo) => {
//     const tipos = {
//       E: "ESCALA",
//       X: "EXTRA",
//       A: "ROTA_ALTERNATIVA",
//     } as const;

//     return tipos[tipo];
//   })
//   .pipe(TipoTransferenciaSchema);

// const LinhaLancamentoSchema = z.object({
//   codigo: z.number(),
//   viagemExecucao: z.object({
//     codigo: z.number(),
//     linha: z.object({
//       codigo: z.number(),
//     }),
//   }),
// });

// const TrechoSchema = z.object({
//   codigo: z.number(),
//   origem: z.object({
//     codigo: z.number(),
//     sigla: z.string(),
//     descricao: z.string(),
//   }),
//   destino: z.object({
//     codigo: z.number(),
//     sigla: z.string(),
//     descricao: z.string(),
//   }),
// });

// const LinhaSchema = z.object({
//   codigo: z.number(),
//   id: z.number(),
//   descricao: z.string(),
//   trecho: TrechoSchema,
// });

// const RastreioSchema = z.object({
//   codigo: z.number(),
//   rota: z.number(),
//   descricao: z.string(),
//   rastreioViagem: z.string().nullable(),
// });

// const VeiculoSchema = z.object({
//   codigo: z.number(),
//   placa: z.string(),
//   descricao: z.string(),
//   tipo: z.string(),
// });

// const VeiculoViagemSchema = z.object({
//   codigo: z.number(),
//   principal: z.boolean(),
//   veiculo: VeiculoSchema,
// });

// const MotoristaViagemSchema = z.object({
//   codigo: z.number(),
//   tipo: z.string(),
//   funcionario: z.object({
//     codigo: z.number(),
//     nome: z.string(),
//   }),
// });

// const LacreSchema = z.object({
//   ordem: z.number(),
//   numero: z.string(),
// });

// const EmpresaSchema = z.object({
//   codigo: z.number(),
//   sigla: z.string(),
//   descricao: z.string(),
// });

// const ConhecimentoSchema = z.object({
//   codigo: z.number(),
//   numero: z.string(),
//   quantidade: z.number(),
//   peso: z.number(),
//   valor: z.number(),
//   remetente: EmpresaSchema,
//   destinatario: EmpresaSchema,
// })

// const ControleSchema = z.object({
//   codigo: z.number(),
//   chave: z.string(),
//   origem: EmpresaSchema,
//   destino: EmpresaSchema,
//   tipoInclusao: TipoInclusaoSchema.nullable(),
//   ctes: z.array(ConhecimentoSchema),
// });

// const DocumentoSchema = z.object({
//   descarregamento: z.object({
//     destino: z.string(),
//     controles: z.array(ControleSchema)
//   })
// });

// const TrocaMotoristaSchema = z.object({
//   codigo: z.number(),
//   empresa: EmpresaSchema,
//   pontoControle: z.object({
//     descricao: z.string(),
//   })
// })


// const DescarregamentoSchema = z.object({
//   codigo: z.number(),
//   situacao: z.string(),
//   empresa: EmpresaSchema,
//   percurso: z.string(),
// });

// export const ViagemSchema = z.object({
//   codigo: z.number().nullable(),
//   codigoAgencia: z.number(),
//   status: OcorrenciaSchema.nullable(),
//   dataViagem: z.string(),
//   tipoViagem: TipoViagemSchema,
//   tipoTransferencia: TipoTransferenciaViagemSchema,
//   extraTipo: z.number().nullable(),
//   linhaLancamento: LinhaLancamentoSchema,
//   linha: LinhaSchema,
//   previsaoSaida: z.string(),
//   rastreio: RastreioSchema,
//   veiculos: z.array(VeiculoViagemSchema),
//   motoristas: z.array(MotoristaViagemSchema),
//   trocasMotorista: z.array(TrocaMotoristaSchema),
//   lacres: z.array(LacreSchema),
//   descarregamentos: z.array(DescarregamentoSchema),
//   documentos: z.array(DocumentoSchema),
// });

// export const OcorrenciaViagem = OcorrenciaSchema.enum;

// export const TipoTransferencia = TipoTransferenciaSchema.enum;
// export const TipoViagemEnum = TipoSchema.enum;

// export type TipoTransferenciaOutput = z.infer<typeof TipoTransferenciaSchema>;
// export type TipoViagemOutput = z.infer<typeof TipoSchema>;
// export type ViagemOutput = z.infer<typeof ViagemSchema>;
// export type OcorrenciaViagemOutput = z.infer<typeof OcorrenciaSchema>;