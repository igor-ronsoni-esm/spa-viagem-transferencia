export default function Documentos() {
  return (
    <div className="space-y-4">
      {/* Feedback Alert */}
      {docFeedback && (
        <div
          className={cn(
            "p-3 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top duration-200 shadow-xs",
            docFeedback.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          )}
        >
          <div className="flex items-center gap-2">
            {docFeedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span>{docFeedback.message}</span>
          </div>
          <button
            onClick={() => setDocFeedback(null)}
            className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Painel de Ações de Documentos */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                Documentos da Viagem
              </h3>
            </div>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">
              Configuração da Linha:{" "}
              <strong className="text-gray-700">
                {trip.agenciaOrigemSigla || "SAO"} ➔ {trip.agenciaDestinoSigla || "RIO"}
              </strong>{" "}
              • {trip.nomeLinha || "Linha Principal"}
              {!canEditFields && isEditable && (
                <span className="block text-amber-600 font-semibold mt-0.5">
                  * Ações bloqueadas. Clique em "EDITAR VIAGEM" no topo para habilitar a gestão de documentos.
                </span>
              )}
            </p>
          </div>

          {/* 3 Ações Principais Solicitadas */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Ação 1: Adicionar todos os documentos da linha */}
            <button
              type="button"
              disabled={!canEditFields || loading}
              onClick={handleAddAllLineDocuments}
              title={
                !canEditFields
                  ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                  : "Buscar e vincular à viagem todos os documentos presentes na empresa que pertencem à configuração desta linha"
              }
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
                canEditFields
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md cursor-pointer active:scale-98"
                  : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60"
              )}
            >
              <FolderPlus className="w-3.5 h-3.5 shrink-0" />
              <span>Adicionar Todos da Linha</span>
            </button>

            {/* Ação 2: Escolher documentos para incluir na viagem */}
            <button
              type="button"
              disabled={!canEditFields || loading}
              onClick={openImportModal}
              title={
                !canEditFields
                  ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                  : "Abre modal para escolher quais documentos incluir na viagem (apenas da linha ou todos da empresa)"
              }
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
                canEditFields
                  ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20 hover:shadow-md cursor-pointer active:scale-98"
                  : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60"
              )}
            >
              <ListPlus className="w-3.5 h-3.5 shrink-0" />
              <span>Escolher Documentos</span>
            </button>

            {/* Ação 3: Remover documentos da viagem */}
            <button
              type="button"
              disabled={!canEditFields || markedControleIds.size === 0 || loading}
              onClick={handleRemoveMarkedControles}
              title={
                !canEditFields
                  ? "Clique em 'Editar Viagem' no topo para habilitar esta ação"
                  : markedControleIds.size === 0
                  ? "Marque os documentos na lista para remover"
                  : `Remover ${markedControleIds.size} documento(s) marcado(s) da viagem`
              }
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-xs",
                canEditFields && markedControleIds.size > 0
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 hover:shadow-md cursor-pointer active:scale-98"
                  : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60"
              )}
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                Remover Documentos {markedControleIds.size > 0 ? `(${markedControleIds.size})` : ""}
              </span>
            </button>
          </div>
        </div>

        {/* Linha auxiliar: busca rápida por chave e indicadores */}
        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 max-w-sm w-full relative">
            <input
              type="text"
              disabled={!canEditFields}
              placeholder="Vincular chave de controle manual..."
              className={cn(
                "w-full border rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-8",
                canEditFields
                  ? "bg-white border-gray-200 hover:border-gray-300 text-gray-800"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
              )}
              value={controleKey}
              onChange={(e) => setControleKey(e.target.value)}
              onKeyDown={addControleByKey}
            />
            <button
              type="button"
              disabled={!canEditFields || !controleKey}
              onClick={performAddControle}
              className="absolute right-1.5 top-1 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-primary transition-colors cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title={!canEditFields ? "Habilite a edição para vincular chaves" : "Buscar e vincular chave"}
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-black">
              {(trip.controlesCarga || []).length} Controles
            </span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-black">
              {(trip.ctes || []).length} CT-es
            </span>
            <span className="text-gray-600 font-mono">
              Total: R${" "}
              {(trip.ctes || [])
                .reduce((s, c) => s + (c.valor || 0), 0)
                .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Seleção / Contagem de Marcados */}
      <div className="flex items-center justify-between px-1">
        <label
          className={cn(
            "flex items-center gap-2 select-none",
            canEditFields && (trip.controlesCarga || []).length > 0
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-60"
          )}
        >
          <input
            type="checkbox"
            checked={
              (trip.controlesCarga || []).length > 0 &&
              markedControleIds.size === (trip.controlesCarga || []).length
            }
            onChange={toggleMarkAllControles}
            disabled={(trip.controlesCarga || []).length === 0 || !canEditFields}
            className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer disabled:cursor-not-allowed"
          />
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
            Marcar Todos ({markedControleIds.size}/{(trip.controlesCarga || []).length})
          </span>
        </label>

        {markedControleIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
              {markedControleIds.size} documento(s) marcado(s) para remoção
            </span>
            {canEditFields && (
              <button
                type="button"
                onClick={handleRemoveMarkedControles}
                className="text-[10px] font-black text-red-600 hover:text-red-700 underline uppercase cursor-pointer"
              >
                Remover agora
              </button>
            )}
          </div>
        )}
      </div>

      {/* Listagem de Documentos da Viagem */}
      <div className="space-y-2">
        {(trip.controlesCarga || []).length === 0 ? (
          <div className="py-12 px-4 text-center bg-white rounded-xl border border-gray-100 border-dashed space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-gray-700">
                Nenhum documento de carga vinculado à viagem
              </h4>
              <p className="text-[11px] text-gray-400 max-w-md mx-auto">
                {canEditFields
                  ? "Utilize os botões de ação acima para adicionar todos os documentos da configuração da linha ou escolher documentos específicos da empresa."
                  : "Clique no botão 'EDITAR VIAGEM' acima para habilitar as ações de adicionar ou vincular documentos."}
              </p>
            </div>
            {canEditFields && (
              <div className="flex justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddAllLineDocuments}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold hover:bg-emerald-700 cursor-pointer uppercase shadow-xs"
                >
                  <FolderPlus className="w-3.5 h-3.5" /> Adicionar Todos da Linha
                </button>
                <button
                  type="button"
                  onClick={openImportModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-[10px] font-bold hover:opacity-90 cursor-pointer uppercase shadow-xs"
                >
                  <ListPlus className="w-3.5 h-3.5" /> Escolher Documentos
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {(trip.controlesCarga || []).map((controle) => {
              const isMarked = markedControleIds.has(controle.id || controle.chave);
              const isExpanded = expandedControles.has(controle.id || controle.chave);
              const isLineMatch =
                controle.origemSigla === trip.agenciaOrigemSigla &&
                controle.destinoSigla === trip.agenciaDestinoSigla;
              const totalValorControle = (controle.ctes || []).reduce(
                (s, c) => s + (c.valor || 0),
                0
              );

              return (
                <div
                  key={controle.id || controle.chave}
                  className={cn(
                    "bg-white rounded-xl border overflow-hidden shadow-xs transition-all",
                    isMarked
                      ? "border-red-300 bg-red-50/20 ring-1 ring-red-300"
                      : "border-gray-100 hover:border-gray-200"
                  )}
                >
                  <div className="p-3 flex items-center justify-between gap-3 bg-gray-50/60 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox de marcação para remoção */}
                      {canEditFields && (
                        <input
                          type="checkbox"
                          checked={isMarked}
                          onChange={() => toggleMarkControle(controle.id || controle.chave)}
                          className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer shrink-0"
                          title="Marcar este documento para remoção"
                        />
                      )}

                      <div
                        onClick={() => toggleControleExpansion(controle.id || controle.chave)}
                        className="flex items-center gap-2.5 cursor-pointer min-w-0"
                      >
                        <ClipboardList className="w-4 h-4 text-primary shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-black text-gray-800 font-mono tracking-tight truncate">
                              {controle.chave}
                            </span>
                            <span
                              className={cn(
                                "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                                isLineMatch
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-blue-100 text-blue-800"
                              )}
                            >
                              {controle.origemSigla} ➔ {controle.destinoSigla}
                            </span>
                            {isLineMatch && (
                              <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 rounded uppercase tracking-tighter">
                                Configuração da Linha
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-gray-400 font-medium mt-0.5">
                            {(controle.ctes || []).length} CT-e(s) • Total: R${" "}
                            {totalValorControle.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleControleExpansion(controle.id || controle.chave)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                        title={isExpanded ? "Ocultar CT-es" : "Ver CT-es"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {canEditFields && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveSingleControle(controle.id, controle.chave)
                          }
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remover este documento da viagem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 pt-0 px-4 space-y-1 bg-white">
                          <div className="h-[1px] bg-gray-50 mb-2" />
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                            Conhecimentos de Transporte (CT-es) vinculados
                          </span>
                          {(controle.ctes || []).map((cte, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0 group text-left"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[10px] font-bold text-gray-700 font-mono truncate">
                                    {cte.chave}
                                  </span>
                                  <span className="text-[8px] text-gray-400 font-medium uppercase tracking-tighter truncate">
                                    {cte.remetente} ➔ {cte.destinatario}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-gray-700 font-mono shrink-0 pl-2">
                                R${" "}
                                {(cte.valor || 0).toLocaleString("pt-BR", {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}