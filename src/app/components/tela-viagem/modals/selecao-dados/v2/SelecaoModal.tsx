import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Loader2, AlertTriangle, Database, Filter } from "lucide-react";
import { ColunaOutput } from "@modules/domain/api-consulta/schemas/coluna.schema";
import { Operacao } from "@modules/domain/api-consulta/schemas/filtro.schema";
import { Row } from "../types";

export const OPERACOES: { value: Operacao; label: string }[] = [
  { value: "=", label: "Igual" },
  { value: "<>", label: "Diferente" },
  { value: "like", label: "Contém" },
  { value: ">", label: "Maior" },
  { value: "<", label: "Menor" },
  { value: ">=", label: "Maior ou igual" },
  { value: "<=", label: "Menor ou igual" },
];

/** Filtro digitado na tela, ainda não aplicado */
export type FiltroRascunho = {
  id: string;
  campo: string;
  operacao: Operacao;
  valor: string;
};

type Props = {
  open: boolean;
  titulo?: string;
  colunas: ColunaOutput[];
  dados: Row[];
  /** fieldName da coluna-chave */
  chavePrimaria?: string;
  filtros: FiltroRascunho[];
  /** somenteEste = true quando o clique foi simples (sem Ctrl/Cmd) */
  onAdicionarFiltro: (campo: string, somenteEste: boolean) => void;
  onAlterarFiltro: (
    id: string,
    patch: Partial<Omit<FiltroRascunho, "id" | "campo">>,
  ) => void;
  onRemoverFiltro: (id: string) => void;
  onAplicarFiltros: () => void;
  carregando?: boolean;
  erro?: string | null;
  onClose: () => void;
  onSelect: (row: Row) => void;
};

const valorCelula = (row: Row, campo: string) => {
  const v = row[campo];
  return v === null || v === undefined ? "" : String(v);
};

export default function SelecaoModal({
  open,
  titulo = "Selecionar Registro",
  colunas,
  dados,
  chavePrimaria,
  filtros,
  onAdicionarFiltro,
  onAlterarFiltro,
  onRemoverFiltro,
  onAplicarFiltros,
  carregando = false,
  erro = null,
  onClose,
  onSelect,
}: Readonly<Props>) {
  const [selectedKey, setSelectedKey] = useState<string | undefined>();

  const chaveDe = (row: Row, idx: number) =>
    chavePrimaria ? String(row[chavePrimaria]) : `idx-${idx}`;

  const selecionado =
    dados.find((row, idx) => chaveDe(row, idx) === selectedKey) ?? null;

  // Limpa a seleção ao fechar
  useEffect(() => {
    if (!open) setSelectedKey(undefined);
  }, [open]);

  // Fecha com ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Ctrl/Cmd + clique: soma o filtro aos existentes.
  // Clique simples: mantém somente o filtro da coluna clicada.
  const handleCabecalhoClick = (
    e: MouseEvent<HTMLTableCellElement>,
    campo: string,
  ) => {
    const comCtrl = e.ctrlKey || e.metaKey;
    if (comCtrl) e.preventDefault();
    onAdicionarFiltro(campo, !comCtrl);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="selecao-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-70 flex items-center justify-center p-4"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-gray-800 text-sm">{titulo}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Painel de filtros */}
            {filtros.length > 0 && (
              <div className="px-4 py-3 bg-white border-b border-gray-100 flex flex-col gap-2">
                {filtros.map((f) => {
                  const col = colunas.find((c) => c.fieldName === f.campo);
                  return (
                    <div key={f.id} className="flex items-center gap-2">
                      <span
                        title={f.campo}
                        className="w-40 truncate text-[11px] font-bold text-gray-600"
                      >
                        {col?.displayName ?? f.campo}
                      </span>

                      <select
                        value={f.operacao}
                        onChange={(e) =>
                          onAlterarFiltro(f.id, {
                            operacao: e.target.value as Operacao,
                          })
                        }
                        className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-[11px] outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      >
                        {OPERACOES.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={f.valor}
                        onChange={(e) =>
                          onAlterarFiltro(f.id, { valor: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onAplicarFiltros();
                        }}
                        placeholder="Valor..."
                        className="flex-1 min-w-24 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-[11px] outline-none focus:ring-2 focus:ring-primary/20"
                      />

                      <button
                        type="button"
                        onClick={() => onRemoverFiltro(f.id)}
                        className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  );
                })}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onAplicarFiltros}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    Filtrar
                  </button>
                </div>
              </div>
            )}

            {/* Conteúdo */}
            <div className="flex-1 overflow-auto bg-gray-50/50 min-h-50">
              {carregando && colunas.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-xs">Carregando...</span>
                </div>
              )}

              {erro && (
                <div className="flex flex-col items-center justify-center gap-2 py-6 text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                  <span className="text-xs font-semibold">{erro}</span>
                </div>
              )}

              {colunas.length > 0 && (
                <table className="w-full text-xs border-collapse">
                  <thead className="sticky top-0 bg-white shadow-xs z-10">
                    <tr>
                      {colunas.map((col) => {
                        const filtrada = filtros.some(
                          (f) => f.campo === col.fieldName,
                        );
                        return (
                          <th
                            key={col.fieldName}
                            onClick={(e) =>
                              handleCabecalhoClick(e, col.fieldName)
                            }
                            title="Clique para filtrar esta coluna. Ctrl + clique para somar filtros."
                            className={`select-none cursor-pointer text-left font-black uppercase text-[10px] px-3 py-2.5 whitespace-nowrap hover:bg-gray-50 ${
                              filtrada ? "text-primary" : "text-gray-600"
                            }`}
                          >
                            {col.displayName}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {dados.map((row, rowIdx) => {
                      const key = chaveDe(row, rowIdx);
                      const isSelected = selectedKey === key;
                      return (
                        <tr
                          key={key}
                          onClick={() => setSelectedKey(key)}
                          onDoubleClick={() => {
                            onSelect(row);
                            onClose();
                          }}
                          className={`cursor-pointer transition-colors border-b border-gray-100 ${
                            isSelected
                              ? "bg-primary/10 text-primary"
                              : "bg-white hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {colunas.map((col) => (
                            <td
                              key={col.fieldName}
                              className="px-3 py-2 whitespace-nowrap font-medium"
                            >
                              {valorCelula(row, col.fieldName)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}

                    {!carregando && dados.length === 0 && (
                      <tr>
                        <td
                          colSpan={colunas.length}
                          className="text-center text-gray-400 py-10 text-xs"
                        >
                          Nenhum registro encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold">
                  {dados.length} registros
                </span>
                {carregando && colunas.length > 0 && (
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => selecionado && onSelect(selecionado)}
                  disabled={!selecionado}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Selecionar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}