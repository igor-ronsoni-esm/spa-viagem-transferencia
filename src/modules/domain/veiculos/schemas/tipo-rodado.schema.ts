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


export const TipoRodadoVeiculoEnumMap = {
  "UTILITARIO": 1,
  "AUTOMOVEL": 2,
  "MEDIO": 3,
  "TOCO": 4,
  "TRUCK": 5,
  "REBOQUE (JULIETA)": 6,
  "SEMI-REBOQUE (CARRETA)": 7,
  "CAVALO MECANICO": 8,
  "OUTROS": 9,
  "ONIBUS": 10,
  "VAN": 11,
  "EMBARCAÇÃO": 12,
};
 