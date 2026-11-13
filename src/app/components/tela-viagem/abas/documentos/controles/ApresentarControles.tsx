"use client";

import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { useFieldArray, useFormContext } from "react-hook-form";
import SemDocumentos from "./SemDocumentos";
import ControlesPorDescarregamento from "./ControlesPorDescarregamento";

export default function ApresentarControles() {
  const { control } = useFormContext<ViagemOutput>();
  const { fields: documentos } = useFieldArray({ control, name: "documentos" });
  // TODO: implementar opção de remover controles individualmente da viagem
  return (
    <div className="space-y-2">
      {(documentos || []).length === 0 ? (
        <SemDocumentos />
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          {(documentos || []).map((field, index) => (
            <ControlesPorDescarregamento key={field.id} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
