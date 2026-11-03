import { z } from "zod";

export const TipoMotoristaSchemaEnum = z.enum(["TITULAR", "CARONA", "RESERVA"]);

export const TipoMotoristaEnum = TipoMotoristaSchemaEnum.enum;
