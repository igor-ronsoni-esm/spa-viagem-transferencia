"use client";

import { cn } from "@modules/utils/css.util";
import { EmpresaOutput } from "@modules/domain/empresa/schemas/empresa.schema";
import { DescarregamentoViagemOutput } from "@modules/domain/viagem/schemas/dados-viagem/descarregamento/descarregamento-viagem.schema";
import { useFormularioContext } from "@contexts/formulario/FormularioProvider";
import { useEmpresasContext } from "@contexts/empresas/EmpresasProvider";
import { SituacaoDescarregamentoEnum, SituacaoDescarregamentoEnumOutput } from "@modules/domain/viagem/schemas/dados-viagem/descarregamento/situacao.schema";
import { TempoPercursoInput } from "@modules/components/inputs/TempoPercursoInput";
import { Tooltip } from "@mui/material";
import { Search, Trash } from "lucide-react";
import SelecaoModal from "@components/tela-viagem/modals/selecao-dados/v2/SelecaoModal";
import { useState } from "react";
import { ColunaOutput } from "@modules/domain/api-consulta/schemas/coluna.schema";
import { useFormContext } from "react-hook-form";
import SelecaoModalLocal from "@components/tela-viagem/modals/selecao-dados/v2/SelecaoModalLocal";

type DescarregamentoViagemType = DescarregamentoViagemOutput & { id: string };

const COLUNAS_CONSULTA_EMPRESA: ColunaOutput[] = [
  {
    displayName: "Código",
    fieldName: "codigo",
    size: 100,
    initialFilter: "N",
    fieldType: "Integer",
  },
  {
    displayName: "Sigla",
    fieldName: "sigla",
    size: 100,
    initialFilter: "S",
    fieldType: "String",
  },
  {
    displayName: "Descrição",
    fieldName: "descricao",
    size: 100,
    initialFilter: "N",
    fieldType: "String",
  }
]

type Props = {
  index: number;
  remove: (index: number) => void;
  update: (index: number, descarregamento: DescarregamentoViagemType) => void;
}

export default function UnidadeDescarregamento({ index, remove, update }: Readonly<Props>) {
  const [selecaoEmpresaOpen, setSelecaoEmpresaOpen] = useState<boolean>(false);
  const { watch } = useFormContext();
  const { modoEdicao } = useFormularioContext();
  const { empresas } = useEmpresasContext();

  const descarregamento = watch(`descarregamentos.${index}`);

  const handleAlterarSituacao = (situacao: SituacaoDescarregamentoEnumOutput) => {
    update(index, {
      ...descarregamento,
      situacao,
    });
  }
  
  const handleSelecionarEmpresa = (empresa: EmpresaOutput) => {
    update(index, {
      ...descarregamento,
      empresa,
    });
  }

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-3 py-2.5">
        <select
          disabled={!modoEdicao}
          value={descarregamento.situacao}
          onChange={(e) => handleAlterarSituacao(e.target.value as SituacaoDescarregamentoEnumOutput)}
          className={cn(
            "px-2 py-1 rounded-lg text-[10px] font-black uppercase outline-none transition-all",
            descarregamento.situacao === SituacaoDescarregamentoEnum.S
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-600 border border-red-200",
            !modoEdicao &&
              "opacity-70 cursor-not-allowed pointer-events-none",
          )}
        >
          <option value={SituacaoDescarregamentoEnum.S}>Executa</option>
          <option value={SituacaoDescarregamentoEnum.N}>Não executa</option>
        </select>
      </td>
      <td className="px-3 py-2.5 text-xs align-middle text-gray-800 font-bold">
        <div className="flex flex-row w-full justify-between items-center">
          <span className="truncate">{descarregamento.empresa?.sigla || ""}</span>
          {descarregamento.incluidoNaEdicao && modoEdicao && 
            <Tooltip arrow title="Selecionar empresa para descarregamento">
              <button 
                type="button" 
                onClick={() => setSelecaoEmpresaOpen(true)} 
                className="ml-2 text-gray-600 px-2 py-1 rounded transition-transform hover:-translate-y-1 flex items-center"
              >
                <Search className="w-3.5 h-3.5" />  
              </button>
            </Tooltip>
          }
        </div>
        <SelecaoModalLocal<EmpresaOutput>
          open={selecaoEmpresaOpen}
          titulo="Seleção Empresa Descarregamento"
          colunas={COLUNAS_CONSULTA_EMPRESA}
          dados={empresas}
          chavePrimaria="codigo"
          handleFechar={() => setSelecaoEmpresaOpen(false)}
          onSelecionar={(row) => handleSelecionarEmpresa(row as EmpresaOutput)}
        />
      </td>
      <td className="px-3 py-2.5 text-xs">
        {descarregamento.empresa?.descricao || ""}
      </td>

      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-1">
          <TempoPercursoInput
            name={`descarregamentos.${index}.percurso`}
            disabled={!modoEdicao}
            rules={{
              validate: (valor) =>
                !valor || /^\d{2}:\d{2}$/.test(valor) || "Informe um tempo no formato HH:MM",
            }}
          />
        </div>
      </td>
      <td className="px-3 py-2.5 align-middle">
        {descarregamento.incluidoNaEdicao && modoEdicao &&
          <Tooltip arrow title="Remover descarregamento">
            <span>
              <button 
                type="button" 
                onClick={() => remove(index)} 
                className="group" 
                disabled={!modoEdicao || !descarregamento.incluidoNaEdicao}
              >
                <Trash className={cn("w-3.5 h-3.5 text-red-500 transition-transform duration-200 group-hover:scale-110", 
                  !modoEdicao && "text-gray-400 opacity-50 cursor-not-allowed")} />
              </button>
            </span>
          </Tooltip>
        }
      </td>
    </tr>
  );
}
