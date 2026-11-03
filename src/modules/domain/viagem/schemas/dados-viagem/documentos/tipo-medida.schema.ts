import z from "zod";

export const TipoPesoM3SchemaEnum = z.enum(["PESO", "M3"]);

export const TipoPesoM3Enum = TipoPesoM3SchemaEnum.enum;

