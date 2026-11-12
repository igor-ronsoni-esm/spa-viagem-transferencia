import z from "zod";
import { EmpresaSchema } from "../../empresa/schemas/empresa.schema";
import { TipoRodadoVeiculoEnum } from "@modules/domain/veiculos/schemas/tipo-rodado.schema";
import { TipoProprietarioTrechoEnumSchema } from "./tipo-proprietario-trecho.schema";

export const TrechoSchema = z.object({
  codigo: z.number(),
  origem: EmpresaSchema,
  destino: EmpresaSchema,
  tipoVeiculoPrincipal: TipoRodadoVeiculoEnum,
  tipoVeiculoSecundario: TipoRodadoVeiculoEnum,
  tipoProprietarioVeiculo: TipoProprietarioTrechoEnumSchema,
  km: z.number()
});