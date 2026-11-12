"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { VeiculoOutput } from "@modules/domain/veiculos/schemas/veiculo.schema";
import { Plus, Trash, Truck } from "lucide-react";
import { cn } from "@modules/utils/css.util";
import { useFormularioContext } from "@contexts/formulario/FormularioProvider";
import { TIPO_VEICULO_TRADUCAO } from "@constants/traducao";
import { TipoRodadoVeiculoEnum, TipoRodadoVeiculoEnumMap } from "@modules/domain/veiculos/schemas/tipo-rodado.schema";
import { toast } from "@modules/components/feedbacks/toast/use-toast";
import { Tooltip } from "@mui/material";
import SelecaoModalApi from "@components/tela-viagem/modals/selecao-dados/v2/SelecaoModalApi";
import { FiltroInput } from "@modules/domain/api-consulta/schemas/filtro.schema";
import { TipoTransferenciaEnum } from "@modules/domain/viagem/schemas/dados-viagem/tipo-transferencia.schema";
import { TipoProprietarioTrechoEnum, TipoProprietarioTrechoMap } from "@modules/domain/linhas-transferencia/schemas/tipo-proprietario-trecho.schema";
import { TipoEmpresaEnum, TipoEmpresaEnumMap } from "@modules/domain/empresa/schemas/tipo-empresa.schema";
import ConsultasConfig from "@configs/environment/consultas.config";

type VeiculoViagemType = ViagemOutput["veiculos"][number];

export default function DadosVeiculos() {
  const [modalSelecaoVeiculoOpen, setModalSelecaoVeiculoOpen] = useState<boolean>(false);
  const [filtrosFixoSelecaoVeiculos, setFiltrosFixoSelecaoVeiculos] = useState<FiltroInput[]>([]);
  const [todosOsVeiculos, setTodosOsVeiculos] = useState<boolean>(false);

  const { modoEdicao } = useFormularioContext();
  const { control, getValues } = useFormContext<ViagemOutput>();
  const { fields: veiculosEmViagem, append, remove } = useFieldArray({ control, name: "veiculos" });

  const semVeiculoSelecionado = 
    veiculosEmViagem === null || 
    veiculosEmViagem === undefined || 
    veiculosEmViagem?.length === 0 || 
    !veiculosEmViagem?.some((v) => v.principal);
  
  const mapFromDadoConsulta = (veiculo: any): VeiculoOutput => {
    if (!veiculo) return null;
    return {
      codigo: veiculo['VEI.VEI_CODIGO'],
      placa: veiculo['VEI.VEI_PLACA'],
      descricao: veiculo['MOD.MOD_DESCRICAO'],
      tipo: null,
      codigoEmpresa: null,
      tipoRodado: veiculo['TIP.TIP_DESCRICAO'],
    }
  }

  const handleAdicionarVeiculo = (parametro: any) => {
    const veiculo = mapFromDadoConsulta(parametro)

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

    const filtros: FiltroInput[] = [];
    
    veiculosViagem.forEach(({ veiculo }) => {
      filtros.push({ campo: "VEI.VEI_CODIGO", operacao: "<>", valor: veiculo.codigo });
    });
    
    const veiculoPrincipalEstaNaViagem = veiculosViagem?.some((v) => v.principal);
    const veiculoSecundarioEscaNaViagem = veiculosViagem?.some((v) => !v.principal);

    if (!veiculoPrincipalEstaNaViagem) filtros.push({ campo: "TIP.TIP_CODIGO", operacao: "=", valor: TipoRodadoVeiculoEnumMap[tipoVeiculoPrincipal] });
    else if (!veiculoSecundarioEscaNaViagem) filtros.push({ campo: "TIP.TIP_CODIGO", operacao: "=", valor: TipoRodadoVeiculoEnumMap[tipoVeiculoSecundario] });
    else filtros.push({ campo: "TIP.TIP_CODIGO", operacao: "=", valor: 0 });
    
    if (!todosOsVeiculos) {
      if (getValues("linha.trecho.tipoProprietarioVeiculo") === TipoProprietarioTrechoEnum.PROPRIO) 
        filtros.push({ campo: "EMP.EMP_TIPO", operacao: "<>", valor: TipoEmpresaEnumMap[TipoEmpresaEnum.AGENCIA] });
      else {
        const trecho = getValues("linha.trecho");
        const sub_consulta: string = `(SELECT CASE WHEN ORI.EMP_TIPO = 'A' THEN ORI.EMP_CODIGO ELSE DEST.EMP_CODIGO END AS CODIGO FROM T_EMPRESA ORI, T_EMPRESA DEST WHERE ORI.CLD_CODIGO = ${trecho?.origem?.codigo} AND DEST.CLD_CODIGO = ${trecho?.destino?.codigo})`

        filtros.push({
          campo: "EMP.EMP_CODIGO",
          operacao: "=",
          valor: sub_consulta,
        });
      }

      if (getValues("tipoTransferencia") !== TipoTransferenciaEnum.ROTA_ALTERNATIVA) {
        filtros.push({
          campo: "VEI.VEI_TIPO",
          operacao: "=",
          valor: TipoProprietarioTrechoMap[getValues("linha.trecho.tipoProprietarioVeiculo")],
        });
      }
    }

    setFiltrosFixoSelecaoVeiculos(filtros);
  };

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
              <div className="flex flex-1 flex-row min-w-0 justify-between">
                <div className="flex flex-col items-between">
                  <span className="text-xs font-bold text-gray-700">
                    {frota.veiculo.placa} | {frota.veiculo.tipoRodado}
                  </span>
                   <span className="text-[11px] text-gray-400 truncate">
                    {frota.veiculo.codigo} | {frota.veiculo.descricao}
                  </span>
                  
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <div className="flex flex-col gap-2 items-center">
                    {frota?.veiculo?.tipo && 
                      <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-1 rounded">
                        {TIPO_VEICULO_TRADUCAO[frota.veiculo.tipo]?.label ?? frota.veiculo.tipo}
                      </span>
                    }
                    <span className={cn("text-[10px] font-bold bg-gray-200 px-1 rounded uppercase", 
                      frota.principal ? 
                        "bg-primary text-white shadow-xs" : "bg-gray-200 text-gray-500"
                        )}>
                      {frota.principal ? "PRINCIPAL" : "SECUNDÁRIO"}
                    </span>
                  </div>
                  <Tooltip arrow title="Remover veículo da viagem">
                    <span>
                      <button type="button" onClick={() => remove(index)} className="group" disabled={!modoEdicao}>
                        <Trash className={cn("w-3.5 h-3.5 text-red-500 transition-transform duration-200 group-hover:scale-110", !modoEdicao && "text-gray-400 opacity-50 cursor-not-allowed")} />
                      </button>
                    </span>
                  </Tooltip>
                </div>
              </div>
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

      <SelecaoModalApi
        open={modalSelecaoVeiculoOpen}
        chaveConsulta={ConsultasConfig.get().buscarVeiculos}
        titulo="Selecionar Veículo"
        filtrosFixos={filtrosFixoSelecaoVeiculos}
        handleFechar={() => setModalSelecaoVeiculoOpen(false)}
        handleSelecionarRegistro={(row: any) => handleAdicionarVeiculo(row)}
        colunaChavePrimaria="VEI.VEI_CODIGO"
      />
    </div>
  );
}