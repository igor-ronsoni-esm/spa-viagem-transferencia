"use client";

import DadosBasicos from "./DadosBasicos";

export default function DadosGerais() {
  return (
    <div className="flex flex-1 space-y-6">
      <DadosBasicos />
      {/* Secao 2: Dados da Linha de Transferencia */}
      {/* <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs space-y-4">
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
      </div> */}

      {/* Secao 3: Veiculos & Motoristas */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-gray-50 mb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                  Lista de Veículos para a Viagem
                </h4>
              </div>
              <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {trip.veiculos.length}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {trip.veiculos.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 p-2 bg-gray-50/50 rounded-lg border border-gray-50 text-left"
                >
                  <div className="w-8 h-8 rounded bg-white border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400 font-bold text-xs uppercase">
                    {v.fotoUrl ? (
                      <img
                        src={v.fotoUrl}
                        alt={v.placa}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Truck className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-700">
                        {v.placa}
                      </span>
                      <span className="text-[8px] font-black bg-gray-200 text-gray-600 px-1 rounded uppercase tracking-tighter">
                        {v.tipo || "COMPLETO"}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-400 truncate">
                      {v.modelo}
                    </p>
                  </div>
                </div>
              ))}

              {trip.veiculos.length === 0 && (
                <p className="text-[10px] text-gray-400 italic text-center py-4 bg-gray-50/20 rounded-lg">
                  Nenhum veículo selecionado
                </p>
              )}
            </div>
          </div>

          {canEditFields && (
            <button
              type="button"
              onClick={() => setIsVehicleModalOpen(true)}
              className="w-full border-2 border-dashed border-primary/20 hover:border-primary/50 text-primary/80 hover:text-primary rounded-lg py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <Plus className="w-3.5 h-3.5" /> Selecionar Veículo(s)
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-gray-50 mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                  Lista de Motoristas
                </h4>
              </div>
              <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {trip.motoristas.length}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {trip.motoristas.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-2 bg-gray-50/50 rounded-lg border border-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700 leading-tight">
                      {d.nome}
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium">
                      CPF: {maskCpf(d.cpf)} • Cód: {d.codigo}
                    </span>
                  </div>

                  {canEditFields ? (
                    <button
                      type="button"
                      onClick={() => setPrincipalDriver(d.id)}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter cursor-pointer transition-all",
                        d.isPrincipal
                          ? "bg-primary text-white shadow-xs"
                          : "bg-gray-200 text-gray-500",
                      )}
                    >
                      {d.isPrincipal ? "PRINCIPAL" : "RESERVA"}
                    </button>
                  ) : (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter",
                        d.isPrincipal
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-400",
                      )}
                    >
                      {d.isPrincipal ? "PRINCIPAL" : "RESERVA"}
                    </span>
                  )}
                </div>
              ))}

              {trip.motoristas.length === 0 && (
                <p className="text-[10px] text-gray-400 italic text-center py-4 bg-gray-50/20 rounded-lg">
                  Nenhum motorista selecionado
                </p>
              )}
            </div>
          </div>

          {canEditFields && (
            <button
              type="button"
              onClick={() => setIsDriverModalOpen(true)}
              className="w-full border-2 border-dashed border-primary/20 hover:border-primary/50 text-primary/80 hover:text-primary rounded-lg py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <Plus className="w-3.5 h-3.5" /> Selecionar Motorista(s)
            </button>
          )}
        </div>
      </div> */}

      {/* Secao 4: Troca de Motoristas & Lacres [Desabilitado] */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100/50">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                Troca de Motorista (Opção de Troca)
              </h4>
            </div>
            <span className="text-[8px] font-black bg-gray-200 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">
              INATIVO
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 opacity-50 cursor-not-allowed">
            <div>
              <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                Código
              </label>
              <input
                type="text"
                disabled={true}
                tabIndex={-1}
                placeholder="Nenhum"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-500 select-none pointer-events-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                Sigla
              </label>
              <input
                type="text"
                disabled={true}
                tabIndex={-1}
                placeholder="Selecione..."
                className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-500 select-none pointer-events-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                Unidade / Ponto de Controle
              </label>
              <input
                type="text"
                disabled={true}
                tabIndex={-1}
                placeholder="Não aplicável"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-500 select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100/50">
            <div className="flex items-center gap-2">
              <Clipboard className="w-4 h-4 text-gray-400" />
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                Lacres (Vários Lacres)
              </h4>
            </div>
            <span className="text-[8px] font-black bg-gray-200 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">
              DESABILITADO
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 opacity-50 cursor-not-allowed">
            <div>
              <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider font-bold">
                Lacre nº 1
              </label>
              <input
                type="text"
                disabled={true}
                tabIndex={-1}
                value="LCR-10492"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-600 font-bold select-none pointer-events-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider font-bold">
                Lacre nº 2
              </label>
              <input
                type="text"
                disabled={true}
                tabIndex={-1}
                value="LCR-94812"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-600 font-bold select-none pointer-events-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider font-bold">
                Lacre nº 3
              </label>
              <input
                type="text"
                disabled={true}
                tabIndex={-1}
                value="LCR-50293"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-600 font-bold select-none pointer-events-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider font-bold">
                Lacre nº 4
              </label>
              <input
                type="text"
                disabled={true}
                tabIndex={-1}
                placeholder="Não preenchido"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-500 select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
