import z from "zod";

export const TipoProprietarioTrechoEnumSchema = z.enum([
  "TERCEIRO", 
  "AGREGADO", 
  "PROPRIO"
]);

export const TipoProprietarioTrechoEnum = TipoProprietarioTrechoEnumSchema.enum;

export const TipoProprietarioTrechoMap = {
  TERCEIRO: "T",
  AGREGADO: "A",
  PROPRIO: "P",
};