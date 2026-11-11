export type ColunaSelecao = {
  campoSQL: string;
  caption: string;
  tipoCampo: string;
  chavePrimaria?: boolean;
};

export type Row = Record<string, unknown>;

export type SearchFilter = {
  field: string;
  operation: "=" | "like" | "<>";
  value: string;
};

/** Valor pré-preenchido por campo. Chave = campoSQL */
export type FiltrosIniciais = Record<string, string>;