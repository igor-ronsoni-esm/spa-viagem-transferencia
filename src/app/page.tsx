import { AnimatePresence } from "motion/react";
import SideBarContent from "./components/side-bar/SideBarContent";
import TelaViagem from "./components/tela-viagem/TelaViagem";
import PainelOperacao from "./components/PainelOperacao";
import { requireNumber } from "../modules/utils/number.util";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    viagem?: string;
    data?: string;
    realizadas?: number;
    prontas?: number;
    pendentes?: number;
  }>;
};

function obterDataAtual(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default async function PageRoot({ searchParams }: Readonly<Props>) {
  const params = await searchParams;

  if (!params.data?.trim()) {
    const queryParams = new URLSearchParams();

    queryParams.set("data", obterDataAtual());

    if (params.viagem) {
      queryParams.set("viagem", params.viagem);
    }

    redirect(`?${queryParams.toString()}`);
  }
  
  const { data, viagem, realizadas, prontas, pendentes } = await searchParams;
  const dataValida =
    /^\d{4}-\d{2}-\d{2}$/.test(data!) &&
    !Number.isNaN(new Date(`${data}T12:00:00-03:00`).getTime());

  if (!dataValida) {
    const queryParams = new URLSearchParams();
    queryParams.set("data", obterDataAtual());

    if (viagem) {
      queryParams.set("viagem", viagem);
    }

    redirect(`?${queryParams.toString()}`);
  }
  return (
    <div className="min-w-screen min-h-screen bg-page-bg flex">
      <main className="flex-1 flex overflow-hidden h-screen">
        <SideBarContent />
        <div className="flex-1 bg-page-bg overflow-hidden flex flex-col relative">
          <AnimatePresence mode="wait">
            {viagem ? (
              <TelaViagem codigoViagem={Number(viagem)} />
            ) : (
              <PainelOperacao
                dataSelecionada={new Date(data)}
                total={
                  requireNumber(realizadas) +
                  requireNumber(prontas) +
                  requireNumber(pendentes)
                }
                realizadas={requireNumber(realizadas)}
                prontas={requireNumber(prontas)}
                pendentes={requireNumber(pendentes)}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
