import { ReactNode, useContext, useState } from "react";
import { ViagemContext } from "./ViagemContext";
import { useRouter, useSearchParams } from "next/navigation";
import { ABAS_TELA_VIAGEM_ENUM } from "@constants/enum";

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
        handleGerarViagem,
        handleResetarViagem,
        handleCancelarViagem,
        handleIniciarManualmente,
      }}
    >
      {children}
    </ViagemContext.Provider>
  );
}

export const useViagemContext = () => {
  return useContext(ViagemContext);
}