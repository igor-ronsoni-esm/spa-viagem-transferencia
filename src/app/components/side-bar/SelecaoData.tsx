"use client";

import { cn } from "@modules/utils/css.util";
import { Tooltip } from "@mui/material";
import { CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function SelecaoData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputDataRef = useRef<HTMLInputElement>(null);

  const abrirSeletor = () => {
    const input = inputDataRef.current;
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      input.focus();
      input.click();
    }
  };
  const dataSelecionada = searchParams.get("data");

  const hoje = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  const dataBase = dataSelecionada || hoje;

  const [ano, mes, dia] = dataBase.split("-").map(Number);
  const dataReferencia = new Date(ano, mes - 1, dia, 12);

  const inicioSemana = new Date(dataReferencia);
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());

  const formatarData = (data: Date) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicioSemana);
    d.setDate(d.getDate() + i);

    return {
      full: formatarData(d),
      day: d.getDate(),
      month: d
        .toLocaleString("pt-BR", { month: "short" })
        .toUpperCase()
        .replace(".", ""),
      weekday: d
        .toLocaleString("pt-BR", { weekday: "short" })
        .toUpperCase()
        .replace(".", ""),
    };
  });

  const handleAlterarDataSelecionada = (data: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("data", data);

    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 relative overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5">
          {days.map((d) => (
            <button
              key={d.full}
              type="button"
              onClick={() => handleAlterarDataSelecionada(d.full)}
              aria-pressed={dataBase === d.full}
              className={cn(
                "flex flex-col items-center min-w-8.5 p-1 rounded-lg transition-all cursor-pointer border relative group",
                dataBase === d.full
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "bg-white border-gray-100 text-gray-400 hover:border-primary/30",
              )}
            >
              <span className="text-[7px] font-black leading-tight">
                {d.weekday}
              </span>

              <span className="text-[11px] font-black leading-tight">
                {d.day}
              </span>

              <span className="text-[7px] font-bold leading-tight opacity-70">
                {d.month}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Tooltip title="Selecionar data escala" arrow>
        <button
          type="button"
          onClick={abrirSeletor}
          className="relative group shrink-0 cursor-pointer"
        >
          <CalendarIcon className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors pointer-events-none" />

          <input
            ref={inputDataRef}
            type="date"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full sr-only"
            value={dataBase}
            onChange={(e) => {
              const novaData = e.target.value;

              if (novaData) {
                handleAlterarDataSelecionada(novaData);
              }
            }}
          />
        </button>
      </Tooltip>
    </div>
  );
}
