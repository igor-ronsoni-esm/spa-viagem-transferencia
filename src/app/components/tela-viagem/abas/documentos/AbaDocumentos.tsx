"use client";

import Descarregamentos from "./descarregamentos/Descarregamentos";
import DocumentosHeader from "./DocumentosHeader";
import { cn } from "@modules/utils/css.util";
import { useFormContext, useWatch } from "react-hook-form";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import ApresentarControles from "./controles/ApresentarControles";
import { useFormularioContext } from "@contexts/formulario/FormularioProvider";

export default function AbaDocumentos() {
  const { modoEdicao } = useFormularioContext();
  const { control } = useFormContext<ViagemOutput>();
  const documentos = useWatch({ control, name: "documentos" });

  const handleSelecionarTodos = () => {}
  const handleRemoverMarcados = () => {}

  const controles = documentos.flatMap(field => field.descarregamento.controles);
  const marcados = controles.filter(controle => controle.marcado);
  
  return (
    <div className="flex flex-col flex-1 gap-4">
      <Descarregamentos />
      <DocumentosHeader />

      <div className="flex items-center justify-between px-1">
        <label
          className={cn(
            "flex items-center gap-2 select-none",
            modoEdicao && (controles || []).length > 0
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-60"
          )}
        >
          <input
            type="checkbox"
            checked={
              (controles || []).length > 0 &&
              marcados.length === (controles || []).length
            }
            onChange={handleSelecionarTodos}
            disabled={(controles || []).length === 0 || !modoEdicao}
            className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer disabled:cursor-not-allowed"
          />
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
            Marcar Todos ({marcados.length}/{(controles || []).length})
          </span>
        </label>

        {marcados.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
              {marcados.length} documento(s) marcado(s) para remoção
            </span>
            {modoEdicao && (
              <button
                type="button"
                onClick={handleRemoverMarcados}
                className="text-[10px] font-black text-red-600 hover:text-red-700 underline uppercase cursor-pointer"
              >
                Remover agora
              </button>
            )}
          </div>
        )}
      </div>
      <ApresentarControles />
    </div>
  )
}