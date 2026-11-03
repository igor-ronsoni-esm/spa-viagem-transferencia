import z from "zod";

export const TipoInclusaoControleEmViagemSchemaEnum = z.enum(["MANUAL_GESTAO", "MANUAL_VIAGEM", "AUTOMATICO"]);

export const TipoInclusaoControleEmViagemEnum = TipoInclusaoControleEmViagemSchemaEnum.enum;
