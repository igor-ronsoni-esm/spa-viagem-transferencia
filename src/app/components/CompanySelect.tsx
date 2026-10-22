/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Empresa } from "../../types";
import { Building2, ChevronDown, Search, X, Check, Globe2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface CompanySelectProps {
  companies: Empresa[];
  selectedCompany: Empresa;
  onSelectCompany: (company: Empresa) => void;
  isMatrizUser?: boolean;
}

export function CompanySelect({
  companies,
  selectedCompany,
  onSelectCompany,
  isMatrizUser = true,
}: CompanySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  const filtered = companies.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      c.label.toLowerCase().includes(term) ||
      c.codigo.toLowerCase().includes(term) ||
      c.nome.toLowerCase().includes(term) ||
      (c.cidade && c.cidade.toLowerCase().includes(term)) ||
      (c.uf && c.uf.toLowerCase().includes(term))
    );
  });

  if (!isMatrizUser) {
    // If not Matriz, only display the fixed current company without select capability
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold text-gray-700">
        <Building2 className="w-4 h-4 text-primary shrink-0" />
        <span className="truncate">{selectedCompany.label}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
          <Globe2 className="w-2.5 h-2.5 text-primary" />
          <span>Empresa Ativa (Matriz)</span>
        </label>
        <span className="text-[8px] font-bold text-primary/80 bg-primary/5 px-1.5 py-0.2 rounded">
          {companies.length} filiais
        </span>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-2.5 py-1.5 bg-white border rounded-lg text-xs font-bold transition-all cursor-pointer text-left shadow-xs",
          isOpen
            ? "border-primary ring-2 ring-primary/10 bg-primary/2"
            : "border-gray-200 hover:border-primary/50 text-gray-800",
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-primary text-white shrink-0 tracking-wider">
            {selectedCompany.codigo}
          </span>
          <span className="truncate text-[11px] font-bold text-gray-800">
            {selectedCompany.label}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-transform shrink-0",
            isOpen && "rotate-180 text-primary",
          )}
        />
      </button>

      {/* Dropdown Menu with Search */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-72 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search Header */}
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
              <span>{filtered.length} empresa(s) encontrada(s)</span>
              {searchTerm && <span>Filtro ativo</span>}
            </div>
          </div>

          {/* List of Companies */}
          <div className="overflow-y-auto flex-1 p-1 space-y-0.5 no-scrollbar">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400 font-medium">
                Nenhuma empresa encontrada com "{searchTerm}"
              </div>
            ) : (
              filtered.map((company) => {
                const isSelected = company.codigo === selectedCompany.codigo;
                return (
                  <button
                    key={company.id || company.codigo}
                    type="button"
                    onClick={() => {
                      onSelectCompany(company);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer text-xs",
                      isSelected
                        ? "bg-primary text-white font-black"
                        : "hover:bg-gray-50 text-gray-700 font-medium",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[9px] font-black shrink-0 tracking-wider",
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-700 group-hover:bg-primary/10",
                        )}
                      >
                        {company.codigo}
                      </span>
                      <span className="truncate text-[11px]">
                        {company.label}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[3]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
