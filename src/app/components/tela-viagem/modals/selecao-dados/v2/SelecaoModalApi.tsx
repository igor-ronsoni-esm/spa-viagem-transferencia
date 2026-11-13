"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SelecaoModal, { FiltroRascunho } from "./SelecaoModal";
import { FiltroInput, Operacao } from "@modules/domain/api-consulta/schemas/filtro.schema";
import { buscarColunas, buscarDados } from "./server-actions";
import { fetchSafe } from "@modules/utils/fetches/fetch-safe";
import { DadoOutput } from "@modules/domain/api-consulta/schemas/dados.entity";
import { ColunaOutput } from "@modules/domain/api-consulta/schemas/coluna.schema";

type Props = {
  open: boolean;
  chaveConsulta: string;
  titulo?: string;
  filtrosFixos?: FiltroInput[];
  handleFechar: () => void;
  handleSelecionarRegistro: <T>(row: T) => void;
  colunaChavePrimaria: string;
};

const NUMERICO = /^(integer|int|smallint|bigint|decimal|numeric|float|double|number)$/i;
const NUMERO = /^-?\d+(\.\d+)?$/;

const mensagemErro = (err: unknown) =>
  err instanceof Error ? err.message : "Erro inesperado ao buscar dados.";

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

export default function SelecaoModalApi({
  open,
  chaveConsulta,
  titulo,
  filtrosFixos = [],
  handleFechar,
  handleSelecionarRegistro,
  colunaChavePrimaria
}: Readonly<Props>) {
  const [colunas, setColunas] = useState<ColunaOutput[]>([]);
  const [dados, setDados] = useState<DadoOutput[]>([]);
  const [rascunhos, setRascunhos] = useState<FiltroRascunho[]>([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltroInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const requestId = useRef(0);

  const fixosKey = JSON.stringify(filtrosFixos);
  const fixos = useMemo<FiltroInput[]>(() => JSON.parse(fixosKey), [fixosKey]);

  useEffect(() => {
    if (!open) {
      setRascunhos([]);
      setFiltrosAplicados([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let ativo = true;

    (async () => {
      try {
        setLoading(true);
        setErro(null);
        const cols = await fetchSafe(() => buscarColunas(chaveConsulta));
        if (ativo) setColunas(cols);
      } catch (err) {
        if (ativo) setErro(mensagemErro(err));
      } finally {
        if (ativo) setLoading(false);
      }
    })();

    return () => {
      ativo = false;
    };
  }, [open, chaveConsulta]);

  useEffect(() => {
    if (!open || colunas.length === 0) return;

    const id = ++requestId.current;
    setLoading(true);
    setErro(null);

    (async () => {
      try {
        const rows = await fetchSafe(() =>
          buscarDados(chaveConsulta, [...fixos, ...filtrosAplicados], colunas),
        );
        if (id === requestId.current) setDados(rows);
      } catch (err) {
        if (id === requestId.current) {
          console.error(`[BUSCA_DE_DADOS] [${chaveConsulta}]`, err);
          setErro(mensagemErro(err));
        }
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    })();
  }, [open, colunas, filtrosAplicados, fixos, chaveConsulta]);

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
      dados={dados}
      chavePrimaria={colunaChavePrimaria}
      filtros={rascunhos}
      onAdicionarFiltro={adicionarFiltro}
      onAlterarFiltro={alterarFiltro}
      onRemoverFiltro={removerFiltro}
      onAplicarFiltros={aplicarFiltros}
      carregando={loading}
      erro={erro}
      onClose={handleFechar}
      onSelect={handleSelecionarRegistro}
    />
  );
}