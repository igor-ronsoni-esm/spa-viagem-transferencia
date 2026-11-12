import z from "zod";

export const DadoSchema = z.record(z.string(), z.unknown());

export type DadoOutput = z.infer<typeof DadoSchema>;