import { AnimatePresence } from "motion/react";
import SideBarContent from "./components/side-bar/SideBarContent";
import TelaViagem from "./components/tela-viagem/TelaViagem";
import PainelOperacao from "./components/PainelOperacao";
import { requireNumber } from "../modules/utils/number.util";

type Props = {
  searchParams: Promise<{
    viagem?: string;
    data?: string;
    realizadas?: number,
    prontas?: number,
    pendentes?: number
  }>;
};

export default async function PageRoot({ searchParams }: Readonly<Props>) {
  const { data, viagem, realizadas, prontas, pendentes } = await searchParams;

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
                total={requireNumber(realizadas) + requireNumber(prontas) + requireNumber(pendentes)}
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
