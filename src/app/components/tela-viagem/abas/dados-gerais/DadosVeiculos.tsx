"use client";

import { useContext, useState } from "react";
import { ViagemContext } from "../../context/ViagemContext";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { Plus, Truck } from "lucide-react";
import FastcrudConsultasConfig from "@configs/environment/fastcrud-consultas.config";
import SelecaoModal from "../../modals/SelecaoModal";
import { cn } from "@modules/utils/css.util";

export default function DadosVeiculos() {
  const [modalSelecaoVeiculoOpen, setModalSelecaoVeiculoOpen] = useState<boolean>(false);

  const { modoEdicao } = useContext(ViagemContext);
  const { watch, control } = useFormContext<ViagemOutput>();
  const { fields: veiculos } = useFieldArray({ control, name: "veiculos" });
  
  const semVeiculoSelecionado = 
    veiculos === null || 
    veiculos === undefined || 
    veiculos?.length === 0 || 
    !veiculos?.some((v) => v.principal);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-50 mb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
              Lista de Veículos para a Viagem
            </h4>
          </div>
          <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {veiculos?.length ?? 0}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {veiculos?.map((frota) => (
            <div
              key={frota.codigo}
              className="flex items-center gap-3 p-2 bg-gray-50/50 rounded-lg border border-gray-50 text-left"
            >
              <div className="w-8 h-8 rounded bg-white border border-gray-100 overflow-hidden flex shrink-0 items-center justify-center text-gray-400 font-bold text-xs uppercase">
                <Truck className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex flex-1 flex-col min-w-0 gap-1">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-gray-700">
                    {frota.veiculo.placa}
                  </span>
                  <span className="text-[10px] font-black bg-gray-200 text-gray-600 px-1 rounded uppercase tracking-tighter">
                    {frota.veiculo.tipo}
                  </span>
                  
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-400 truncate">
                    {frota.veiculo.codigo} | {frota.veiculo.descricao}
                  </span>
                  <span className={cn("text-[10px] font-black bg-gray-200 px-1 rounded uppercase tracking-tighter", 
                    frota.principal ? 
                      "bg-primary text-white shadow-xs" : "bg-gray-200 text-gray-500"
                      )}>
                    {frota.principal ? "PRINCIPAL" : "SECUNDÁRIO"}
                  </span>
                </div>
               
              </div>
            </div>
          ))}

          {semVeiculoSelecionado && (
            <p className="text-[10px] text-gray-400 italic text-center py-4 bg-gray-50/20 rounded-lg">
              Nenhum veículo selecionado
            </p>
          )}
        </div>
      </div>

      {modoEdicao && (
        <button
          type="button"
          onClick={() => setModalSelecaoVeiculoOpen(true)}
          className="w-full border-2 border-dashed border-primary/20 hover:border-primary/50 text-primary/80 hover:text-primary rounded-lg py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
        >
          <Plus className="w-3.5 h-3.5" /> Selecionar Veículo(s)
        </button>
      )}
      <SelecaoModal
        open={modalSelecaoVeiculoOpen}
        chave={FastcrudConsultasConfig.get().buscarVeiculos}
        onClose={() => setModalSelecaoVeiculoOpen(false)}
        titulo="Seleção de Veículo"
        onSelect={(row) => {
          console.log(row);
        }}
        filtrosFixos={[
          { field: "EMP_CODIGO", operation: "=", value: String(watch("codigoAgencia")) },// Validar quando é possivel buscar todos os veiculos
        ]}
      />
    </div>
  );
}