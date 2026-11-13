"use client";

import { fetchSafe } from "@modules/utils/fetches/fetch-safe";
import { buscarViagemPorCodigoExecucao } from "../../server-actions";
import { useEffect, useState } from "react";
import { Loading } from "@modules/components/feedbacks/loading/Loading";
import { motion } from "motion/react";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { FormProvider, useForm } from "react-hook-form";
import Header from "./Header";
import ApresentacaoTelas from "./ApresentacaoTelas";
import Image from "next/image";
import { ViagemProvider } from "@contexts/viagem/ViagemProvider";
import { FormularioProvider } from "@contexts/formulario/FormularioProvider";
import { useSelecaoEmpresaContext } from "@contexts/empresa/SelecaoEmpresaProvider";
import LoadingViagem from "@components/loading/LoadingViagem";
import { useRouter, useSearchParams } from "next/navigation";
import { resetarViagemNaUrl } from "../../client-utils/search-params";

type Props = {
  codigoViagem: number;
};

export default function TelaViagem({ codigoViagem }: Readonly<Props>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [viagem, setViagem] = useState<ViagemOutput | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  const metodos = useForm<ViagemOutput>();
  const { empresa } = useSelecaoEmpresaContext();
  
  const fetchViagem = async () => {
    if (!empresa?.codigo) return;
    try {
      setLoading(true);
      const resultado = await fetchSafe(
        async () => await buscarViagemPorCodigoExecucao(codigoViagem, empresa.codigo),
      );
      setViagem(resultado);
    } catch (err) {
      console.error("[TELA VIAGEM] Erro ao buscar viagem:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReiniciarConsultas = () => router.replace(resetarViagemNaUrl(searchParams));

  useEffect(() => {
    fetchViagem();
  }, [codigoViagem, empresa]);

  if (loading) return <LoadingViagem texto="Carregando viagem..." />
  // quero que o botão de reinicar consultas qundo eu passe o mouse ele tenha efeito de subir
  if (!loading && !viagem)
    return (
      <div className="flex flex-col flex-1 gap-3 items-center justify-center">
        <Image
          src="/images/truck_blocked.png"
          alt="Viagem não encontrada"
          width={200}
          height={200}
          loading="eager"
        />
        <h1 className="text-lg font-bold">Viagem não encontrada</h1>
        <button onClick={handleReiniciarConsultas} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 animate">
          Reiniciar consultas
        </button>
      </div>
    );

  return (
    <motion.div
      key={codigoViagem}
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="flex-1 flex flex-col h-full min-h-0"
    >
      <div className="flex flex-1 flex-col min-h-0">
        <Header viagem={viagem} />
        <ViagemProvider>
          <FormProvider {...metodos}>
            <FormularioProvider>
              <ApresentacaoTelas viagem={viagem}/>
            </FormularioProvider>
          </FormProvider>
        </ViagemProvider>
      </div>
    </motion.div>
  );
}
