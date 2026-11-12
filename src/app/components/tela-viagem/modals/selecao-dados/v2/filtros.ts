import { DadoOutput } from "@modules/domain/api-consulta/schemas/dados.entity";
import { ColunaSelecao, FiltrosIniciais, Row, SearchFilter } from "../types";
import { ColunaOutput } from "@modules/domain/api-consulta/schemas/coluna.schema";

const TIPOS_NUMERICOS = /^(integer|int|smallint|bigint|decimal|numeric|float|double|number)$/i;
const VALOR_NUMERICO = /^-?\d+(\.\d+)?$/;

const isNumerico = (tipo: string) => TIPOS_NUMERICOS.test(tipo);

/** Converte os valores digitados nas colunas em filtros */
export function montarFiltrosDinamicos(
  colunas: ColunaSelecao[],
  valores: FiltrosIniciais,
): SearchFilter[] {
  return colunas.flatMap((col): SearchFilter[] => {
    const value = (valores[col.campoSQL] ?? "").trim();
    if (!value) return [];

    if (isNumerico(col.tipoCampo)) {
      // Campo numérico digitado com texto não gera filtro (evita SQL inválido)
      if (!VALOR_NUMERICO.test(value)) return [];
      return [{ field: col.campoSQL, operation: "=", value }];
    }

    return [{ field: col.campoSQL, operation: "like", value }];
  });
}

/** Escapa aspas simples para o literal SQL */
const esc = (valor: string) => valor.replace(/'/g, "''");

function montarCondicao(f: SearchFilter, colunas: ColunaSelecao[]): string {
  if (f.operation === "like") {
    return `${f.field} LIKE '%${esc(f.value)}%'`;
  }

  const tipo = colunas.find((c) => c.campoSQL === f.field)?.tipoCampo;
  const numerico = tipo ? isNumerico(tipo) : VALOR_NUMERICO.test(f.value);

  if (numerico) {
    if (!VALOR_NUMERICO.test(f.value)) {
      throw new Error(`Valor inválido para o campo numérico ${f.field}: ${f.value}`);
    }
    return `${f.field} ${f.operation} ${f.value}`;
  }

  return `${f.field} ${f.operation} '${esc(f.value)}'`;
}

/** Monta o customQuery: cada condição precedida de AND */
export function montarCustomQuery(
  filtros: SearchFilter[],
  colunas: ColunaSelecao[],
): string {
  return filtros.map((f) => `AND ${montarCondicao(f, colunas)}`).join(" ");
}

export function getCellValue(row: DadoOutput, col: ColunaOutput): string {
  const value = row[col.fieldName];
  return value === null || value === undefined ? "" : String(value);
}