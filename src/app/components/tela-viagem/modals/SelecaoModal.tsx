import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Loader2, AlertTriangle, Database } from "lucide-react";

const METADATA_URL =
  "https://api-fc-search-tecnologia.rkedev.expressosaomiguel.tec.br/api-fc-search/api/metadata/key";
const SEARCH_URL =
  "https://api-fc-search-tecnologia.rkedev.expressosaomiguel.tec.br/api-fc-search/api/search/filter/";
const DEBOUNCE_MS = 400;

type MetadataColumn = {
  codigo: number;
  chavePrimaria: boolean;
  campoSQL: string;
  campoFiltro: string;
  caption: string;
  tamanho: number;
  tipoCampo: string;
  visivel: boolean;
  ativo: boolean;
  ordem: number | null;
};

type MetadataResponse = {
  successful: boolean;
  message: string;
  data: {
    chave: string;
    descricao: string;
    metadata: MetadataColumn[];
  };
};

type SearchResponse = {
  successful: boolean;
  message: string;
  data: unknown;
};

export type SearchFilter = {
  field: string;
  operation: "=" | "like";
  value: string;
};

type Row = Record<string, unknown>;

type Props = {
  open: boolean;
  chave: string;
  titulo?: string;
  filtrosFixos?: SearchFilter[];
  onClose: () => void;
  onSelect: (row: Row) => void;
};

async function fetchJson<T extends { successful: boolean; message: string }>(
  url: string,
  init: RequestInit,
  signal: AbortSignal,
): Promise<T> {
  const res = await fetch(url, { ...init, signal });
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

  const json = (await res.json()) as T;
  if (!json.successful) throw new Error(json.message || "Falha na requisição");
  return json;
}

// Extrai o array de linhas, independente de a API devolver array direto ou dentro de um objeto
function extractRows(payload: unknown): Row[] {
  if (Array.isArray(payload)) return payload as Row[];
  if (payload && typeof payload === "object") {
    for (const value of Object.values(payload)) {
      if (Array.isArray(value)) return value as Row[];
    }
  }
  return [];
}

function getCellValue(row: Row, col: MetadataColumn): string {
  const value = row[col.campoSQL] ?? row[col.campoFiltro];
  return value === null || value === undefined ? "" : String(value);
}

// Monta o filtro enviado ao backend para uma coluna digitada pelo usuário
function buildFilter(col: MetadataColumn, raw: string): SearchFilter | null {
  const value = raw.trim();
  if (!value) return null;

  const field = col.campoFiltro;

  if (col.tipoCampo.toLowerCase() === "string") {
    return { field, operation: "like", value: `%${value}%` };
  }

  return { field, operation: "=", value };
}

export default function SelecaoModal({
  open,
  chave,
  titulo = "Selecionar Registro",
  filtrosFixos = [],
  onClose,
  onSelect,
}: Readonly<Props>) {
  const [columns, setColumns] = useState<MetadataColumn[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [debouncedFilters, setDebouncedFilters] = useState<SearchFilter[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Row | null>(null);

  // 1) Ao abrir (ou trocar a chave): carrega apenas o metadata (colunas)
  useEffect(() => {
    if (!open || !chave) return;

    const controller = new AbortController();
    setLoadingMeta(true);
    setError(null);
    setColumns([]);
    setFilterValues({});
    setDebouncedFilters([]);

    fetchJson<MetadataResponse>(
      `${METADATA_URL}/${chave}`,
      { method: "GET" },
      controller.signal,
    )
      .then((meta) => {
        const visibleColumns = meta.data.metadata
          .filter((c) => c.visivel && c.ativo)
          .sort((a, b) => (a.ordem ?? a.codigo) - (b.ordem ?? b.codigo));
        setColumns(visibleColumns);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Erro inesperado");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingMeta(false);
      });

    return () => controller.abort();
  }, [open, chave]);

  // 2) Junta filtros fixos (sempre enviados) com os filtros digitados pelo usuário
  const filters = useMemo(() => {
    const dinamicos = columns.flatMap((col) => {
      const f = buildFilter(col, filterValues[col.campoFiltro] ?? "");
      return f ? [f] : [];
    });
    return [...filtrosFixos, ...dinamicos];
  }, [columns, filterValues, filtrosFixos]);

  const filtersKey = JSON.stringify(filters);

  // 3) Debounce: só aplica os filtros depois que o usuário para de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(JSON.parse(filtersKey) as SearchFilter[]);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filtersKey]);

  // 4) Busca os dados no backend sempre que abrir ou os filtros mudarem
  useEffect(() => {
    if (!open || !chave) return;

    const controller = new AbortController();
    setLoadingData(true);
    setSelected(null);

    fetchJson<SearchResponse>(
      SEARCH_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filterKey: "",
          filters: debouncedFilters,
          searchKey: chave,
        }),
      },
      controller.signal,
    )
      .then((data) => {
        setRows(extractRows(data.data));
        setError(null);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Erro inesperado");
        setRows([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingData(false);
      });

    return () => controller.abort();
  }, [open, chave, debouncedFilters]);

  // Fecha com ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleConfirm = () => {
    if (selected) onSelect(selected);
  };

  const initialLoading = loadingMeta && columns.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="busca-backdrop"
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
                onClick={onClose}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-auto bg-gray-50/50 min-h-50">
              {initialLoading && (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-xs">Carregando colunas...</span>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center gap-2 py-6 text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                  <span className="text-xs font-semibold">{error}</span>
                </div>
              )}

              {columns.length > 0 && (
                <table className="w-full text-xs border-collapse">
                  <thead className="sticky top-0 bg-white shadow-xs z-10">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col.campoSQL}
                          className="text-left font-black text-gray-600 uppercase text-[10px] px-3 pt-2.5 pb-1 whitespace-nowrap"
                        >
                          {col.caption}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={`filter-${col.campoFiltro}`}
                          className="px-3 pb-2.5 pt-1 border-b border-gray-100"
                        >
                          <input
                            type="text"
                            value={filterValues[col.campoFiltro] ?? ""}
                            onChange={(e) =>
                              setFilterValues((prev) => ({
                                ...prev,
                                [col.campoFiltro]: e.target.value,
                              }))
                            }
                            placeholder="Filtrar..."
                            className="w-full min-w-24 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-[11px] font-normal normal-case focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => {
                      const isSelected = selected === row;
                      return (
                        <tr
                          key={idx}
                          onClick={() => setSelected(row)}
                          onDoubleClick={() => onSelect(row)}
                          className={`cursor-pointer transition-colors border-b border-gray-100 ${
                            isSelected
                              ? "bg-primary/10 text-primary"
                              : "bg-white hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {columns.map((col) => (
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

                    {!loadingData && rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={columns.length}
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
              <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                {loadingData ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  `${rows.length} registros`
                )}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selected}
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