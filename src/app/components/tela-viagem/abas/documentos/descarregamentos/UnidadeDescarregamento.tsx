"use client";

import { useContext } from "react";
import { ViagemContext } from "../../../context/ViagemContext";
import { DescarregamentoOutput, SituacaoDescarregamentoEnum, SituacaoDescarregamentoEnumOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { cn } from "@modules/utils/css.util";
import { EmpresaOutput } from "@modules/domain/empresa/schemas/empresa.schema";
import { useEmpresasContext } from "@/src/app/contexts/EmpresasProvider";

type Props = {
  descarregamento: DescarregamentoOutput
}

export default function UnidadeDescarregamento({ descarregamento }: Readonly<Props>) {
  const { modoEdicao } = useContext(ViagemContext);
  const { empresas } = useEmpresasContext();

  const handleAlterarSituacao = (situacao: SituacaoDescarregamentoEnumOutput) => {
    // TODO: substituir pela lógica de alterar situação do descarregamento
  }

  const handleSelecionarEmpresa = (empresa: EmpresaOutput) => { 
    // TODO: substituir pela lógica de selecionar empresa do descarregamento
  }

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-3 py-2.5 align-middle">
        <select
          disabled={!modoEdicao}
          value={descarregamento.situacao}
          onChange={(e) => handleAlterarSituacao(e.target.value as SituacaoDescarregamentoEnumOutput)}
          className={cn(
            "px-2 py-1 rounded-lg text-[10px] font-black uppercase outline-none transition-all",
            descarregamento.situacao === SituacaoDescarregamentoEnum.S
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-gray-100 text-gray-600 border border-gray-200",
            !modoEdicao &&
              "opacity-70 cursor-not-allowed pointer-events-none",
          )}
        >
          <option value={SituacaoDescarregamentoEnum.S}>Executa</option>
          <option value={SituacaoDescarregamentoEnum.N}>Não executa</option>
        </select>
      </td>

      <td className="px-3 py-2.5 align-middle">
        <select
          disabled={!modoEdicao}
          value={descarregamento.empresa.sigla || ""}
          onChange={(e) => handleSelecionarEmpresa(empresas.find(empresa => empresa.codigo === Number(e.target.value))!)}
          className={cn(
            "w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-800 font-bold outline-none focus:ring-2 focus:ring-primary/20",
            !modoEdicao &&
              "bg-gray-50 text-gray-500 cursor-not-allowed pointer-events-none",
          )}
        >
          <option value="">Selecione a empresa...</option>
          {empresas.map((empresa) => (
            <option key={empresa.codigo} value={empresa.codigo}>
              {empresa.codigo} - {empresa.descricao} ({empresa.sigla})
            </option>
          ))}
        </select>
      </td>

      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-1">
          <input
            type="number"
            min="0"
            max="99"
            disabled={!modoEdicao}
            value={descarregamento.percurso ?? "00:00:00"}
            className="w-12 bg-white border border-gray-200 rounded-lg p-1 text-xs text-center font-bold outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50"
          />
          <span className="text-[10px] font-bold text-gray-500">h</span>
        </div>
      </td>
    </tr>
  );
}
