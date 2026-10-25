export default function DadosLinhasTransferencia() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
            Dados de Linha de Transferência Usada
          </h3>
        </div>
        <span className="text-[9px] text-gray-400 italic">
          *Clique em Código para abrir o modal de seleção de Linhas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-black text-gray-500 mb-0.5 uppercase tracking-wider">
            Código de Linha
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly={true}
              tabIndex={canEditFields ? undefined : -1}
              value={trip.codigoLinha || ""}
              onClick={() => canEditFields && setIsLineModalOpen(true)}
              placeholder="Clique para selecionar..."
              className={cn(
                "w-full rounded-lg p-1.5 pr-8 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all select-none",
                canEditFields
                  ? "bg-white border border-primary/20 hover:border-primary/50 text-primary font-bold cursor-pointer"
                  : "bg-gray-100 border border-gray-200 text-gray-500 font-medium cursor-not-allowed pointer-events-none",
              )}
            />
            <Search
              className={cn(
                "w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none",
                canEditFields ? "text-primary" : "text-gray-400",
              )}
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Descrição da Linha
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            value={trip.descricaoLinha || trip.nomeLinha || ""}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 text-gray-600 font-medium select-none pointer-events-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Código do Trecho
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            value={trip.codigoTrecho || ""}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 text-gray-600 font-medium select-none pointer-events-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Origem do Trecho
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            value={trip.origemTrecho || ""}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 text-gray-600 font-medium select-none pointer-events-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Destino do Trecho
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            value={trip.destinoTrecho || ""}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 text-gray-600 font-medium select-none pointer-events-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-50/50 pt-2">
        <div className="col-span-1">
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Previsão de Saída
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            value={
              trip.previsaoSaida
                ? new Date(trip.previsaoSaida).toLocaleString()
                : ""
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 text-gray-600 font-medium select-none pointer-events-none"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Chave do Rastreio
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            value={trip.chaveRastreio || ""}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 text-gray-600 font-medium truncate select-none pointer-events-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Código do Rastreio
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            value={trip.codigoRastreio || ""}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 text-gray-600 font-medium select-none pointer-events-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Código da Rota do Rastreio
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            value={trip.codigoRotaRastreio || ""}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 text-gray-600 font-medium select-none pointer-events-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Descrição da Rota do Rastreio
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            value={trip.descricaoRotaRastreio || ""}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 text-gray-600 font-medium select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
