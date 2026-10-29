import { MapPin, X, Search } from "lucide-react";
import { motion } from "motion/react";

type Props = {
  open: boolean;
  handleFechar: () => void;
}

export default function SelecaoLinhaModal({ open, handleFechar }: Readonly<Props>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm z-70 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80%]"
      >
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-gray-800 text-sm">
              Selecionar Linha de Viagem
            </h3>
          </div>
          <button
            onClick={handleFechar}
            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por código ou nome..."
              // value={lineSearch}
              // onChange={(e) => setLineSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <p className="text-[9px] text-gray-400 mt-1.5 italic">
            * Dê duplo-clique sobre a linha para selecioná-la e preencher os
            dados de rastreio.
          </p>
        </div>

        {/* Lines list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50/50">
          {lines
            .filter(
              (l) =>
                l.nome.toLowerCase().includes(lineSearch.toLowerCase()) ||
                l.codigo?.toString().includes(lineSearch),
            )
            .map((l) => {
              const originAg = agencies.find((a) => a.id === l.origemAgenciaId);
              const destAg = agencies.find((a) => a.id === l.destinoAgenciaId);

              const handleSelectLine = () => {
                const origLabel = originAg
                  ? `${originAg.sigla} (${originAg.nome})`
                  : "Origem";
                const destLabel = destAg
                  ? `${destAg.sigla} (${destAg.nome})`
                  : "Destino";

                setTrip((prev) => ({
                  ...prev,
                  linhaId: l.id,
                  nomeLinha: l.nome,
                  horarioSaida: l.horarioSaida,
                  codigoLinha: l.codigo ?? 1001,
                  descricaoLinha: l.nome,
                  codigoTrecho: `TR-${l.codigo || "0492"}`,
                  origemTrecho: origLabel,
                  destinoTrecho: destLabel,
                  agenciaOrigemSigla: originAg?.sigla || "SAO",
                  agenciaDestinoSigla: destAg?.sigla || "RIO",
                  chaveRastreio: `352605${l.codigo ?? "1001"}88921000188`,
                  codigoRastreio: `RST-${(l.codigo ?? 1001) + 9410}`,
                  codigoRotaRastreio: `ROT-${l.codigo ?? "1001"}`,
                  descricaoRotaRastreio: `ROTA PADRÃO DE REFERÊNCIA - ${l.nome}`,
                  previsaoSaida: `${prev.dataViagem || new Date().toISOString().split("T")[0]}T${l.horarioSaida || "22:00"}:00`,
                }));
                setIsLineModalOpen(false);
              };

              return (
                <div
                  key={l.id}
                  onDoubleClick={handleSelectLine}
                  onClick={handleSelectLine}
                  className="p-3 bg-white border border-gray-100 rounded-xl hover:border-primary/50 cursor-pointer transition-all hover:shadow-xs group flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        Cód {l.codigo ?? "N/A"}
                      </span>
                      <span className="text-xs font-black text-gray-800 truncate group-hover:text-primary">
                        {l.nome}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-[9px] text-gray-400 font-bold">
                      <span>{originAg?.nome || "Origem"}</span>
                      <span>➔</span>
                      <span>{destAg?.nome || "Destino"}</span>
                    </div>
                  </div>

                  <div className="text-right flex-col items-end flex shrink-0">
                    <span className="text-xs font-bold text-gray-700">
                      🕒 {l.horarioSaida}
                    </span>
                    <span className="text-[8px] text-gray-400 font-black uppercase mt-0.5">
                      {(l.diasExecucao || []).join(" • ")}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </motion.div>
    </motion.div>
  );
}
