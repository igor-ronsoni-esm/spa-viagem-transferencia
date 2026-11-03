"use client";

import { ClipboardList } from "lucide-react";
import { useFormularioContext } from "@contexts/formulario/FormularioProvider";

export default function SemDocumentos() {
  const { modoEdicao } = useFormularioContext();

  return (
    <div className="py-12 px-4 text-center bg-white rounded-xl border border-gray-100 border-dashed space-y-3">
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400">
        <ClipboardList className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-black uppercase text-gray-700">
          Nenhum documento de carga vinculado à viagem
        </h4>
        <p className="text-[11px] text-gray-400 max-w-md mx-auto">
          {modoEdicao
            ? "Utilize os botões de ação acima para adicionar todos os documentos da configuração da linha ou escolher documentos específicos da empresa."
            : "Clique no botão 'EDITAR VIAGEM' acima para habilitar as ações de adicionar ou vincular documentos."}
        </p>
      </div>
    </div>
  );
}