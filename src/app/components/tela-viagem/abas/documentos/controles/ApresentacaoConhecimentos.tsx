"use client";

import { TIPO_INCLUSAO_CONTROLE_TRADUCAO } from "@constants/traducao";
import { ControleOutput } from "@modules/domain/viagem/schemas/dados-viagem/documentos/controle.schema";
import { TipoInclusaoControleEmViagemEnum } from "@modules/domain/viagem/schemas/dados-viagem/documentos/tipo-inclusao.schema";
import { TipoPesoM3Enum } from "@modules/domain/viagem/schemas/dados-viagem/documentos/tipo-medida.schema";
import { cn } from "@modules/utils/css.util";
import { dataHoraISO } from "@modules/utils/data.util";
import { useState } from "react";

type Props = {
  grupo: GrupoDestino;
}

type GrupoDestino = {
  destino: string;
  controles: ControleOutput[];
};

export default function ApresentacaoConhecimentos({ grupo }: Readonly<Props>) {
  const [minimizado, setMinimizado] = useState<boolean>(true);

  const handleExibirDestinos = () => setMinimizado(!minimizado);

  return (
    <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/30 space-y-2" >
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-gray-800 font-mono">
            Destino : {grupo.destino}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExibirDestinos}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[9px] font-bold uppercase text-gray-600 flex items-center gap-1 cursor-pointer transition-colors"
          >
            {!minimizado
              ? "Minimizar ▲"
              : "Expandir ▼"}
          </button>
        </div>
      </div>

      {!minimizado && (
        <div className="space-y-2 pt-1 animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100/70 border-b border-gray-200 text-[9px] font-black text-gray-600 uppercase tracking-wider">
                  <th className="p-2">Controle de Viagem</th>
                  <th className="p-2">Nº Conhecimento</th>
                  <th className="p-2">Volumes</th>
                  <th className="p-2">Peso</th>
                  <th className="p-2">Tipo Pesagem</th>
                  <th className="p-2">Valor Total</th>
                  <th className="p-2">Emissão</th>
                  <th className="p-2">Remetente</th>
                  <th className="p-2">Origem Vínculo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(grupo.controles || []).map((controle) => {
                  return (controle.ctes || []).map((cte, index) => (
                    <tr key={index} className="hover:bg-white transition-colors text-[12px]">
                      <td className="p-2 font-mono font-bold text-gray-800">{controle.chave}</td>
                      <td className="p-2 font-mono font-bold text-gray-800">{cte.numero}</td>
                      <td className="p-2 font-semibold text-gray-700">{cte.quantidade}</td>
                      <td className="p-2 font-semibold text-gray-700">{(cte.tipoPesoM3 === TipoPesoM3Enum.PESO ? cte.peso : cte.m3).toFixed(3)}</td>
                      <td className="p-2">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                            cte.tipoPesoM3 === TipoPesoM3Enum.M3
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800",
                          )}
                        >
                          {cte.tipoPesoM3}
                        </span>
                      </td>
                    <td className="p-2 font-bold font-mono text-emerald-700">
                      R${" "}
                      {(cte.valor || 0).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-2 text-gray-600">{dataHoraISO(new Date(cte.dataEmissao))}</td>
                    <td className="p-2 text-gray-700 font-medium truncate max-w-30">{cte.remetente.descricao}</td>
                    <td className="p-2">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                          controle.tipoInclusao === TipoInclusaoControleEmViagemEnum.AUTOMATICO
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : controle.tipoInclusao === TipoInclusaoControleEmViagemEnum.MANUAL_GESTAO
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200",
                        )}
                      >
                        {TIPO_INCLUSAO_CONTROLE_TRADUCAO[controle.tipoInclusao]?.label || TIPO_INCLUSAO_CONTROLE_TRADUCAO["MANUAL_VIAGEM"].label}
                      </span>
                    </td>
                  </tr>
                  ))
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}