"use client";

import { Clock, ChevronRight } from "lucide-react";
import { ViagemOutput } from "@modules/domain/viagem/schemas/resultado-consulta-viagens.schema";
import { STATUS_CONFIG } from "../../constants";
import { cn } from "@modules/utils/css.util";
import { useRouter, useSearchParams } from "next/navigation";
import { isTipoTransferenciaEscala, isTipoTransferenciaExtra, isTipoTransferenciaRotaAlternativa } from "@/src/modules/lib/validacoes";

type Props = {
  viagem: ViagemOutput;
};

export function CardViagem({ viagem }: Readonly<Props>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = viagem.viagem.chaveStatus ? STATUS_CONFIG[viagem.viagem.chaveStatus] || STATUS_CONFIG.DESCONHECIDO : STATUS_CONFIG.SEM_STATUS;

  const onClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("viagem", String(viagem.viagem.execucao.codigo));
    router.push(`?${params.toString()}`);
  };

  const isSelected = searchParams.get("viagem") === String(viagem.viagem.execucao.codigo);
  let tipoViagem = "Extra";
  let cssTipoViagem = "";
  if (isTipoTransferenciaExtra(viagem.viagem.tipoTransferencia)) {
    tipoViagem = "Extra";
    cssTipoViagem = "text-purple-700 bg-purple-50 border-purple-200/60";
  } else if (isTipoTransferenciaEscala(viagem.viagem.tipoTransferencia)) {
    tipoViagem = "Escala";
    cssTipoViagem = "text-blue-700 bg-blue-50 border-blue-200/60";
  } else if (isTipoTransferenciaRotaAlternativa(viagem.viagem.tipoTransferencia)) {
    tipoViagem = "Rota Alternativa";
    cssTipoViagem = "text-purple-700 bg-purple-50 border-purple-200/60";
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col bg-white rounded-xl shadow-sm border p-3 transition-all cursor-pointer group",
        isSelected
          ? "border-primary ring-1 ring-primary/10 shadow-md shadow-primary/5"
          : "border-gray-100 hover:border-primary/30",
      )}
    >
      <div className="flex flex-row justify-between items-center gap-1">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {viagem.viagem.codigo !== undefined && viagem.viagem.codigo !== null && viagem.viagem.codigo !== 0 && (
            <span className="text-[10px] font-black text-primary bg-primary/10 px-1 rounded">
              #{viagem.viagem.codigo}
            </span>
          )}
          <span
            className={cn(
              "inline-block text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider",
              cssTipoViagem,
            )}
          >
            {tipoViagem}
          </span>
        </div>
        <span
          className={cn(
            "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider whitespace-nowrap",
            status.color,
            status.text,
          )}
        >
          {status.label}
        </span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col w-full gap-1">
          <h3 className="font-bold text-xs text-gray-800 group-hover:text-primary transition-colors truncate">
            {viagem.linha.descricao || "Linha Extra"}
          </h3>
          <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
            <Clock className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">
              {(() => {
                const isExtra = isTipoTransferenciaExtra(
                  viagem.viagem.tipoTransferencia,
                );
                if (!isExtra) {
                  if (viagem.viagem.dataSaida) {
                    const parts = viagem.viagem.dataSaida
                      .split("T")[0]
                      .split("-");
                    if (parts.length === 3) {
                      return `${parts[2]}/${parts[1]}/${parts[0]} ${viagem.viagem.dataSaida.split("T")[1] || "--:--"}`;
                    }
                    return `${viagem.viagem.dataSaida} ${viagem.viagem.dataSaida.split("T")[1] || "--:--"}`;
                  }
                  return `--/--/---- ${viagem.viagem.dataSaida.split("T")[1] || "--:--"}`;
                } else {
                  if (
                    viagem.viagem.dataSaida &&
                    viagem.viagem.dataSaida !== ""
                  ) {
                    const parts = viagem.viagem.dataSaida
                      .split("T")[0]
                      .split("-");
                    if (parts.length === 3) {
                      return `${parts[2]}/${parts[1]}/${parts[0]} ${viagem.viagem.dataSaida.split("T")[1] || "--:--"}`;
                    }
                    return `${viagem.viagem.dataSaida} ${viagem.viagem.dataSaida.split("T")[1] || "--:--"}`;
                  }
                  return "Aguardando data";
                }
              })()}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-primary">
              {viagem.origem.sigla || "???"}
            </span>
            <span className="text-[8px] text-gray-400 font-medium">ORI</span>
          </div>
          <div className="flex-1 h-px w-6 bg-gray-200 relative">
            <ChevronRight className="w-3 h-3 text-gray-300 absolute -right-1.5 top-1/2 -translate-y-1/2" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-primary">
              {viagem.destino.sigla || "???"}
            </span>
            <span className="text-[8px] text-gray-400 font-medium">DES</span>
          </div>
        </div>

        <button
          className={cn(
            "p-1 rounded-lg transition-all cursor-pointer",
            isSelected
              ? "bg-primary text-white"
              : "bg-gray-50 text-gray-300 group-hover:bg-primary group-hover:text-white",
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
