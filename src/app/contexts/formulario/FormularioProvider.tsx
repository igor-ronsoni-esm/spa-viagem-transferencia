import { ReactNode, useContext, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ABAS_TELA_VIAGEM_ENUM } from "@constants/enum";
import { FormularioContext } from "./FormularioContext";
import { useFormContext } from "react-hook-form";
import { fetchSafe } from "@modules/utils/fetches/fetch-safe";
import { salvarViagem } from "../../server-actions";
import { ViagemInput, ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { LoadingBackdrop } from "@modules/components/feedbacks/loading/LoadingBackdrop";

type Props = {
  children: ReactNode;
};

export function FormularioProvider({ children }: Props) {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textoLoading, setTextoLoading] = useState<string>("");
  const [dadosViagemAtual, setDadosViagemAtual] = useState<ViagemOutput | null>(null);
  const [tabSelecionada, setTabSelecionada] = useState(ABAS_TELA_VIAGEM_ENUM.DADOS_GERAIS);
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const metodos = useFormContext<ViagemOutput>(); 

  const handleEditarViagem = () => {  
    setModoEdicao(true);
    setDadosViagemAtual(metodos.watch());
    const searchParamsObj = new URLSearchParams(searchParams.toString());
    searchParamsObj.set("modoEdicao", "true");
    router.replace(`?${searchParamsObj.toString()}`);
  };
  
  const handleSalvarEdicao = async () => {
    try {
      setTextoLoading("Salvando Viagem. Aguarde um momento...");
      setLoading(true);
      await fetchSafe(async () => salvarViagem(metodos.watch() as unknown as ViagemInput));
      setDadosViagemAtual(null);
    } catch (err) {
      console.error("[SALVAR_EDICAO] Erro ao salvar edição:", err);
    } finally {
      setLoading(false);
      setTextoLoading("");
    }
  };

  const handleCancelarEdicao = () => {
    setModoEdicao(false);
    metodos.reset(dadosViagemAtual ?? undefined);
    setDadosViagemAtual(null);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("modoEdicao");

    const query = params.toString();

    router.replace(
      `${pathname}${query ? `?${query}` : ""}`,
      { scroll: false }
    );
  };
  
  const handleAlterarTab = (tab: ABAS_TELA_VIAGEM_ENUM) => {
    setTabSelecionada(tab);
  }

  return (
    <FormularioContext.Provider
      value={{
        modoEdicao,
        loading,
        tabSelecionada,
        setTabSelecionada: handleAlterarTab,
        setLoading,
        handleEditarViagem,
        handleSalvarEdicao,
        handleCancelarEdicao,
      }}
    >
      <form onSubmit={metodos.handleSubmit(handleSalvarEdicao)} className="flex flex-1 min-h-0">
        {children}
      </form>
      <LoadingBackdrop open={loading} description={textoLoading || "Aguarde um momento..."}/>
    </FormularioContext.Provider>
  );
}

export const useFormularioContext = () => {
  return useContext(FormularioContext);
}