import { Clock } from "lucide-react";

export default function OcorrenciaHeader() {
  return (
    <div className="flex items-center gap-1.5 mb-4">
      <Clock className="w-3.5 h-3.5 text-primary" />
      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
        Linha do Tempo
      </h3>
    </div>
  );
}
