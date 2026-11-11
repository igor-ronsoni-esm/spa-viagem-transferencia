import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Loader2, AlertTriangle, Database } from "lucide-react";
import { ColunaSelecao, FiltrosIniciais, Row, SearchFilter } from "./types";
import { filtrarDados, getCellValue, montarFiltrosColunas } from "./filtros";

type Props = {
  open: boolean;
  titulo?: string;
  /** Colunas já visíveis e ordenadas, vindas do contexto */
  colunas: ColunaSelecao[];
  /** Lista completa, vinda do contexto */
  dados: Row[];
  /** Filtros fixos: aplicados sempre, não aparecem para o usuário */
  filtrosFixos?: SearchFilter[];
  /** Valores pré-preenchidos nos campos de filtro (editáveis) */
  filtrosIniciais?: FiltrosIniciais;
  /** Estado de carregamento/erro, controlado pelo contexto */
  carregando?: boolean;
  erro?: string | null;
  onClose: () => void;
  onSelect: (row: Row) => void;
};

export default function SelecaoModal({
  open,
  titulo = "Selecionar Registro",
  colunas,
  dados,
  filtrosFixos = [],
  filtrosIniciais = {},
  carregando = false,
  erro = null,
  onClose,
  onSelect,
}: Readonly<Props>) {
  const [filterValues, setFilterValues] = useState<FiltrosIniciais>({});
  const [selected, setSelected] = useState<Row | null>(null);

  // Chaves estáveis para não depender da identidade de objetos criados no render
  const iniciaisKey = JSON.stringify(filtrosIniciais);
  const fixosKey = JSON.stringify(filtrosFixos);

  // Ao abrir, aplica os filtros iniciais desta chamada. Ao fechar, limpa a seleção.
  useEffect(() => {
    if (open) {
      setFilterValues(JSON.parse(iniciaisKey));
    } else {
      setSelected(null);
    }
  }, [open, iniciaisKey]);

  // Filtragem local. Como as linhas são os próprios objetos de `dados`,
  // a comparação por referência da seleção continua válida.
  const linhas = useMemo(() => {
    const fixos: SearchFilter[] = JSON.parse(fixosKey);
    return filtrarDados(dados, [...fixos, ...montarFiltrosColunas(colunas, filterValues)]);
  }, [dados, colunas, filterValues, fixosKey]);

  // Se a linha selecionada sair do filtro, a seleção é descartada
  const selecionado = selected && linhas.includes(selected) ? selected : null;
  
  const pkCampo = colunas?.find((c) => c.chavePrimaria)?.campoSQL;

  // Fecha com ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const setFilterValue = (campoSQL: string, value: string) =>
    setFilterValues((prev) => ({ ...prev, [campoSQL]: value }));

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
                      {colunas.map((col) => (
                        <th
                          key={col.campoSQL}
                          className="text-left font-black text-gray-600 uppercase text-[10px] px-3 pt-2.5 pb-1 whitespace-nowrap"
                        >
                          {col.caption}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {colunas.map((col) => (
                        <th
                          key={`filtro-${col.campoSQL}`}
                          className="px-3 pb-2.5 pt-1 border-b border-gray-100"
                        >
                          <input
                            type="text"
                            value={filterValues[col.campoSQL] ?? ""}
                            onChange={(e) => setFilterValue(col.campoSQL, e.target.value)}
                            placeholder="Filtrar..."
                            className="w-full min-w-24 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-[11px] font-normal normal-case focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {linhas.map((row, rowIdx) => {
                      const isSelected = selecionado === row;
                      return (
                        <tr
                          key={pkCampo ? String(row[pkCampo]) : `linha-${rowIdx}`}
                          onClick={() => setSelected(row)}
                          onDoubleClick={() => {onSelect(row);onClose()}}
                          className={`cursor-pointer transition-colors border-b border-gray-100 ${
                            isSelected
                              ? "bg-primary/10 text-primary"
                              : "bg-white hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {colunas.map((col) => (
                            <td
                              key={col.campoSQL}
                              className="px-3 py-2 whitespace-nowrap font-medium"
                            >
                              {getCellValue(row, col)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}

                    {!carregando && linhas.length === 0 && (
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
              <span className="text-[10px] text-gray-400 font-bold">
                {linhas.length} registros
              </span>
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