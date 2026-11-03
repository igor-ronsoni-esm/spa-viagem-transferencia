import { ReactNode, useContext, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ABAS_TELA_VIAGEM_ENUM } from "@constants/enum";
import { FormularioContext } from "./FormularioContext";

type Props = {
  children: ReactNode;
};

export function FormularioProvider({ children }: Props) {
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
  
  const handleSalvarEdicao = () => {};

  const handleCancelarEdicao = () => {
    setModoEdicao(false);
    const searchParamsObj = new URLSearchParams(searchParams.toString());
    searchParamsObj.delete("modoEdicao");
    router.replace(`?${searchParamsObj.toString()}`);
  };
  
  return (
    <FormularioContext.Provider
      value={{
        modoEdicao,
        loading,
        tabSelecionada,
        setTabSelecionada,
        setLoading,
        handleEditarViagem,
        handleSalvarEdicao,
        handleCancelarEdicao,
      }}
    >
      {children}
    </FormularioContext.Provider>
  );
}

export const useFormularioContext = () => {
  return useContext(FormularioContext);
}