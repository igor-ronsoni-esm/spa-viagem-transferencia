"use client";

import { Clipboard } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { cn } from "@modules/utils/css.util";

import { useFormularioContext } from "@contexts/formulario/FormularioProvider";
import { TipoViagemEnum, TipoViagemEnumOutput } from "@modules/domain/viagem/schemas/dados-viagem/tipo-viagem.schema";
import { EXTRA_TIPO_TRADUCAO, TIPO_TRANSFERENCIA_TRADUCAO, TIPO_VIAGEM_TRADUCAO } from "@constants/traducao";
import { TipoTransferenciaEnum } from "@modules/domain/viagem/schemas/dados-viagem/tipo-transferencia.schema";

export default function DadosBasicos() {
  const { modoEdicao } = useFormularioContext();
  const { register, watch } = useFormContext<ViagemOutput>();

  const isTipoEscala = watch("tipoTransferencia") === TipoTransferenciaEnum.ESCALA;
  const isTipoExtra = watch("tipoTransferencia") === TipoTransferenciaEnum.EXTRA;

  const podeEditarTipoViagem = modoEdicao;
  const podeEditarTipoTransferencia = modoEdicao && !isTipoEscala;
  const podeEdicarDataViagem = modoEdicao && !isTipoEscala;
  const podeEditarTipoExtra = modoEdicao && isTipoExtra;
  
  const handleMudarTipoViagem = (value: TipoViagemEnumOutput) => {}

  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-100 p-4 shadow-xs space-y-4 w-full h-auto">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
        <Clipboard className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
          Dados Básicos da Viagem
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-[10px] font-black text-gray-500 mb-0.5 uppercase tracking-wider">
            Código Viagem
          </label>
          <input
            type="number"
            disabled={true}
            {...register("codigo")}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 cursor-not-allowed font-bold text-gray-400 select-none pointer-events-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Data da Viagem
          </label>
          <input
            type="date"
            disabled={!podeEdicarDataViagem}
            {...register("dataViagem")}
            className={cn(
              "w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all",
              podeEdicarDataViagem
                ? "bg-white text-gray-850 cursor-text"
                : "bg-gray-50 text-gray-500 cursor-not-allowed select-none pointer-events-none",
            )}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Tipo de Viagem
          </label>
          <select
            disabled={!podeEditarTipoViagem}
            {...register("tipoViagem")}
            onChange={(e) => handleMudarTipoViagem(e.target.value as TipoViagemEnumOutput)}
            className={cn(
              "w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all",
              podeEditarTipoViagem
                ? "bg-white text-gray-800 cursor-pointer"
                : "bg-gray-50 text-gray-500 cursor-not-allowed",
            )}
          >
            {Object.values(TipoViagemEnum).map((tipo) => (
              <option key={tipo} value={tipo}>
                {TIPO_VIAGEM_TRADUCAO[tipo].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Tipo Transferência
          </label>
          <select
            disabled={!podeEditarTipoTransferencia}
            {...register("tipoTransferencia")}
            className={cn(
              "w-full border border-gray-200 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all",
              podeEditarTipoTransferencia
                ? "bg-white text-gray-800 cursor-pointer"
                : "bg-gray-50 text-gray-500 cursor-not-allowed select-none pointer-events-none",
            )}
          >
            {Object.values(TipoTransferenciaEnum).map((tipo) => (
              <option key={tipo} value={tipo}>
                {TIPO_TRANSFERENCIA_TRADUCAO[tipo].label}
              </option>
            ))}
          </select>
        </div>
        {watch("tipoTransferencia") === TipoTransferenciaEnum.EXTRA && (
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-primary mb-0.5 uppercase tracking-wider flex items-center gap-1.5">
              Extra Tipo
              <span className="text-[9px] font-medium text-gray-400 normal-case">
                (motivo da viagem extra)
              </span>
            </label>
            <select
              disabled={!podeEditarTipoExtra}
              {...register("extraTipo")}
              className={cn(
                "w-full border rounded-lg p-1.5 text-xs focus:ring-2 outline-none font-medium transition-all",
                podeEditarTipoExtra
                  ? "bg-white border-primary/40 text-gray-800 cursor-pointer focus:ring-primary/20"
                  : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed select-none pointer-events-none",
              )}
            >
              {Object.values(EXTRA_TIPO_TRADUCAO).map((motivo, index) => (
                <option key={index} value={index + 1}>
                  {motivo.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
