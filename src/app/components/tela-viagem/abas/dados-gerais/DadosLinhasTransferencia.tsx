"use client";

import { MapPin, Search } from "lucide-react";
import { useContext, useState } from "react";
import { ViagemContext } from "../../context/ViagemContext";
import { useFormContext } from "react-hook-form";
import { cn } from "@modules/utils/css.util";
import SelecaoModal from "../../modals/SelecaoModal";
import { TipoTransferenciaEnum, ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { dataHoraISO } from "@/src/modules/utils/data.util";
import FastcrudConsultasConfig from "@/src/configs/environment/fastcrud-consultas.config";

export default function DadosLinhasTransferencia() {
  const [modalSelecaoLinhaOpen, setModalSelecaoLinhaOpen] = useState<boolean>(false);
  const [modalSelecaoTrechoOpen, setModalSelecaoTrechoOpen] = useState<boolean>(false);
  const [mostrarRotasRastreio, setMostrarRotasRastreio] = useState<boolean>(false);

  const { modoEdicao } = useContext(ViagemContext);
  const { register, watch } = useFormContext<ViagemOutput>();
  
  const viagemJaGerada =
    watch("codigo") !== null &&
    watch("codigo") !== undefined &&
    watch("codigo") !== 0;
  const podeAlterarLinha =
    watch("tipoTransferencia") !== TipoTransferenciaEnum.ESCALA &&
    !viagemJaGerada &&
    modoEdicao;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3.5 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
            Linha de Transferência e Trecho
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {watch("linha.trecho.codigo") && (
            <button
              type="button"
              onClick={() => setMostrarRotasRastreio(!mostrarRotasRastreio)}
              className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer bg-primary/5 px-2 py-0.5 rounded-md"
            >
              {mostrarRotasRastreio
                ? "Ocultar Rastreio"
                : "Ver Rastreio e Rota"}
            </button>
          )}
          <span className="text-[9px] text-gray-400 italic">
            *Clique no código para alterar a linha
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-black text-gray-500 mb-0.5 uppercase tracking-wider">
            Código de Linha
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly={true}
              disabled={!podeAlterarLinha}
              {...register("linha.codigo")}
              onClick={() => setModalSelecaoLinhaOpen(true)}
              placeholder="Selecionar linha..."
              className={cn(
                "w-full rounded-lg p-1.5 pr-8 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all select-none",
                podeAlterarLinha
                  ? "bg-white border border-primary/20 hover:border-primary/50 text-primary font-bold cursor-pointer"
                  : "bg-gray-100 border border-gray-200 text-gray-500 font-medium cursor-not-allowed pointer-events-none",
              )}
            />
            <Search
              className={cn(
                "w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none",
                podeAlterarLinha ? "text-primary" : "text-gray-400",
              )}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Descrição da Linha
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            {...register("linha.descricao")}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none disabled:bg-gray-100 text-gray-600 font-medium select-none pointer-events-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-black text-gray-500 mb-0.5 uppercase tracking-wider">
            Trecho da Linha{" "}
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly={true}
              disabled={!podeAlterarLinha}
              {...register("linha.trecho.codigo")}
              onClick={() => setModalSelecaoTrechoOpen(true)}
              placeholder="Selecionar linha..."
              className={cn(
                "w-full rounded-lg p-1.5 pr-8 text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all select-none",
                podeAlterarLinha
                  ? "bg-white border border-primary/20 hover:border-primary/50 text-primary font-bold cursor-pointer"
                  : "bg-gray-100 border border-gray-200 text-gray-500 font-medium cursor-not-allowed pointer-events-none",
              )}
            />
            <Search
              className={cn(
                "w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none",
                podeAlterarLinha ? "text-primary" : "text-gray-400",
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
            Origem do Trecho
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            value={`${watch("linha.trecho.origem.sigla")} - ${watch("linha.trecho.origem.descricao")}`}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
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
            value={`${watch("linha.trecho.destino.sigla")} - ${watch("linha.trecho.destino.descricao")}`}            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-gray-50">
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
              Previsão de Saída
            </label>
            <input
              type="text"
              disabled={true}
              tabIndex={-1}
              value={watch("previsaoSaida") ? dataHoraISO(new Date(watch("previsaoSaida"))) : ""}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
            />
          </div>
        </div>
      </div>

      {mostrarRotasRastreio && (
        <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/60">
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
              Informações de Rastreio e Rota
            </span>
            <button
              type="button"
              onClick={() => setMostrarRotasRastreio(false)}
              className="text-[10px] font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              Fechar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                Código do Rastreio
              </label>
              <input
                type="text"
                disabled={true}
                tabIndex={-1}
                {...register("rastreio.rota")}
                className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                Código da Rota do Rastreio
              </label>
              <input
                type="text"
                disabled={true}
                tabIndex={-1}
                {...register("rastreio.rota")}
                className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[9px] font-black text-gray-400 mb-0.5 uppercase tracking-wider">
                Descrição da Rota do Rastreio
              </label>
              <input
                type="text"
                disabled={true}
                tabIndex={-1}
                {...register("rastreio.descricao")}
                className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs outline-none text-gray-600 font-medium select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      )}

      <SelecaoModal
        open={modalSelecaoLinhaOpen}
        chave={FastcrudConsultasConfig.get().buscarLinhasTransferencia}
        onClose={() => setModalSelecaoLinhaOpen(false)}
        titulo="Seleção de Linha"
        onSelect={(row) => {
          console.log(row);
        }}
        filtrosFixos={[
          { field: "CODIGO_ORIGEM_TRECHO", operation: "=", value: "180" },
        ]}
      />
      <SelecaoModal
        open={modalSelecaoTrechoOpen}
        chave={FastcrudConsultasConfig.get().buscarTrechosPorLinhaTransferencia}
        onClose={() => setModalSelecaoTrechoOpen(false)}
        titulo="Seleção de Trecho"
        onSelect={(row) => {
          console.log(row);
        }}
        filtrosFixos={[
          { field: "LIV_CODIGO", operation: "=", value: String(watch("linha.codigo")) },
        ]}
      />
    </div>
  );
}
