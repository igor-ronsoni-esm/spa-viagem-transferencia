import z from "zod";

export const TipoEmpresaEnumSchema = z.enum(["AGENCIA", "MATRIZ", "FILIAL"]);

export const TipoEmpresaEnum = TipoEmpresaEnumSchema.enum;

export const TipoEmpresaEnumMap = {
  AGENCIA: "A",
  MATRIZ: "M",
  FILIAL: "F",
};
 