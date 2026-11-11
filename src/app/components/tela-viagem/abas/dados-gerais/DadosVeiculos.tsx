"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { VeiculoOutput } from "@modules/domain/veiculos/schemas/veiculo.schema";
import { Plus, Trash, Truck } from "lucide-react";
import { cn } from "@modules/utils/css.util";
import { useFormularioContext } from "@contexts/formulario/FormularioProvider";
import { TIPO_VEICULO_TRADUCAO } from "@constants/traducao";
import { TipoRodadoVeiculoEnum } from "@modules/domain/veiculos/schemas/tipo-rodado.schema";
import { toast } from "@modules/components/feedbacks/toast/use-toast";
import { ColunaSelecao, SearchFilter } from "@components/tela-viagem/modals/selecao-dados/types";
import { useVeiculosContext } from "@contexts/veiculos/VeiculosProvider";
import SelecaoModal from "@components/tela-viagem/modals/selecao-dados/SelecaoModal";
import { Tooltip } from "@mui/material";

const COLUNAS_VEICULO: ColunaSelecao[] = [
  { campoSQL: "codigo", caption: "Código", tipoCampo: "integer", chavePrimaria: true },
  { campoSQL: "placa", caption: "Placa", tipoCampo: "string" },
  { campoSQL: "descricao", caption: "Descrição", tipoCampo: "string" },
  { campoSQL: "tipo", caption: "Tipo", tipoCampo: "string" },
  { campoSQL: "tipoRodado", caption: "Rodado", tipoCampo: "string" },
];

type VeiculoViagemType = ViagemOutput["veiculos"][number];

