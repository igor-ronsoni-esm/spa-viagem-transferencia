import OcorrenciaHeader from "./OcorrenciaHeader";
import { useFieldArray, useFormContext } from "react-hook-form";
import OcorrenciaCard from "./OcorrenciaCard";
import { ViagemOutput } from "@/src/modules/domain/viagem/schemas/viagem.schema";

export default function AbaOcorrencias() {
  const { control } = useFormContext<ViagemOutput>();
  const { fields: ocorrencias } = useFieldArray({ control, name: "ocorrencias" })

  return (
    <div className="flex flex-col w-full space-y-1">
      <OcorrenciaHeader />
      {ocorrencias.map((ocorrencia, index) => (
        <OcorrenciaCard key={index} index={index} ocorrencia={ocorrencia} ultimo={index === ocorrencias.length - 1} />
      ))}
    </div>
  );
}
