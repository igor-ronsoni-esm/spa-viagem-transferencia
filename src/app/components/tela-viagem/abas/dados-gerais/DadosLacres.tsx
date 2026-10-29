import { ViagemOutput } from "@modules/domain/viagem/schemas/viagem.schema";
import { Clipboard } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function DadosLacres() {
  const { register } = useFormContext<ViagemOutput>();

  return (
    <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-4 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100/50">
        <div className="flex items-center gap-2">
          <Clipboard className="w-4 h-4 text-gray-400" />
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
            Lacres (Vários Lacres)
          </h4>
        </div>
        <span className="text-[8px] font-black bg-gray-200 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">
          DESABILITADO
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 opacity-50 cursor-not-allowed">
        <div>
          <label className="block text-[9px] text-gray-400 mb-0.5 uppercase tracking-wider font-bold">
            Lacre nº 1
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            {...register("lacres.0.numero")}
            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-600 font-bold select-none pointer-events-none"
          />
        </div>

        <div>
          <label className="block text-[9px] text-gray-400 mb-0.5 uppercase tracking-wider font-bold">
            Lacre nº 2
          </label>
          <input
            type="text"
            disabled={true}
            tabIndex={-1}
            {...register("lacres.1.numero")}
            className="w-full bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs outline-none text-gray-600 font-bold select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
