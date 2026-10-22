/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Trip } from "../types";
import { STATUS_CONFIG } from "../constants";
import { cn } from "@/src/lib/utils";
import { Clock, MapPin, ChevronRight } from "lucide-react";

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
  isSelected?: boolean;
}

export function TripCard({ trip, onClick, isSelected }: TripCardProps) {
  const status = STATUS_CONFIG[trip.status] || STATUS_CONFIG.PRE_VIAGEM;

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl shadow-sm border p-3 transition-all cursor-pointer group",
        isSelected
          ? "border-primary ring-1 ring-primary/10 shadow-md shadow-primary/5"
          : "border-gray-100 hover:border-primary/30",
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="max-w-[150px]">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {trip.codigo !== undefined && trip.codigo !== 0 && (
              <span className="text-[10px] font-black text-primary bg-primary/10 px-1 rounded">
                #{trip.codigo}
              </span>
            )}
            <h3 className="font-bold text-xs text-gray-800 group-hover:text-primary transition-colors truncate">
              {trip.nomeLinha || "Linha Extra"}
            </h3>
          </div>
          <div className="mt-0.5">
            <span
              className={cn(
                "inline-block text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider",
                trip.tipoTransferencia === "Extra" ||
                  trip.tipoViagem === "Extra"
                  ? "text-purple-700 bg-purple-50 border-purple-200/60"
                  : "text-blue-700 bg-blue-50 border-blue-200/60",
              )}
            >
              {trip.tipoTransferencia === "Extra" || trip.tipoViagem === "Extra"
                ? "Extra"
                : trip.tipoTrecho === "Vazio"
                  ? "Vazio"
                  : "Transferência"}
            </span>
          </div>
          <p className="text-[9px] text-gray-500 flex items-center gap-1 mt-0.5">
            <Clock className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">
              {(() => {
                const isExtra =
                  trip.tipoTransferencia === "Extra" ||
                  trip.tipoViagem === "Extra";
                if (!isExtra) {
                  // Escala: always show date + time
                  if (trip.dataViagem) {
                    const parts = trip.dataViagem.split("T")[0].split("-");
                    if (parts.length === 3) {
                      return `${parts[2]}/${parts[1]}/${parts[0]} ${trip.horarioSaida || "--:--"}`;
                    }
                    return `${trip.dataViagem} ${trip.horarioSaida || "--:--"}`;
                  }
                  return `--/--/---- ${trip.horarioSaida || "--:--"}`;
                } else {
                  // Extra: show date + time only when filled
                  if (trip.dataViagem && trip.dataViagem !== "") {
                    const parts = trip.dataViagem.split("T")[0].split("-");
                    if (parts.length === 3) {
                      return `${parts[2]}/${parts[1]}/${parts[0]} ${trip.horarioSaida || "--:--"}`;
                    }
                    return `${trip.dataViagem} ${trip.horarioSaida || "--:--"}`;
                  }
                  return "Aguardando data";
                }
              })()}
            </span>
          </p>
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

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-primary">
              {trip.agenciaOrigemSigla || "???"}
            </span>
            <span className="text-[8px] text-gray-400 font-medium">ORI</span>
          </div>
          <div className="flex-1 h-[1px] w-6 bg-gray-200 relative">
            <ChevronRight className="w-3 h-3 text-gray-300 absolute -right-1.5 top-1/2 -translate-y-1/2" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-primary">
              {trip.agenciaDestinoSigla || "???"}
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
