"use client";

import {
  OcorrenciaViagem,
  OcorrenciaViagemOutput,
  TipoViagemEnum,
  ViagemOutput,
} from "@modules/domain/viagem/schemas/viagem.schema";
import { Edit, Save, X, Play, RefreshCw, Trash2 } from "lucide-react";
import { useContext } from "react";
import { ViagemContext } from "./context/ViagemContext";
import { cn } from "@modules/utils/css.util";
import { Tooltip } from "@mui/material";
import { ABAS_TELA_VIAGEM_ENUM } from "../../constants";

type Props = {
  viagem: ViagemOutput;
};

export default function TabsViagem({ viagem }: Readonly<Props>) {
  const {
    modoEdicao,
    loading,
    tabSelecionada,
    setTabSelecionada,
    handleEditarViagem,
    handleGerarViagem,
    handleResetarViagem,
    handleCancelarViagem,
    handleCancelarEdicao,
    handleIniciarManualmente,
  } = useContext(ViagemContext);

  const STATUS_PERMITE_CANCELAR: OcorrenciaViagemOutput[] = [
    OcorrenciaViagem.PRE_VIAGEM,
    OcorrenciaViagem.VIAGEM_DISPONIBILIZADA,
    OcorrenciaViagem.VIAGEM_INICIADA,
  ];

  const STATUS_PERMITE_INICIAR: OcorrenciaViagemOutput[] = [OcorrenciaViagem.VIAGEM_DISPONIBILIZADA];

  const viagemEstaGerada =
    viagem.codigo !== null &&
    viagem.codigo !== undefined &&
    viagem.codigo !== 0;
  const podeEditar = viagem.status === OcorrenciaViagem.PRE_VIAGEM || viagem.status === null;
  const podeCancelarViagem = STATUS_PERMITE_CANCELAR.includes(viagem.status);
  const podeIniciarManualmente = STATUS_PERMITE_INICIAR.includes(viagem.status);

  return (
    <div className="bg-gray-50 border-b border-gray-100 px-4 pt-2 flex flex-col gap-2 shrink-0">
      <div className="flex items-center justify-end gap-1.5 flex-wrap">
        {modoEdicao ? (
          <>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md text-[10px] font-bold hover:bg-green-700 disabled:opacity-50 cursor-pointer uppercase shadow-xs"
            >
              <Save className="w-3.5 h-3.5" /> SALVAR
            </button>
            <button
              type="reset"
              onClick={handleCancelarEdicao}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-500 text-white rounded-md text-[10px] font-bold hover:bg-gray-600 disabled:opacity-50 cursor-pointer uppercase shadow-xs"
            >
              <X className="w-3.5 h-3.5" /> CANCELAR
            </button>
          </>
        ) : (
          <>
            {podeEditar && (
              <Tooltip title="Editar os dados da viagem" arrow>
                <span>
                  <button
                    onClick={handleEditarViagem}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-[10px] font-bold hover:bg-blue-700 disabled:opacity-50 cursor-pointer uppercase shadow-xs"
                  >
                    <Edit className="w-3.5 h-3.5" /> EDITAR VIAGEM
                  </button>
                </span>
              </Tooltip>
            )}

            {podeEditar && (
              <Tooltip
                title="Solicitar geração dos documentos fiscais da viagem e disponibilizar viagem para execução"
                arrow
              >
                <span>
                  <button
                    onClick={handleGerarViagem}
                    disabled={loading || !viagem.codigo}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer uppercase shadow-xs",
                      viagem.codigo
                        ? "bg-primary text-white hover:opacity-90"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed",
                    )}
                  >
                    <Play className="w-3.5 h-3.5" /> GERAR VIAGEM
                  </button>
                </span>
              </Tooltip>
            )}

            {podeEditar && viagemEstaGerada && (
              <Tooltip
                title="Resetar todos os dados adicionais da viagem e reiniciar com as configurações padrões"
                arrow
              >
                <span>
                  <button
                    onClick={handleResetarViagem}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[10px] font-bold disabled:opacity-50 cursor-pointer uppercase transition-all shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> RESETAR VIAGEM
                  </button>
                </span>
              </Tooltip>
            )}

            {podeCancelarViagem && viagemEstaGerada && (
              <Tooltip
                title="Cancelar viagem. A ação cancelará os documentos fiscais da viagem e impedirá sua execução"
                arrow
              >
                <span>
                  <button
                    onClick={handleCancelarViagem}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-md text-[10px] font-bold hover:bg-red-700 disabled:opacity-50 cursor-pointer uppercase shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> CANCELAR VIAGEM
                  </button>
                </span>
              </Tooltip>
            )}
          </>
        )}

        {!modoEdicao && podeIniciarManualmente && (
          <Tooltip title="Dar início manualmente à viagem" arrow>
            <span>
              <button
                onClick={handleIniciarManualmente}
                disabled={loading || !podeIniciarManualmente}
                title={
                  !podeIniciarManualmente
                    ? "Aguardando autorização do MDF-e e CIOT"
                    : "Iniciar viagem"
                }
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer uppercase shadow-xs",
                  podeIniciarManualmente
                    ? "bg-purple-600 text-white hover:opacity-90"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed",
                )}
              >
                <Play className="w-3.5 h-3.5" /> INICIAR VIAGEM MANUALMENTE
              </button>
            </span>
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 border-t border-gray-200/50">
        {Object.values(ABAS_TELA_VIAGEM_ENUM).map((tab) => {
          const isTabDisabled = tab === ABAS_TELA_VIAGEM_ENUM.DOCUMENTOS && viagem.tipoViagem === TipoViagemEnum.VAZIO;
          return (
            <button
              key={tab}
              disabled={isTabDisabled}
              onClick={() => !isTabDisabled && setTabSelecionada(tab as ABAS_TELA_VIAGEM_ENUM)}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold rounded-md transition-all capitalize cursor-pointer",
                tabSelecionada === tab
                  ? "bg-primary text-white shadow-xs"
                  : "text-gray-500 hover:bg-gray-200",
                isTabDisabled &&
                  "opacity-40 cursor-not-allowed hover:bg-transparent",
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
