"use client";

import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";
import UnidadeDescarregamento from "./UnidadeDescarregamento";
import { Plus, Truck } from "lucide-react";
import { useFormularioContext } from "@contexts/formulario/FormularioProvider";

export default function Descarregamentos() {
  const [maximizado, setMaximizado] = useState<boolean>(false);

  const { modoEdicao } = useFormularioContext();
  const { control } = useFormContext<ViagemOutput>();
  const { fields: descarregamentos } = useFieldArray({ control, name: "descarregamentos" });

  const handleAdicionarDescarregamento = () => {}

  return (
    <div className="bg-white rounded-xl border border-primary/20 p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              Descarregamentos da Viagem
              <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {(descarregamentos || []).length}
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {modoEdicao && (
            <button
              type="button"
              onClick={handleAdicionarDescarregamento}
              className="px-3 py-1.5 bg-primary text-white text-[10px] font-black uppercase rounded-lg hover:bg-primary-hover shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Descarregamento
            </button>
          )}
          <button
            type="button"
            onClick={() => setMaximizado(!maximizado)}
            className="px-2.5 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors"
          >
            {maximizado ? "Minimizar ▲" : "Expandir ▼"}
          </button>
        </div>
      </div>

      {maximizado && (
        <div className="space-y-3 pt-1">
          {(descarregamentos || []).length === 0 ? (
            <div className="p-6 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-400 font-medium italic mb-2">
                Nenhum descarregamento cadastrado para esta viagem.
              </p>
              {modoEdicao ? (
                <button
                  type="button"
                  onClick={handleAdicionarDescarregamento}
                  className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Incluir primeiro
                  descarregamento
                </button>
              ) : (
                <p className="text-[10px] text-amber-600 font-semibold">
                  Clique em "EDITAR VIAGEM" no topo para poder incluir
                  descarregamentos.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest w-[20%]">
                      Situação
                    </th>
                    <th className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest w-[35%]">
                      Empresa (Sigla - Nome)
                    </th>
                    <th className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest w-[25%]">
                      Tempo do Percurso
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {descarregamentos.map((descarregamento) => (
                    <UnidadeDescarregamento key={descarregamento.id} descarregamento={descarregamento} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
