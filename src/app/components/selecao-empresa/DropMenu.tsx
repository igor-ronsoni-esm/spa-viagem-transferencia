"use client";

import { Check, Search, X } from "lucide-react";
import { EmpresaOutput } from '@modules/domain/empresa/schemas/empresa.schema';
import { useEffect, useState } from "react";
import { cn } from "@modules/utils/css.util";
import { useSelecaoEmpresaContext } from "@contexts/empresa/SelecaoEmpresaProvider";
import { useEmpresasContext } from "@contexts/empresas/EmpresasProvider";

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  handleFechar: () => void;
}

export default function DropMenu({ inputRef, handleFechar }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filtrados, setFiltrados] = useState<EmpresaOutput[]>([]);

  const { empresa, handleSelecionarEmpresa } = useSelecaoEmpresaContext();
  const { empresas } = useEmpresasContext();
  
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    setFiltrados(
      empresas.filter((c) => {
        if (!term) return true;
        if (!c.sigla && !c.codigo && !c.descricao) return false;

        return (
          c.sigla?.toLowerCase().includes(term) ||
          c.codigo?.toString().toLowerCase().includes(term) ||
          c.descricao?.toLowerCase().includes(term)
        );
      })
    );
  }, [searchTerm, empresas]);

  return (
    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-72 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="p-2 border-b border-gray-100 bg-gray-50/70">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Consultar por código ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-7 pr-7 py-1.5 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2 pointer-events-none" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between text-[9px] text-gray-400 px-1 pt-1 font-semibold">
          <span>{filtrados.length} empresa(s) encontrada(s)</span>
          {searchTerm && <span>Filtro ativo</span>}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-1 space-y-0.5 no-scrollbar">
        {filtrados.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-400 font-medium">
            Nenhuma empresa encontrada com "{searchTerm}"
          </div>
        ) : (
          filtrados.map((company) => {
            const isSelecionado = company.codigo === empresa.codigo;
            return (
              <button
                key={company.codigo}
                type="button"
                onClick={() => {
                  handleSelecionarEmpresa(company);
                  handleFechar();
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-2.5 py-0.5 rounded-lg text-left transition-all cursor-pointer text-xs",
                  isSelecionado
                    ? "bg-primary text-white font-black"
                    : "hover:bg-gray-50 text-gray-700 font-medium"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[9px] font-black shrink-0 tracking-wider",
                      isSelecionado
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-700 group-hover:bg-primary/10"
                    )}
                  >
                    {company.sigla}
                  </span>
                  <span className="flex h-5 items-center justify-center truncate text-[11px] text-center">
                    {company.descricao}
                  </span>
                </div>
                {isSelecionado && (
                  <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-3" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  )
}