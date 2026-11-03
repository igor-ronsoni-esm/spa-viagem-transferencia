import z from "zod";

export const TipoTransferenciaSchemaEnum = z.enum([
  "ESCALA",
  "EXTRA",
  "ROTA_ALTERNATIVA",
]);

export const TipoTransferenciaEnum = TipoTransferenciaSchemaEnum.enum;

export type TipoTransferenciaEnumOutput = z.infer<typeof TipoTransferenciaSchemaEnum>;
