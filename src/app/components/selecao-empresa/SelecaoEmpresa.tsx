"use client";

import { useState, useRef } from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import DropMenu from './DropMenu';
import { cn } from '@modules/utils/css.util';
import { useSelecaoEmpresaContext } from '@contexts/empresa/SelecaoEmpresaProvider';
import { useSearchParams } from 'next/navigation';

export function SelecaoEmpresa() {
  const [menuAberto, setMenuAberto] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const { empresa } = useSelecaoEmpresaContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isMatriz = true; // TODO: Implementar lógica para determinar se a empresa é matriz
  
  const podeSelecionar =
    searchParams.get("modoEdicao") === "false" ||
    searchParams.get("modoEdicao") === null;

  if (!isMatriz || !podeSelecionar) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold text-gray-700">
        <Building2 className="w-4 h-4 text-primary shrink-0" />
        <span className="truncate">{empresa.sigla + " - " + empresa.descricao}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setMenuAberto(!menuAberto);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }}
        className={cn(
          "w-full flex items-center justify-between gap-2 p-2 bg-white border rounded-lg text-xs font-bold transition-all cursor-pointer text-left shadow-xs",
          menuAberto
            ? "border-primary ring-2 ring-primary/10 bg-primary/2"
            : "border-gray-200 hover:border-primary/50 text-gray-800"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-primary text-white shrink-0 tracking-wider">
            {empresa.sigla}
          </span>
          <span className="truncate text-[11px] font-bold text-gray-800">
            {empresa.descricao}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-transform shrink-0",
            menuAberto && "rotate-180 text-primary"
          )}
        />
      </button>

      {menuAberto && 
        <DropMenu
          inputRef={inputRef}
          handleFechar={() => setMenuAberto(false)}
        />
      }
    </div>
  );
}
