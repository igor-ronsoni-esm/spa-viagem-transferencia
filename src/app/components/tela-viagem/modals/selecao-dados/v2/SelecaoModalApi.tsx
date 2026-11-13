"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiltroInput } from "@modules/domain/api-consulta/schemas/filtro.schema";
import { buscarColunas, buscarDados } from "./server-actions";
import { fetchSafe } from "@modules/utils/fetches/fetch-safe";
import { DadoOutput } from "@modules/domain/api-consulta/schemas/dados.entity";
import { ColunaOutput } from "@modules/domain/api-consulta/schemas/coluna.schema";
import SelecaoModalLocal from "./SelecaoModalLocal";

type Props = {
  open: boolean;
  chaveConsulta: string;
  titulo?: string;
  filtrosFixos?: FiltroInput[];
  handleFechar: () => void;
  handleSelecionarRegistro: <T>(row: T) => void;
  colunaChavePrimaria: string;
};

const mensagemErro = (err: unknown) => err instanceof Error ? err.message : "Erro inesperado ao buscar dados.";

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
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltroInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const requestId = useRef(0);

  const fixosKey = JSON.stringify(filtrosFixos);
  const fixos = useMemo<FiltroInput[]>(() => JSON.parse(fixosKey), [fixosKey]);

  useEffect(() => {
    if (!open) {
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

  return (
    <SelecaoModalLocal
      open={open}
      titulo={titulo}
      colunas={colunas}
      dados={dados}
      chavePrimaria={colunaChavePrimaria}
      carregando={loading}
      erro={erro}
      handleFechar={handleFechar}
      onSelecionar={handleSelecionarRegistro}
    />
  );
}