"use client"

import { ControleOutput, ViagemOutput } from "@/src/modules/domain/viagem/schemas/viagem.schema";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import Controle from "./Controle";

type Props = {
  index: number;
};

export default function ControlesPorDescarregamento({ index }: Readonly<Props>) {
  const [maximizado, setMaximizado] = useState<boolean>(false);
  
  const { control } = useFormContext<ViagemOutput>();
  const informacoes = useWatch({ control, name: `documentos.${index}.descarregamento` });
  
  const handleExibirControles = () => setMaximizado(!maximizado);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs space-y-3 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 bg-gray-50/70 p-3 rounded-lg">
        <div className="flex items-center gap-2.5">
          <div>
            <span className="text-[11px] font-black text-gray-900 uppercase block">
              Descarregamento :  {informacoes.destino || "Empresa Destino"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExibirControles}
            className="px-2.5 py-1 bg-gray-200/80 hover:bg-gray-300 rounded text-[9px] font-black uppercase text-gray-700 cursor-pointer transition-colors"
          >
            {maximizado
              ? "Minimizar ▲"
              : "Expandir ▼"}
          </button>
        </div>
      </div>

      {maximizado &&
        (informacoes.controles.length === 0 ? (
          <p className="text-[10px] text-gray-400 italic py-2 text-center">
            Nenhum controle de carga atribuído a este descarregamento.
          </p>
        ) : (
          <div className="space-y-3">
            <Controle controles={informacoes.controles} />
          </div>
        ))}
    </div>
  );
}
