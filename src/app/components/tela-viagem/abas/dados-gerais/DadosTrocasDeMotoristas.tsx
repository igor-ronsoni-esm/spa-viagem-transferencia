"use client";

import { Users } from "lucide-react";

export default function DadosTrocasDeMotoristas() {
  return (
    <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100/50">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
            Troca de Motorista (Opção de Troca)
          </h4>
        </div>
        <span className="text-[8px] font-black bg-gray-200 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">
          INATIVO
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 opacity-50 cursor-not-allowed">
        <div>
          <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Código
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            placeholder="Nenhum"
            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-500 select-none pointer-events-none"
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Sigla
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            placeholder="Selecione..."
            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-500 select-none pointer-events-none"
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Unidade / Ponto de Controle
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            placeholder="Não aplicável"
            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-500 select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
