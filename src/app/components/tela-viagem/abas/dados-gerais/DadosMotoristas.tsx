"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { Plus, Trash, Users } from "lucide-react";
import { useFormularioContext } from "@contexts/formulario/FormularioProvider";
import { TipoMotoristaEnum } from "@modules/domain/viagem/schemas/dados-viagem/motorista/tipo-motorista.schema";
import { cn } from "@modules/utils/css.util";
import SelecaoModalApi from "@components/tela-viagem/modals/selecao-dados/v2/SelecaoModalApi";
import ConsultasConfig from "@configs/environment/consultas.config";
import { FiltroInput } from "@modules/domain/api-consulta/schemas/filtro.schema";
import { useSelecaoEmpresaContext } from "@contexts/empresa/SelecaoEmpresaProvider";
import { MotoristaOutput } from "@modules/domain/viagem/schemas/dados-viagem/motorista/motorista.schema";
import { Tooltip } from "@mui/material";

type MotoristaViagemType = ViagemOutput["motoristas"][number];

export default function DadosMotoristas() {
  const [modalSelecaoMotoristaOpen, setModalSelecaoMotoristaOpen] = useState<boolean>(false);
  const [filtrosFixoSelecaoMotoristas, setFiltrosFixoSelecaoMotoristas] = useState<FiltroInput[]>([]);

  const { modoEdicao } = useFormularioContext();
  const { empresa } = useSelecaoEmpresaContext();

  const { control } = useFormContext<ViagemOutput>();
  const { fields: motoristas, append, update, remove } = useFieldArray({ control, name: "motoristas" });

  const semMotoristaSelecionado = 
    motoristas === null || 
    motoristas === undefined || 
    motoristas?.length === 0 || 
    !motoristas?.some((v) => v.tipo === TipoMotoristaEnum.TITULAR);

  const alterarMotoristaPrincipal = (index: number) => {
    const indexMotoristaAtual = motoristas.findIndex((m) => m.tipo === TipoMotoristaEnum.TITULAR);

    const motoristaPrincipal = motoristas[indexMotoristaAtual];
    const motoristaSelecionado = motoristas[index];

    update(indexMotoristaAtual, { ...motoristaPrincipal, tipo: motoristaSelecionado.tipo });
    update(index, { ...motoristaSelecionado, tipo: TipoMotoristaEnum.TITULAR });
  };

  const mapFromDadoConsulta = (motorista: any): MotoristaOutput => {
    if (!motorista) return null;
    
    return {
      codigo: null,
      tipo: null,
      funcionario: {
        codigo: motorista['FUN.FUN_CODIGO'],
        nome: motorista['CLD.CLD_DESCRICAO'],
      }
    }
  }
  
  const handleAdicionarMotorista = (parametro: any) => {
    const motorista = mapFromDadoConsulta(parametro)
    const existeMotoristaTitular = motoristas?.some((m) => m.tipo === TipoMotoristaEnum.TITULAR);
    const tipo = !existeMotoristaTitular ? TipoMotoristaEnum.TITULAR : TipoMotoristaEnum.RESERVA;

    append({ codigo: null, tipo: tipo, funcionario: motorista.funcionario });
  }

  const onFiltrosFixos = (motoristaViagem: MotoristaViagemType[]) => {
    // TODO: Realizar filtro por motorista de acordo com empresa do veiculo. A busca precisa depender do veiculo principal selecionado
    const filtros: FiltroInput[] = [];
    
    motoristaViagem.forEach(({ funcionario }) => {
      filtros.push({ campo: "FUN.FUN_CODIGO", operacao: "<>", valor: funcionario.codigo });
    });

    if (empresa) { // TODO: Isso deverá deixar de existir
      filtros.push({ campo: "EMP.EMP_CODIGO", operacao: "=", valor: empresa.codigo });
    }
    setFiltrosFixoSelecaoMotoristas(filtros);
  };
  
  useEffect(() => {
      onFiltrosFixos(motoristas)
    }, [motoristas])

  return (
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
            {motoristas?.length ?? 0}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {motoristas?.map((motorista, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50/50 rounded-lg border border-gray-50"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-700 leading-tight">
                  {motorista.funcionario.nome}
                </span>
                <span className="text-[9px] text-gray-400 font-medium">
                  Código: {motorista.funcionario.codigo}
                </span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                {modoEdicao ? (
                  <button
                    type="button"
                    onClick={() => alterarMotoristaPrincipal(index)}
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-tighter cursor-pointer transition-all",
                      motorista.tipo === TipoMotoristaEnum.TITULAR
                        ? "bg-primary text-white shadow-xs"
                        : "bg-gray-200 text-gray-500",
                    )}
                  >
                    {motorista.tipo}
                  </button>
                ) : (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-tighter",
                      motorista.tipo === TipoMotoristaEnum.TITULAR
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-400",
                    )}
                  >
                    {motorista.tipo}
                  </span>
                )}
                <Tooltip arrow title="Remover motorista da viagem">
                  <span>
                    <button type="button" onClick={() => remove(index)} className="group" disabled={!modoEdicao}>
                      <Trash className={cn("w-3.5 h-3.5 text-red-500 transition-transform duration-200 group-hover:scale-110", !modoEdicao && "text-gray-400 opacity-50 cursor-not-allowed")} />
                    </button>
                  </span>
                </Tooltip>
              </div>
            </div>
          ))}

          {semMotoristaSelecionado && (
            <p className="text-[10px] text-gray-400 italic text-center py-4 bg-gray-50/20 rounded-lg">
              Nenhum motorista selecionado
            </p>
          )}
        </div>
      </div>

      {modoEdicao && (
        <button
          type="button"
          onClick={() => setModalSelecaoMotoristaOpen(true)}
          className="w-full border-2 border-dashed border-primary/20 hover:border-primary/50 text-primary/80 hover:text-primary rounded-lg py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
        >
          <Plus className="w-3.5 h-3.5" /> Selecionar Motorista(s)
        </button>
      )}

      <SelecaoModalApi
        open={modalSelecaoMotoristaOpen}
        chaveConsulta={ConsultasConfig.get().buscarMotoristas}
        titulo="Selecionar Motorista"
        filtrosFixos={filtrosFixoSelecaoMotoristas}
        handleFechar={() => setModalSelecaoMotoristaOpen(false)}
        handleSelecionarRegistro={(row: any) => handleAdicionarMotorista(row)}
        colunaChavePrimaria="FUN.FUN_CODIGO"
      />
    </div>
  );
}
