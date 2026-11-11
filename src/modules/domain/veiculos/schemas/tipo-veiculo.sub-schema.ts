import z from "zod";
import { TipoVeiculoSchemaEnum } from "./tipo-veiculo.schema";

export const TipoVeiculoSubSchemaEnum = z
  .enum(["P", "A", "D", "T"])
  .transform((tipo) => {
    const tipos = {
      P: "PROPRIO",
      A: "AGREGADO",
      D: "DIARISTA",
      T: "TERCEIRO",
      DESCONHECIDO: "DESCONHECIDO",
    } as const;

    return tipos[tipo] ?? "DESCONHECIDO";
  })
  .pipe(TipoVeiculoSchemaEnum)