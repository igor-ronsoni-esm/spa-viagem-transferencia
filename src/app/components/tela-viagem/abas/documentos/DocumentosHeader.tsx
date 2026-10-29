"use client";

import { ClipboardList } from "lucide-react";

export default function DocumentosHeader() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
              Documentos da Viagem
            </h3>
          </div>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5">
            Configuração da Linha:{" "}
            <strong className="text-gray-700">
              {trip.agenciaOrigemSigla || "SAO"} ➔{" "}
              {trip.agenciaDestinoSigla || "RIO"}
            </strong>{" "}
            • {trip.nomeLinha || "Linha Principal"}
            {!canEditFields && isEditable && (
              <span className="block text-amber-600 font-semibold mt-0.5">
                * Ações bloqueadas. Clique em "EDITAR VIAGEM" no topo para
                habilitar a gestão de documentos.
              </span>
            )}
          </p>
        </div>

        {/* 3 Ações Principais Solicitadas */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ação 1: Adicionar todos os documentos da linha */}
          <button
            type="button"
            disabled={!canEditFields || loading}
            onClick={handleAddAllLineDocuments}
            title={
              !canEditFields
                ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                : "Buscar e vincular à viagem todos os documentos presentes na empresa que pertencem à configuração desta linha"
            }
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
              canEditFields
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md cursor-pointer active:scale-98"
                : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60",
            )}
          >
            <FolderPlus className="w-3.5 h-3.5 shrink-0" />
            <span>Adicionar Todos da Linha</span>
          </button>

          {/* Ação 2: Escolher documentos para incluir na viagem */}
          <button
            type="button"
            disabled={!canEditFields || loading}
            onClick={openImportModal}
            title={
              !canEditFields
                ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                : "Abre modal para escolher quais documentos incluir na viagem (apenas da linha ou todos da empresa)"
            }
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
              canEditFields
                ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20 hover:shadow-md cursor-pointer active:scale-98"
                : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60",
            )}
          >
            <ListPlus className="w-3.5 h-3.5 shrink-0" />
            <span>Escolher Documentos</span>
          </button>

          {/* Ação 3: Remover documentos da viagem */}
          <button
            type="button"
            disabled={!canEditFields || markedControleIds.size === 0 || loading}
            onClick={handleRemoveMarkedControles}
            title={
              !canEditFields
                ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                : markedControleIds.size === 0
                  ? "Marque os documentos na lista para remover"
                  : `Remover ${markedControleIds.size} documento(s) marcado(s) da viagem`
            }
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
              canEditFields && markedControleIds.size > 0
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 hover:shadow-md cursor-pointer active:scale-98"
                : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60",
            )}
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>
              Remover Documentos{" "}
              {markedControleIds.size > 0 ? `(${markedControleIds.size})` : ""}
            </span>
          </button>
        </div>
      </div>

      {/* Linha auxiliar: busca rápida por chave e indicadores */}
      <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 max-w-sm w-full relative">
          <input
            type="text"
            disabled={!canEditFields}
            placeholder="Vincular chave de controle manual..."
            className={cn(
              "w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-8",
              canEditFields
                ? "bg-white border-gray-200 hover:border-gray-300 text-gray-800"
                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60",
            )}
            value={controleKey}
            onChange={(e) => setControleKey(e.target.value)}
            onKeyDown={addControleByKey}
          />
          <button
            type="button"
            disabled={!canEditFields || !controleKey}
            onClick={performAddControle}
            className="absolute right-1.5 top-1 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-primary transition-colors cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title={
              !canEditFields
                ? "Habilite a edição para vincular chaves"
                : "Buscar e vincular chave"
            }
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-black">
            {(trip.controlesCarga || []).length} Controles
          </span>
          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-black">
            {(trip.ctes || []).length} CT-es
          </span>
          <span className="text-gray-600 font-mono">
            Total: R${" "}
            {(trip.ctes || [])
              .reduce((s, c) => s + (c.valor || 0), 0)
              .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
