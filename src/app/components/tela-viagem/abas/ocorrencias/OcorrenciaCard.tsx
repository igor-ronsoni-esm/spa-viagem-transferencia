import { STATUS_TRADUCAO } from "@/src/app/constants";
import { dataHoraISO } from "@/src/modules/utils/data.util";
import { OcorrenciaViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { cn } from "@modules/utils/css.util";

type Props = {
  index: number,
  ocorrencia: OcorrenciaViagemOutput,
  ultimo: boolean,
}

export default function OcorrenciaCard({ index, ocorrencia, ultimo }: Readonly<Props>) {
  return (
    <div key={index} className="relative pl-6 mb-3.5 last:mb-0 flex items-center">
      {!ultimo && <div className="absolute left-3 top-6 w-px h-full bg-gray-300" />}
      <div
        className={cn(
          "absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary transition-all z-10",
          ocorrencia.vigente
            ? "bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
            : "bg-white",
        )}
      />
      <div
        className={cn("flex-1 p-2 rounded-lg border transition-all bg-white border-primary/20 shadow-sm items-center")}
      >
        <div className="flex justify-between items-center mb-0.5">
          <span
            className={cn(
              "text-[11px] font-bold",
              ocorrencia.vigente ? "text-primary" : "text-gray-500",
            )}
          >
            {ocorrencia.codigo} | {STATUS_TRADUCAO[ocorrencia.chave]?.label ?? STATUS_TRADUCAO["DESCONHECIDO"].label}
          </span>
          <span className="text-[11px] text-gray-700 font-bold">
            {dataHoraISO(new Date(ocorrencia.dataLancamento))}
          </span>
        </div>
      </div>
    </div>
  );
}
