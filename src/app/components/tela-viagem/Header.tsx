"use client";

import { STATUS_TRADUCAO } from "@constants/traducao";
import { Clipboard, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetarViagemNaUrl } from "../../client-utils/search-params";

export default function Header({ viagem }: { viagem: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onClose = () => router.replace(resetarViagemNaUrl(searchParams));

  const status = STATUS_TRADUCAO[viagem.status] || STATUS_TRADUCAO.SEM_STATUS;

  return (
    <div className="bg-primary p-3 text-white flex justify-between items-center shrink-0">
      <div className="flex items-center gap-2">
        <Clipboard className="w-5 h-5" />
        <div>
          <h2 className="font-bold text-base leading-tight">
            {viagem.codigo && viagem.codigo !== 0 ? `#${viagem.codigo} | ` : ""}
            {viagem.linha.descricao || "Nova Viagem"}
          </h2>
          <p className="text-[10px] text-white/60">
            {viagem.codigo && viagem.codigo !== 0
              ? `Código: ${viagem.codigo}`
              : "Ainda não gerada"}{" "}
            • {status.label}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
