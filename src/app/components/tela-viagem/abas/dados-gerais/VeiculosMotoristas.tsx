export default function VeiculosMotoristas() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Veiculos Card */}
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

        {/* Motoristas Card */}
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
      </div>
  )
}