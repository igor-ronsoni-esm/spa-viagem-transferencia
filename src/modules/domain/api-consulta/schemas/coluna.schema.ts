 "displayName"
import z from "zod"

const TipoDadoEnumSchema = z.enum(["Integer", "String", "Boolean", "Date"]); 
const FiltroInicialLiteralSchema = z.literal("S").or(z.literal("N"));

const ColunaSchema = z.object({
  displayName: z.string(),
  fieldName: z.string(),
  size: z.number(),
  initialFilter: FiltroInicialLiteralSchema,
  fieldType: TipoDadoEnumSchema,
});

export type ColunaOutput = z.output<typeof ColunaSchema>;
export type ColunaInput = z.input<typeof ColunaSchema>;