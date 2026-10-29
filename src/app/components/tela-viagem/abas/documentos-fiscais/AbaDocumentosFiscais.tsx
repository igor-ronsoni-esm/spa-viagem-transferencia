"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { ViagemOutput } from "@/src/modules/domain/viagem/schemas/viagem.schema";
import TabelaHead from "./tabela/Head";
import TabelaBody from "./tabela/Body";

export default function AbaDocumentosFiscais() {
  const { control } = useFormContext<ViagemOutput>();
  const { fields: documentos } = useFieldArray({ control, name: "documentosFiscais" });
  
  return (
    <div className="space-y-4">
      <div className="overflow-hidden border border-gray-100 rounded-xl bg-white shadow-sm">
        <table className="w-full text-left border-collapse table-fixed">
          <TabelaHead />
          <tbody>
            {documentos.map((doc, index) => {
              return <TabelaBody documento={doc} key={index} />
            })}
            {documentos.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-[10px] text-gray-400 font-medium italic"
                >
                  Sem documentos fiscais cadastrados para esta viagem.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
