"use client";

import { useContext, useEffect } from "react";
import AbaDadosGerais from "./abas/dados-gerais/AbaDadosGerais";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { useFormContext } from "react-hook-form";
import AbaOcorrencias from "./abas/ocorrencias/AbaOcorrencias";
import AbaDocumentosFiscais from "./abas/documentos-fiscais/AbaDocumentosFiscais";
import AbaDocumentos from "./abas/documentos/AbaDocumentos";
import { ABAS_TELA_VIAGEM_ENUM } from "@constants/enum";
import { useFormularioContext } from "@contexts/formulario/FormularioProvider";
import TabsViagem from "./TabsViagem";
import AcoesViagem from "./AcoesViagem";

type Props = {
  viagem: ViagemOutput;
};

export default function ApresentacaoTelas({ viagem }: Readonly<Props>) {
  const { tabSelecionada } = useFormularioContext();
  const { reset } = useFormContext<ViagemOutput>();

  useEffect(() => {
    reset(viagem);
  }, [viagem, reset]);
  
  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="bg-gray-50 border-b border-gray-100 px-4 pt-2 flex flex-col gap-2 shrink-0">
        <AcoesViagem />
        <TabsViagem />
      </div>
      <div className="flex flex-1 p-4 min-h-0 overflow-y-auto">
        {tabSelecionada === ABAS_TELA_VIAGEM_ENUM.DADOS_GERAIS && <AbaDadosGerais />}
        {tabSelecionada === ABAS_TELA_VIAGEM_ENUM.DOCUMENTOS && <AbaDocumentos />}
        {tabSelecionada === ABAS_TELA_VIAGEM_ENUM.OCORRENCIAS && <AbaOcorrencias />}
        {tabSelecionada === ABAS_TELA_VIAGEM_ENUM.DOCUMENTOS_FISCAIS && <AbaDocumentosFiscais />}
      </div>
    </div>
  );
}
