import z from "zod";

export const TipoVeiculoSchemaEnum = z.enum([
  "PROPRIO",
  "AGREGADO",
  "DIARISTA",
  "TERCEIRO",
]);

export const TipoVeiculoEnum = TipoVeiculoSchemaEnum.enum;

export type TipoVeiculoEnumOutput = z.infer<typeof TipoVeiculoSchemaEnum>;