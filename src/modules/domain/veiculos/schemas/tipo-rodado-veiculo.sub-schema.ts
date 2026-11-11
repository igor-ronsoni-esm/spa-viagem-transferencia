import z from "zod";

// Preciso de um sub esquema que transforme literal em enum

//1 = UTILITARIO ...
export const TipoRodadoVeiculoSubSchema = z
  .number()
  .transform((literal) => {
    const mapping = {
      1: "UTILITARIO",
      2: "AUTOMOVEL",
      3: "MEDIO",
      4: "TOCO",
      5: "TRUCK",
      6: "REBOQUE (JULIETA)",
      7: "SEMI-REBOQUE (CARRETA)",
      8: "CAVALO MECANICO",
      9: "OUTROS",
      10: "ONIBUS",
      11: "VAN",
      12: "EMBARCAÇÃO",
    } as const;

    return mapping[literal] ?? "OUTROS";
  });


