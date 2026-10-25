"use client";

import { fetchSafe } from "@modules/utils/fetches/fetch-safe";
import { buscarViagemPorCodigoExecucao } from "../../server-actions";
import { useEffect, useState } from "react";
import { Loading } from "@modules/components/feedbacks/loading/Loading";
import { motion } from "motion/react";
import DetalheViagem from "./DetalheViagem";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";

type Props = {
  codigoViagem: number;
};

export default function TelaViagem({ codigoViagem }: Readonly<Props>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [viagem, setViagem] = useState<ViagemOutput | null>(null);

  const fetchViagem = async () => {
    try {
      setLoading(true);
      const resultado = await fetchSafe(
        async () => await buscarViagemPorCodigoExecucao(codigoViagem, 64),
      );
      setViagem(resultado);
    } catch (err) {
      console.error("[TELA VIAGEM] Erro ao buscar viagem:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViagem();
  }, [codigoViagem]);

  if (loading)
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <Loading />
        <p>Carregando viagem...</p>
      </div>
    );
  
  if (!loading && !viagem)
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <p>Viagem não encontrada.</p>
      </div>
    );

  return (
    <motion.div
      key={codigoViagem}
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="flex-1 flex flex-col h-full"
    >
      <DetalheViagem viagem={viagem} />
    </motion.div>
  );
}
