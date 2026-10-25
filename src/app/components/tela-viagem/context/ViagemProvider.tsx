// preciso de um provider que forneça o contexto da viagem
import { ReactNode, useState } from "react";
import { ViagemContext } from "./ViagemContext";
import { ABAS_TELA_VIAGEM_ENUM } from "@/src/app/constants";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  children: ReactNode;
};

export function ViagemProvider({ children }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [modoEdicao, setModoEdicao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabSelecionada, setTabSelecionada] = useState(ABAS_TELA_VIAGEM_ENUM.DADOS_GERAIS);
  
  const handleEditarViagem = () => {  
    setModoEdicao(true);
    const searchParamsObj = new URLSearchParams(searchParams.toString());
    searchParamsObj.set("modoEdicao", "true");
    router.replace(`?${searchParamsObj.toString()}`);
  };

  const handleGerarViagem = () => {};
  const handleResetarViagem = () => {};
  const handleCancelarViagem = () => {};
  const handleSalvarEdicao = () => {};

  const handleCancelarEdicao = () => {
    setModoEdicao(false);
    const searchParamsObj = new URLSearchParams(searchParams.toString());
    searchParamsObj.delete("modoEdicao");
    router.replace(`?${searchParamsObj.toString()}`);
  };
  
  const handleIniciarManualmente = () => {};

  return (
    <ViagemContext.Provider
      value={{
        modoEdicao,
        loading,
        tabSelecionada,
        setTabSelecionada,
        setLoading,
        handleEditarViagem,
        handleGerarViagem,
        handleResetarViagem,
        handleSalvarEdicao,
        handleCancelarEdicao,
        handleCancelarViagem,
        handleIniciarManualmente,
      }}
    >
      {children}
    </ViagemContext.Provider>
  );
}