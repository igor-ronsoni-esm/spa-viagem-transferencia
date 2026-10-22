"use client";

import { ViagemOutput } from "@modules/domain/viagem/schemas/resultado-consulta-viagens.schema";

import { CardViagem } from "./CardViagem";

type Props = {
  viagens: ViagemOutput[];
};

export default function ListagemViagens({ viagens }: Readonly<Props>) {
  return (
    <div className="flex flex-col gap-1.5 min-h-0">
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
        {viagens.map((viagem) => (
          <div key={viagem.viagem.execucao.codigo}>
            <CardViagem viagem={viagem} />
          </div>
        ))}
      </div>
    </div>
  );
}
