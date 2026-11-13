"use client";

import { useEffect, useMemo, useState } from "react";
import SelecaoModal, { FiltroRascunho } from "./SelecaoModal";
import { FiltroInput, Operacao } from "@modules/domain/api-consulta/schemas/filtro.schema";
import { ColunaOutput } from "@modules/domain/api-consulta/schemas/coluna.schema";
import { DadoOutput } from "@modules/domain/api-consulta/schemas/dados.entity";

type Props<T extends DadoOutput> = {
  open: boolean;
  handleFechar: () => void;
  titulo?: string;
  dados: T[];
  colunas: ColunaOutput[];
  carregando?: boolean;
  erro?: string | null;
  chavePrimaria: string;
  filtrosFixos?: FiltroInput[];
  onSelecionar: (row: T) => void;
};

const NUMERICO = /^(integer|int|smallint|bigint|decimal|numeric|float|double|number)$/i;
const NUMERO = /^-?\d+(\.\d+)?$/;

const mensagemErro = (err: unknown) =>
  err instanceof Error ? err.message : "Erro inesperado ao aplicar filtros.";

function montarFiltroInput(
  r: FiltroRascunho,
  colunas: ColunaOutput[],
): FiltroInput | null {
  const valor = r.valor.trim();
  if (!valor) return null;

  const col = colunas.find((c) => c.fieldName === r.campo);
  if (!col) throw new Error(`Campo ${r.campo} não existe nesta consulta.`);

  if (r.operacao !== "like" && NUMERICO.test(col.fieldType)) {
    if (!NUMERO.test(valor)) {
      throw new Error(`Informe um número válido para ${col.displayName}.`);
    }
    return { campo: r.campo, operacao: r.operacao, valor: Number(valor) };
  }

  return { campo: r.campo, operacao: r.operacao, valor };
}

function valorDaLinha(row: object, campo: string): unknown {
  return (row as Record<string, unknown>)[campo];
}

function atendeFiltro(linha: unknown, filtro: FiltroInput): boolean {
  if (linha === null || linha === undefined) return false;

  if (filtro.operacao === "like") {
    return String(linha).toLowerCase().includes(String(filtro.valor).toLowerCase());
  }

  const numerico = typeof filtro.valor === "number";
  const cmp = numerico
    ? Number(linha) - Number(filtro.valor)
    : String(linha).localeCompare(String(filtro.valor));

  switch (filtro.operacao as Operacao | string) {
    case "=":
      return cmp === 0;
    case "!=":
      return cmp !== 0;
    case ">":
      return cmp > 0;
    case ">=":
      return cmp >= 0;
    case "<":
      return cmp < 0;
    case "<=":
      return cmp <= 0;
    default:
      return true;
  }
}

export default function SelecaoModalLocal<T extends DadoOutput>({
  open,
  handleFechar,
  titulo,
  dados,
  colunas,
  carregando = false,
  erro = null,
  chavePrimaria,
  filtrosFixos = [],
  onSelecionar,
}: Readonly<Props<T>>) {
  const [rascunhos, setRascunhos] = useState<FiltroRascunho[]>([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltroInput[]>([]);
  const [erroInterno, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setRascunhos([]);
      setFiltrosAplicados([]);
      setErro(null);
    }
  }, [open]);

  useEffect(() => {
    if (open && !!erro) setErro(erro);
  }, [erro]);

  const dadosFiltrados = useMemo(() => {
    const todosFiltros = [...filtrosFixos, ...filtrosAplicados];
    if (todosFiltros.length === 0) return dados;

    return dados.filter((row) =>
      todosFiltros.every((f) => atendeFiltro(valorDaLinha(row, f.campo), f)),
    );
  }, [dados, filtrosFixos, filtrosAplicados]);

  const adicionarFiltro = (campo: string, somenteEste: boolean) => {
    setRascunhos((prev) => {
      const col = colunas.find((c) => c.fieldName === campo);
      const operacao: Operacao =
        col && NUMERICO.test(col.fieldType) ? "=" : "like";
      const novo: FiltroRascunho = {
        id: crypto.randomUUID(),
        campo,
        operacao,
        valor: "",
      };

      if (somenteEste) {
        const atual = prev.find((f) => f.campo === campo);
        return [atual ?? novo];
      }

      if (prev.some((f) => f.campo === campo)) return prev;
      return [...prev, novo];
    });
  };

  const alterarFiltro = (
    id: string,
    patch: Partial<Omit<FiltroRascunho, "id" | "campo">>,
  ) => setRascunhos((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const removerFiltro = (id: string) =>
    setRascunhos((prev) => prev.filter((f) => f.id !== id));

  const aplicarFiltros = () => {
    try {
      const aplicados = rascunhos.flatMap((r) => {
        const f = montarFiltroInput(r, colunas);
        return f ? [f] : [];
      });
      setErro(null);
      setFiltrosAplicados(aplicados);
    } catch (err) {
      setErro(mensagemErro(err));
    }
  };

  return (
    <SelecaoModal
      open={open}
      titulo={titulo}
      colunas={colunas}
      dados={dadosFiltrados}
      chavePrimaria={chavePrimaria}
      filtros={rascunhos}
      onAdicionarFiltro={adicionarFiltro}
      onAlterarFiltro={alterarFiltro}
      onRemoverFiltro={removerFiltro}
      onAplicarFiltros={aplicarFiltros}
      carregando={carregando}
      erro={erroInterno}
      onClose={handleFechar}
      onSelect={(row) => onSelecionar(row as T)}
    />
  );
}