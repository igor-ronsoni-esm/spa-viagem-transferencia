"use client";

import { fetchSafe } from "@modules/utils/fetches/fetch-safe";
import { buscarViagemPorCodigoExecucao } from "../../server-actions";
import { useContext, useEffect, useState } from "react";
import { Loading } from "@modules/components/feedbacks/loading/Loading";
import { motion } from "motion/react";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { FormProvider, useForm } from "react-hook-form";
import Header from "./Header";
import TabsViagem from "./TabsViagem";
import ApresentacaoTelas from "./ApresentacaoTelas";
import Image from "next/image";
import { ViagemProvider } from "@contexts/viagem/ViagemProvider";
import { FormularioProvider, useFormularioContext } from "@contexts/formulario/FormularioProvider";
import { useSelecaoEmpresaContext } from "@contexts/empresa/SelecaoEmpresaProvider";

type Props = {
  codigoViagem: number;
};

export default function TelaViagem({ codigoViagem }: Readonly<Props>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [viagem, setViagem] = useState<ViagemOutput | null>(null);
  
  const metodos = useForm<ViagemOutput>();
  const { handleSalvarEdicao } = useFormularioContext();
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

  useEffect(() => {
    fetchViagem();
  }, [codigoViagem, empresa]);

  if (loading)
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <Loading />
        <p>Carregando viagem...</p>
      </div>
    );
  
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
          <FormularioProvider>
            <FormProvider {...metodos}>
              <form onSubmit={metodos.handleSubmit(handleSalvarEdicao)} className="flex flex-1 flex-col min-h-0">
                <TabsViagem viagem={viagem} />
                <ApresentacaoTelas viagem={viagem}/>
              </form>
            </FormProvider>
          </FormularioProvider>
        </ViagemProvider>
      </div>
    </motion.div>
  );
}
