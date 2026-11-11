import z from "zod";

export const TipoRodadoVeiculoLiteralSchema = z
  .literal(1)
  .or(z.literal(2))
  .or(z.literal(3))
  .or(z.literal(4))
  .or(z.literal(5))
  .or(z.literal(6))
  .or(z.literal(7))
  .or(z.literal(8))
  .or(z.literal(9))
  .or(z.literal(10))
  .or(z.literal(11))
  .or(z.literal(12));

export const TipoRodadoVeiculoEnumSchema = z.enum([
  "UTILITARIO",
  "AUTOMOVEL",
  "MEDIO",
  "TOCO",
  "TRUCK",
  "REBOQUE (JULIETA)",
  "SEMI-REBOQUE (CARRETA)",
  "CAVALO MECANICO",
  "OUTROS",
  "ONIBUS",
  "VAN",
  "EMBARCAÇÃO",
]);

export const TipoRodadoVeiculoEnum = TipoRodadoVeiculoEnumSchema.enum;