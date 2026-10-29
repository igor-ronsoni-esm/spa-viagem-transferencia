"use client";

import { useContext, useState } from "react";
import { ViagemContext } from "../../context/ViagemContext";
import { useFieldArray, useFormContext } from "react-hook-form";
import { MotoristaTipoEnum, ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { Plus, Users } from "lucide-react";
import { cn } from "@/src/modules/utils/css.util";
import SelecaoModal from "../../modals/SelecaoModal";
import FastcrudConsultasConfig from "@/src/configs/environment/fastcrud-consultas.config";

export default function DadosMotoristas() {
  const [modalSelecaoMotoristaOpen, setModalSelecaoMotoristaOpen] = useState<boolean>(false);

  const { modoEdicao } = useContext(ViagemContext);
  const { watch, control } = useFormContext<ViagemOutput>();
  const { fields: motoristas, update } = useFieldArray({ control, name: "motoristas" });

  const alterarMotoristaPrincipal = (index: number) => {
    const indexMotoristaAtual = motoristas.findIndex((m) => m.tipo === MotoristaTipoEnum.TITULAR);

    const motoristaPrincipal = motoristas[indexMotoristaAtual];
    const motoristaSelecionado = motoristas[index];

    update(indexMotoristaAtual, { ...motoristaPrincipal, tipo: motoristaSelecionado.tipo });
    update(index, { ...motoristaSelecionado, tipo: MotoristaTipoEnum.TITULAR });
  };

  const semMotoristaSelecionado = 
    motoristas === null || 
    motoristas === undefined || 
    motoristas?.length === 0 || 
    !motoristas?.some((v) => v.tipo === MotoristaTipoEnum.TITULAR);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-50 mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
              Lista de Motoristas
            </h4>
          </div>
          <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {motoristas?.length ?? 0}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {motoristas?.map((motorista, index) => (
            <div
              key={motorista.codigo}
              className="flex items-center justify-between p-2 bg-gray-50/50 rounded-lg border border-gray-50"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-700 leading-tight">
                  {motorista.funcionario.nome}
                </span>
                <span className="text-[9px] text-gray-400 font-medium">
                  Código: {motorista.funcionario.codigo}
                </span>
              </div>

              {modoEdicao ? (
                <button
                  type="button"
                  onClick={() => alterarMotoristaPrincipal(index)}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-tighter cursor-pointer transition-all",
                    motorista.tipo === MotoristaTipoEnum.TITULAR
                      ? "bg-primary text-white shadow-xs"
                      : "bg-gray-200 text-gray-500",
                  )}
                >
                  {motorista.tipo}
                </button>
              ) : (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-tighter",
                    motorista.tipo === MotoristaTipoEnum.TITULAR
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400",
                  )}
                >
                  {motorista.tipo}
                </span>
              )}
            </div>
          ))}

          {semMotoristaSelecionado && (
            <p className="text-[10px] text-gray-400 italic text-center py-4 bg-gray-50/20 rounded-lg">
              Nenhum motorista selecionado
            </p>
          )}
        </div>
      </div>

      {modoEdicao && (
        <button
          type="button"
          onClick={() => setModalSelecaoMotoristaOpen(true)}
          className="w-full border-2 border-dashed border-primary/20 hover:border-primary/50 text-primary/80 hover:text-primary rounded-lg py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
        >
          <Plus className="w-3.5 h-3.5" /> Selecionar Motorista(s)
        </button>
      )}
      <SelecaoModal
        open={modalSelecaoMotoristaOpen}
        chave={FastcrudConsultasConfig.get().buscarMotoristas}
        onClose={() => setModalSelecaoMotoristaOpen(false)}
        titulo="Seleção de Motorista"
        onSelect={(row) => {
          console.log(row);
        }}
        filtrosFixos={[
          { field: "EMP_CODIGO", operation: "=", value: String(watch("codigoAgencia")) },// Validar quando é possivel buscar todos os motoristas
        ]}
      />
    </div>
  );
}
