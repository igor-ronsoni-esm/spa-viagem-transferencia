"use client";

import { ClipboardList, FolderPlus, ListPlus, Search, Trash2 } from "lucide-react";
import { useContext, useState } from "react";
import { ViagemContext } from "../../context/ViagemContext";
import { cn } from "@/src/modules/utils/css.util";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ViagemOutput } from "@/src/modules/domain/viagem/schemas/viagem.schema";

export default function DocumentosHeader() {
  const [modalSelecionarDocumentosOpen, setModalSelecionarDocumentosOpen] = useState<boolean>(false);
  const [chaveControle, setChaveControle] = useState<string>("");

  const { modoEdicao, loading } = useContext(ViagemContext);
  const { control } = useFormContext<ViagemOutput>();
  const { fields: documentos } = useFieldArray({ control, name: "documentos" });

  const handleAdicionarTodosDocumentosDisponiveis = () => {}
  const handleRemoverControlesMarcados = () => {}
  const handleAdicionarControle = () => {}
  
  const marcados = documentos.filter(field => field.descarregamento.controles.some(controle => controle.marcado));

  const controles = documentos.flatMap(field => field.descarregamento.controles);
  const pesoTotal = controles.reduce((total, controle) => 
    total + 
      (controle.ctes?.reduce((subTotal, cte) => subTotal + cte.peso, 0) ?? 0) + 
      (controle.nfes?.reduce((subTotal, nfe) => subTotal + nfe.peso, 0) ?? 0), 0);
  const m3Total = controles.reduce((total, controle) => 
    total + 
      (controle.ctes?.reduce((subTotal, cte) => subTotal + cte.m3, 0) ?? 0) + 
      (controle.nfes?.reduce((subTotal, nfe) => subTotal + nfe.m3, 0) ?? 0), 0);
  const quantidadeCtes = controles.reduce((total, controle) => total + (controle.ctes?.length ?? 0), 0);
  const quantidadeNfes = controles.reduce((total, controle) => total + (controle.nfes?.length ?? 0), 0);
  const quantidadeVolumes = controles.reduce((total, controle) => 
    total + 
      (controle.ctes?.reduce((subTotal, cte) => subTotal + cte.quantidade, 0) ?? 0) + 
      (controle.nfes?.reduce((subTotal, nfe) => subTotal + nfe.quantidade, 0) ?? 0), 0);

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
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={!modoEdicao || loading}
            onClick={handleAdicionarTodosDocumentosDisponiveis}
            title={
              !modoEdicao
                ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                : "Buscar e vincular à viagem todos os documentos presentes na empresa que pertencem à configuração desta linha"
            }
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
              modoEdicao
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md cursor-pointer active:scale-98"
                : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60",
            )}
          >
            <FolderPlus className="w-3.5 h-3.5 shrink-0" />
            <span>Adicionar Todos da Linha</span>
          </button>

          <button
            type="button"
            disabled={!modoEdicao || loading}
            onClick={() => setModalSelecionarDocumentosOpen(true)}
            title={
              !modoEdicao
                ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                : "Abre modal para escolher quais documentos incluir na viagem (apenas da linha ou todos da empresa)"
            }
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
              modoEdicao
                ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20 hover:shadow-md cursor-pointer active:scale-98"
                : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60",
            )}
          >
            <ListPlus className="w-3.5 h-3.5 shrink-0" />
            <span>Escolher Documentos</span>
          </button>

          <button
            type="button"
            disabled={!modoEdicao || marcados.length === 0 || loading}
            onClick={handleRemoverControlesMarcados}
            title={
              !modoEdicao
                ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                : marcados.length === 0
                  ? "Marque os documentos na lista para remover"
                  : `Remover ${marcados.length} documento(s) marcado(s) da viagem`
            }
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
              modoEdicao && marcados.length > 0
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 hover:shadow-md cursor-pointer active:scale-98"
                : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60",
            )}
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>
              Remover Documentos{" "}
              {marcados.length > 0 ? `(${marcados.length})` : ""}
            </span>
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 max-w-sm w-full relative">
          <input
            type="text"
            disabled={!modoEdicao}
            placeholder="Vincular chave de controle manual..."
            className={cn(
              "w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-8",
              modoEdicao
                ? "bg-white border-gray-200 hover:border-gray-300 text-gray-800"
                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60",
            )}
            value={chaveControle}
            onChange={(e) => setChaveControle(e.target.value)}
            onKeyDown={handleAdicionarControle}
          />
          <button
            type="button"
            disabled={!modoEdicao || !chaveControle}
            onClick={handleAdicionarControle}
            className="absolute right-1.5 top-1 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-primary transition-colors cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title={
              !modoEdicao
                ? "Habilite a edição para vincular chaves"
                : "Buscar e vincular chave"
            }
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-black">
            {(controles || []).length} Controles
          </span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-black">
              {quantidadeCtes} CT-es
            </span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-black">
              {quantidadeNfes} NF-es
            </span>
            |
            <span className="text-gray-600 font-mono">
              Volumes: {quantidadeVolumes}
            </span>
            |
            <span className="text-gray-600 font-mono">
              Peso Total: {pesoTotal}
            </span>
            |
            <span className="text-gray-600 font-mono">
              M3 Total: {m3Total}
            </span>
            |
        </div>
      </div>
    </div>
  );
}