export default function DadosVeiculos() {
  const [modalSelecaoVeiculoOpen, setModalSelecaoVeiculoOpen] = useState<boolean>(false);
  const [filtrosFixoSelecaoVeiculos, setFiltrosFixoSelecaoVeiculos] = useState<SearchFilter[]>([]);
  const [todosOsVeiculos, setTodosOsVeiculos] = useState<boolean>(false);

  const { modoEdicao } = useFormularioContext();
  const { control, getValues } = useFormContext<ViagemOutput>();
  const { fields: veiculosEmViagem, append, remove } = useFieldArray({ control, name: "veiculos" });
  const { veiculos: listaVeiculos, loading } = useVeiculosContext();

  const semVeiculoSelecionado = 
    veiculosEmViagem === null || 
    veiculosEmViagem === undefined || 
    veiculosEmViagem?.length === 0 || 
    !veiculosEmViagem?.some((v) => v.principal);
  

  const handleAdicionarVeiculo = (veiculo: VeiculoOutput) => {
    if (veiculosEmViagem?.some((v) => v.veiculo.codigo === veiculo.codigo)) return;
    
    let principal = false;
    if (![
      TipoRodadoVeiculoEnum["REBOQUE (JULIETA)"].toString(), 
      TipoRodadoVeiculoEnum["SEMI-REBOQUE (CARRETA)"].toString()]
      .includes(veiculo.tipoRodado)) principal = true;
    
    if (principal && veiculosEmViagem?.some((v) => v.principal)) {
      toast.error("Já existe um veículo principal selecionado.");
      return;
    }

    append({ codigo: null, principal: principal, veiculo });
  }
  
  const onFiltrosFixos = (veiculosViagem: VeiculoViagemType[]) => {
    const tipoVeiculoPrincipal = getValues("linha.trecho.tipoVeiculoPrincipal")
    const tipoVeiculoSecundario = getValues("linha.trecho.tipoVeiculoSecundario")

    const filtro1: SearchFilter[] = veiculosViagem.map((frota) => ({ field: "codigo", operation: "<>", value: String(frota.veiculo.codigo) }));

    const filtro2: SearchFilter[] = []
    const veiculoPrincipalFoiAdicionadoAViagem = veiculosViagem?.length > 0 && veiculosViagem?.some((v) => v.principal);
    const veiculoSecundarioFoiAdicionadoAViagem = 
      veiculosViagem?.length > 0 
      && !!tipoVeiculoSecundario 
      && veiculosViagem?.some((v) => v.veiculo.tipoRodado === tipoVeiculoSecundario);

    if (todosOsVeiculos) {}
    else if (!veiculoPrincipalFoiAdicionadoAViagem)
      filtro2.push({ field: "tipoRodado", operation: "=", value: String(tipoVeiculoPrincipal)})
    else if (!!tipoVeiculoSecundario && !veiculoSecundarioFoiAdicionadoAViagem)
      filtro2.push({ field: "tipoRodado", operation: "=", value: String(tipoVeiculoSecundario)})
    else 
      filtro2.push({ field: "tipoRodado", operation: "=", value: String("-1")})

    const filtro3: SearchFilter[] = [];
    if (!todosOsVeiculos) filtro3.push({ field: "codigoEmpresa", operation: "<>", value: "0" });

    setFiltrosFixoSelecaoVeiculos([...filtro1, ...filtro2, ...filtro3]);
  }

  useEffect(() => {
    onFiltrosFixos(veiculosEmViagem)
  }, [veiculosEmViagem, todosOsVeiculos])

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-gray-50 mb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">
              Lista de Veículos para a Viagem
            </h4>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-row items-center font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full mr-2 select-none">
              <input 
                id="todosOsVeiculos" 
                type="checkbox" 
                disabled={!modoEdicao}
                checked={todosOsVeiculos} 
                onChange={() => setTodosOsVeiculos(!todosOsVeiculos)} 
                className={cn("mr-2 accent-primary", { "cursor-not-allowed": !modoEdicao })}/>
              <label htmlFor="todosOsVeiculos" className="text-[11px]">
                Todos os veículos
              </label>
            </div>
            <span className="text-[11px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {veiculosEmViagem?.length ?? 0}
            </span>

          </div>
        </div>

        <div className="space-y-2 mb-4">
          {veiculosEmViagem?.map((frota, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 bg-gray-50/50 rounded-lg border border-gray-50 text-left"
            >
              <div className="w-8 h-8 rounded bg-white border border-gray-100 overflow-hidden flex shrink-0 items-center justify-center text-gray-400 font-bold text-xs uppercase">
                <Truck className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex flex-1 flex-col min-w-0 gap-1">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-gray-700">
                    {frota.veiculo.placa} | {frota.veiculo.tipoRodado}
                  </span>
                  <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-1 rounded">
                    {TIPO_VEICULO_TRADUCAO[frota.veiculo.tipo]?.label ?? frota.veiculo.tipo}
                  </span>
                  
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-400 truncate">
                    {frota.veiculo.codigo} | {frota.veiculo.descricao}
                  </span>
                  <span className={cn("text-[10px] font-bold bg-gray-200 px-1 rounded uppercase", 
                    frota.principal ? 
                      "bg-primary text-white shadow-xs" : "bg-gray-200 text-gray-500"
                      )}>
                    {frota.principal ? "PRINCIPAL" : "SECUNDÁRIO"}
                  </span>
                </div>
               
              </div>
              <Tooltip arrow title="Remover veículo da viagem">
                <span>
                  <button type="button" onClick={() => remove(index)} className="group" disabled={!modoEdicao}>
                    <Trash className={cn("w-3.5 h-3.5 text-red-500 transition-transform duration-200 group-hover:scale-110", !modoEdicao && "text-gray-400 opacity-50 cursor-not-allowed")} />
                  </button>
              </span>
              </Tooltip>
            </div>
          ))}

          {semVeiculoSelecionado && (
            <p className="text-[10px] text-gray-400 italic text-center py-4 bg-gray-50/20 rounded-lg">
              Nenhum veículo selecionado
            </p>
          )}
        </div>
      </div>

      {modoEdicao && (
        <button
          type="button"
          onClick={() => setModalSelecaoVeiculoOpen(true)}
          className="w-full border-2 border-dashed border-primary/20 hover:border-primary/50 text-primary/80 hover:text-primary rounded-lg py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
        >
          <Plus className="w-3.5 h-3.5" /> Selecionar Veículo(s)
        </button>
      )}

      <SelecaoModal
        open={modalSelecaoVeiculoOpen}
        titulo={"Seleção de Veículo"}
        colunas={COLUNAS_VEICULO}
        dados={listaVeiculos}
        filtrosFixos={filtrosFixoSelecaoVeiculos}
        carregando={loading}
        onClose={() => setModalSelecaoVeiculoOpen(false)}
        onSelect={handleAdicionarVeiculo}
      />
    </div>
  );
}