import z from "zod";

export const TipoViagemSchema = z.enum(["TRANSFERENCIA", "VAZIO"]);

export const TipoViagemEnum = TipoViagemSchema.enum;

export type TipoViagemEnumOutput = z.infer<typeof TipoViagemSchema>;

