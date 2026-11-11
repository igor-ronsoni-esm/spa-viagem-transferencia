"use client";

import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { cn } from "@modules/utils/css.util";
import { ABAS_TELA_VIAGEM_ENUM } from "@constants/enum";
import { TipoViagemEnum } from "@modules/domain/viagem/schemas/dados-viagem/tipo-viagem.schema";
import { useFormularioContext } from "@contexts/formulario/FormularioProvider";
import { useFormContext } from "react-hook-form";

export default function TabsViagem() {
  const { tabSelecionada, setTabSelecionada } = useFormularioContext();
  const { watch } = useFormContext<ViagemOutput>();

  const isTipoVazio = watch("tipoViagem") === TipoViagemEnum.VAZIO;

  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 border-t border-gray-200/50">
      {Object.values(ABAS_TELA_VIAGEM_ENUM).map((tab) => {
        const isTabDesabilitada = tab === ABAS_TELA_VIAGEM_ENUM.DOCUMENTOS && isTipoVazio;

        return (
          <button
            key={tab}
            type="button"
            disabled={isTabDesabilitada}
            onClick={() =>
              !isTabDesabilitada &&
              setTabSelecionada(tab as ABAS_TELA_VIAGEM_ENUM)
            }
            className={cn(
              "px-3 py-1.5 text-[10px] font-bold rounded-md transition-all capitalize cursor-pointer",
              tabSelecionada === tab
                ? "bg-primary text-white shadow-xs"
                : "text-gray-500 hover:bg-gray-200",
              isTabDesabilitada &&
                "opacity-40 cursor-not-allowed hover:bg-transparent",
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
