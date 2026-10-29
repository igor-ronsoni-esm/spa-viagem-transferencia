"use client"

import { useContext, useEffect } from "react";
import { ViagemContext } from "./context/ViagemContext";
import { ABAS_TELA_VIAGEM_ENUM } from "../../constants";
import AbaDadosGerais from "./abas/dados-gerais/AbaDadosGerais";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { useFormContext } from "react-hook-form";
import AbaOcorrencias from "./abas/ocorrencias/AbaOcorrencias";
import AbaDocumentosFiscais from "./abas/documentos-fiscais/AbaDocumentosFiscais";

type Props = {
  viagem: ViagemOutput;
}

export default function ApresentacaoTelas({ viagem }: Readonly<Props>) {
  const { tabSelecionada } = useContext(ViagemContext);
  const { reset } = useFormContext<ViagemOutput>();

  useEffect(() => {
    reset(viagem);
  }, [viagem, reset]);

  return <div className="flex flex-1 p-4 min-h-0 overflow-y-auto">
    {tabSelecionada === ABAS_TELA_VIAGEM_ENUM.DADOS_GERAIS && <AbaDadosGerais />}
    {tabSelecionada === ABAS_TELA_VIAGEM_ENUM.OCORRENCIAS && <AbaOcorrencias />}
    {tabSelecionada === ABAS_TELA_VIAGEM_ENUM.DOCUMENTOS_FISCAIS && <AbaDocumentosFiscais />}
  </div>
}
