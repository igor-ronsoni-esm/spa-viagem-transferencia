"use client";

import { useFormularioContext } from "@contexts/formulario/FormularioProvider";
import { useViagemContext } from "@contexts/viagem/ViagemProvider";
import { OcorrenciaViagemEnum, OcorrenciaViagemEnumOutput } from "@modules/domain/viagem/schemas/dados-viagem/ocorrencia/ocorrencias.schema";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { Tooltip } from "@mui/material";
import { Edit, Play, RefreshCw, Save, Trash2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import CancelarEdicaoModal from "./modals/CancelarEdicaoModal";
import { cn } from "@modules/utils/css.util";

export default function AcoesViagem() {
  const [cancelarModalOpen, setCancelarModalOpen] = useState<boolean>(false);

  const {
    modoEdicao,
    loading,
    handleEditarViagem,
    handleCancelarEdicao,
  } = useFormularioContext();
  const { handleGerarViagem, handleCancelarViagem, handleIniciarManualmente, handleResetarViagem } = useViagemContext();
  const searchParams = useSearchParams();
  const { watch } = useFormContext<ViagemOutput>();

  const STATUS_PERMITE_CANCELAR: OcorrenciaViagemEnumOutput[] = [
    OcorrenciaViagemEnum.PRE_VIAGEM,
    OcorrenciaViagemEnum.VIAGEM_DISPONIBILIZADA,
    OcorrenciaViagemEnum.VIAGEM_INICIADA,
  ];

  const STATUS_PERMITE_INICIAR: OcorrenciaViagemEnumOutput[] = [OcorrenciaViagemEnum.VIAGEM_DISPONIBILIZADA];

  const viagem = watch();

  const viagemExiste = viagem.codigo !== null && viagem.codigo !== undefined && viagem.codigo !== 0;
  const podeEditar = viagem.status === OcorrenciaViagemEnum.PRE_VIAGEM || viagem.status === null;
  const podeCancelarViagem = STATUS_PERMITE_CANCELAR.includes(viagem.status);
  const podeIniciarManualmente = STATUS_PERMITE_INICIAR.includes(viagem.status);
    
  const validarModoEdicao = () => {
    if (searchParams.get("modoEdicao") === "true" && !modoEdicao) {
      handleCancelarEdicao();
    }
  };

  useEffect(() => {
    validarModoEdicao();
  }, []);

  return (
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
            onClick={() => setCancelarModalOpen(true)}
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

          {podeEditar && viagemExiste && (
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

          {podeCancelarViagem && viagemExiste && (
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
      
      <CancelarEdicaoModal 
        open={cancelarModalOpen}
        codigoViagem={viagem.codigo ?? null}
        handleCancelar={() => setCancelarModalOpen(false)}
        handleConfirmar={() => {
          handleCancelarEdicao();
          setCancelarModalOpen(false);
        }}
      />
    </div>
  );
}
