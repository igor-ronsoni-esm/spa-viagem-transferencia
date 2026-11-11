import { ColunaSelecao, FiltrosIniciais, Row, SearchFilter } from "./types";

/** Converte os valores digitados nas colunas em filtros */
export function montarFiltrosColunas(
  colunas: ColunaSelecao[],
  valores: FiltrosIniciais,
): SearchFilter[] {
  if (!colunas) return [];
  return colunas?.flatMap((col) => {
    const value = (valores[col.campoSQL] ?? "").trim();
    if (!value) return [];
    const operation = col.tipoCampo.toLowerCase() === "string" ? "like" : "=";
    return [{ field: col.campoSQL, operation, value }];
  });
}

function casa(row: Row, f: SearchFilter): boolean {
  const cell = row[f.field];
  if (cell === null || cell === undefined) return false;

  const texto = String(cell).toLowerCase();
  const esperado = f.value.toLowerCase();
  if (f.operation === "like") return texto.includes(esperado)
  if (f.operation === "=") return texto === esperado;
  if (f.operation === "<>") return texto !== esperado;
}

/** Retorna apenas as linhas que atendem a todos os filtros */
export function filtrarDados(dados: Row[], filtros: SearchFilter[]): Row[] {
  if (filtros.length === 0) return dados;
  if (!dados) return [];
  return dados?.filter((row) => filtros.every((f) => casa(row, f)));
}

export function getCellValue(row: Row, col: ColunaSelecao): string {
  const value = row[col.campoSQL];
  return value === null || value === undefined ? "" : String(value);
}