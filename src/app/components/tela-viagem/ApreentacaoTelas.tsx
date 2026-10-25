"use client"

import { useContext, useEffect } from "react";
import { ViagemContext } from "./context/ViagemContext";
import { ABAS_TELA_VIAGEM_ENUM } from "../../constants";
import DadosGerais from "./abas/dados-gerais/DadosGerais";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { useFormContext } from "react-hook-form";

type Props = {
  viagem: ViagemOutput;
}

export default function ApreentacaoTelas({ viagem }: Readonly<Props>) {
  const { tabSelecionada } = useContext(ViagemContext);
  const { reset } = useFormContext();

  useEffect(() => {
    reset(viagem);
  }, [viagem, reset]);

  return <div className="flex flex-1 p-4">
    {tabSelecionada === ABAS_TELA_VIAGEM_ENUM.DADOS_GERAIS && <DadosGerais />}
  </div>
}
