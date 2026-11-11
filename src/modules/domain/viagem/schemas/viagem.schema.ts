import { z } from "zod";
import { EmpresaSchema } from "../../empresa/schemas/empresa.schema";
import { TipoViagemSchema } from "./dados-viagem/tipo-viagem.schema";
import { TipoMotoristaSchemaEnum } from "./dados-viagem/motorista/tipo-motorista.schema";
import { OcorrenciaViagemSchema } from "./dados-viagem/ocorrencia/ocorrencia-viagem.schema";
import { OcorrenciaSchemaEnum } from "./dados-viagem/ocorrencia/ocorrencias.schema";
import { TipoTransferenciaSchemaEnum } from "./dados-viagem/tipo-transferencia.schema";
import { TipoPesoM3Enum, TipoPesoM3SchemaEnum } from "./dados-viagem/documentos/tipo-medida.schema";
import { ConhecimentoSchema } from "./dados-viagem/documentos/conhecimento.schema";
import { MotoristaViagemSchema } from "./dados-viagem/motorista/motorista.schema";
import { ControleSchema } from "./dados-viagem/documentos/controle.schema";
import { NotaFiscalSchema } from "./dados-viagem/documentos/nota-fiscal.schema";
import { DescarregamentoDocumentosSchema } from "./dados-viagem/descarregamento/descarregamento-documentos.schema";
import { DescarregamentoViagemSchema } from "./dados-viagem/descarregamento/descarregamento-viagem.schema";
import { DocumentoFiscalSchema } from "./dados-viagem/documento-fiscal/manifesto.schema";
import { VeiculoViagemSchema } from "./dados-viagem/veiculo/veiculo-viagem.schema";
import { LinhaTransferenciaSchema } from "../../linhas-transferencia/schemas/linha-transferencia.schema";
import { VeiculoSchema } from "@modules/domain/veiculos/schemas/veiculo.schema";
import { TipoVeiculoSubSchemaEnum } from "@modules/domain/veiculos/schemas/tipo-veiculo.sub-schema";
import { TrechoSchema } from "@modules/domain/linhas-transferencia/schemas/trecho.schema";
import { TipoRodadoVeiculoSubSchema } from "@modules/domain/veiculos/schemas/tipo-rodado-veiculo.sub-schema";

const TipoMotoristaSubSchemaEnum = z
  .enum(["T", "C", "R"])
  .transform((tipo) => {
    const tipos = {
      T: "TITULAR",
      C: "CARONA",
      R: "RESERVA",
      DESCONHECIDO: "DESCONHECIDO",
    } as const;

    return tipos[tipo] ?? "DESCONHECIDO";
  })
  .pipe(TipoMotoristaSchemaEnum);

const TipoViagemSubSchemaEnum = z
  .enum(["T", "V"])
  .transform((tipo) => {
    const tipos = {
      T: "TRANSFERENCIA",
      V: "VAZIO",
    } as const;

    return tipos[tipo];
  })
  .pipe(TipoViagemSchema);

const TipoTransferenciaSubSchemaEnum = z
  .enum(["E", "X", "A"])
  .transform((tipo) => {
    const tipos = {
      E: "ESCALA",
      X: "EXTRA",
      A: "ROTA_ALTERNATIVA",
    } as const;

    return tipos[tipo];
  })
  .pipe(TipoTransferenciaSchemaEnum);


const TipoPesoM3DocumentoSubSchemaEnum = z
  .enum(["P", "M"])
  .transform((tipo) => {
    const tipos = {
      P: "PESO",
      M: "M3",
    } as const;

    return tipos[tipo] ?? "PESO";
  })
  .pipe(TipoPesoM3SchemaEnum);

const LinhaLancamentoSubSchema = z.object({
  codigo: z.number(),
  viagemExecucao: z.object({
    codigo: z.number(),
    linha: z.object({
      codigo: z.number(),
    }),
  }),
});

const RastreioSubSchema = z.object({
  codigo: z.number(),
  rota: z.number(),
  descricao: z.string(),
  rastreioViagem: z.string().nullable(),
});


const LacreSubSchema = z.object({
  ordem: z.number(),
  numero: z.string(),
});


const DocumentosSubSchema = z.object({
  descarregamento: DescarregamentoDocumentosSchema.extend({
    controles: z.array(
      ControleSchema.extend({
        ctes: z.array(ConhecimentoSchema.extend({
          tipoPesoM3: TipoPesoM3DocumentoSubSchemaEnum.default(TipoPesoM3Enum.PESO),
        })),
        nfes: z.array(NotaFiscalSchema.extend({
          tipoPesoM3: TipoPesoM3DocumentoSubSchemaEnum.default(TipoPesoM3Enum.PESO),
        })).optional().nullable()
      })
    )
  }),
});

const TrocaMotoristaSubSchema = z.object({
  codigo: z.number(),
  empresa: EmpresaSchema,
  pontoControle: z.object({
    descricao: z.string(),
  })
})

export const ExtraTipoSubSchemaUnion = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);

export const ViagemSchema = z.object({
  codigo: z.number().nullable(),
  codigoAgencia: z.number(),
  status: OcorrenciaSchemaEnum.nullable(),
  dataViagem: z.string(),
  tipoViagem: TipoViagemSubSchemaEnum,
  tipoTransferencia: TipoTransferenciaSubSchemaEnum,
  extraTipo: ExtraTipoSubSchemaUnion.nullable(),
  linhaLancamento: LinhaLancamentoSubSchema,
  linha: LinhaTransferenciaSchema.extend({
    trecho: TrechoSchema.extend({
      tipoVeiculoPrincipal: TipoRodadoVeiculoSubSchema,
      tipoVeiculoSecundario: TipoRodadoVeiculoSubSchema.nullable(),
    }),
  }),
  previsaoSaida: z.string(),
  rastreio: RastreioSubSchema,
  veiculos: z.array(VeiculoViagemSchema
    .extend({
      veiculo: VeiculoViagemSchema.shape.veiculo
        .extend({
          tipo: TipoVeiculoSubSchemaEnum,
          tipoRodado: TipoRodadoVeiculoSubSchema,
        })
    })),
  motoristas: z.array(MotoristaViagemSchema.extend({
    tipo: TipoMotoristaSubSchemaEnum
  })),
  trocasMotorista: z.array(TrocaMotoristaSubSchema),
  lacres: z.array(LacreSubSchema),
  descarregamentos: z.array(DescarregamentoViagemSchema),
  documentos: z.array(DocumentosSubSchema),
  ocorrencias: z.array(OcorrenciaViagemSchema),
  documentosFiscais: z.array(DocumentoFiscalSchema),
});

export type ViagemOutput = z.output<typeof ViagemSchema>;

export type ViagemInput = z.input<typeof ViagemSchema>;

