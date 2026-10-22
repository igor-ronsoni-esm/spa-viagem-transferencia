import z from "zod";

// FastCrud "Consulta de Empresas Tipo Filiais" — verificado ao vivo em rkedev (2026-09-03).
// Compartilhada entre a service de validação (busca-empresa-por-sigla.service.ts) e o
// `queryKey` do `EsmInputTextButton` em `CampoUnidade.tsx`: as duas pontas precisam apontar
// para a mesma consulta.
export const CHAVE_FASTCRUD_EMPRESAS_TIPO_FILIAIS = "521DA610-5E8D-4A06-A4CF-6AFF67CC3CFF";

// Colunas reais dessa chave: CLD_CODIGO (PK), EMP_CODAG (sigla, 1 a 3 caracteres) e
// EMP_FANTASIA (nome). Não confundir com SIGLA/FANTASIA de outra chave FastCrud usada pelo
// spa-gerenciamento-escalas.
export const RegistroEmpresaFastcrudSchema = z.object({
  CLD_CODIGO: z.number(),
  EMP_CODAG: z.string(),
  EMP_FANTASIA: z.string(),
});

export const EmpresaSchema = z.object({
  cldCodigo: z.number(),
  sigla: z.string(),
  nome: z.string(),
});

export type EmpresaEntity = z.infer<typeof EmpresaSchema>;

export function converteRegistroFastcrudParaEmpresa(registro: unknown): EmpresaEntity | null {
  const resultado = RegistroEmpresaFastcrudSchema.safeParse(registro);
  if (!resultado.success) return null;

  return {
    cldCodigo: resultado.data.CLD_CODIGO,
    sigla: resultado.data.EMP_CODAG,
    nome: resultado.data.EMP_FANTASIA,
  };
}
