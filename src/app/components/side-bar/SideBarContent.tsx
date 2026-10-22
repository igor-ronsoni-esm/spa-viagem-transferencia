"use client";

import { useEffect, useState } from "react";
import SelecaoData from "./SelecaoData";
import { ViagemOutput } from "@modules/domain/viagem/schemas/resultado-consulta-viagens.schema";
import ListagemViagens from "./ListagemViagens";
import {
  ClipboardCheck,
  Clock,
  Play,
  Plus,
  RefreshCcw,
  Search,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  isViagemFinalizada,
  isViagemIniciada,
  isViagemPendente,
  isViagemPronta,
} from "@/src/modules/lib/validacoes";
import { fetchSafe } from "@/src/modules/utils/fetches/fetch-safe";
import { buscarViagens } from "../../server-actions";
import SideBarSkeleton from "./SideBarSkeleton";
import { useRouter, useSearchParams } from "next/navigation";

enum TabId {
  PENDENTES = "PENDENTES",
  RESOLVIDAS = "RESOLVIDAS",
  INICIADA = "INICIADA",
  FINALIZADA = "FINALIZADA",
}

const tabs = [
  { id: TabId.PENDENTES, label: "Pendentes", icon: Clock },
  { id: TabId.RESOLVIDAS, label: "Resolvidas", icon: ClipboardCheck },
  { id: TabId.INICIADA, label: "Iniciadas", icon: Play },
  {
    id: TabId.FINALIZADA,
    label: "Finalizadas",
    icon: ClipboardCheck,
  },
];

export default function SideBarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [viagens, setViagens] = useState<ViagemOutput[]>([]);
  const [tabSelecionada, setTabSelecionada] = useState<TabId>(TabId.PENDENTES);
  const [pesquisa, setPesquisa] = useState<string>("");

  const viagensFiltradas = viagens.filter((viagem) => {
    if (tabSelecionada === TabId.PENDENTES) return isViagemPendente(viagem.viagem.chaveStatus);
    if (tabSelecionada === TabId.RESOLVIDAS) return isViagemPronta(viagem.viagem.chaveStatus);
    if (tabSelecionada === TabId.INICIADA) return isViagemIniciada(viagem.viagem.chaveStatus);
    if (tabSelecionada === TabId.FINALIZADA) return isViagemFinalizada(viagem.viagem.chaveStatus);
    return true;
  });
  viagensFiltradas.sort(
    (a, b) =>
      new Date(a.viagem.dataSaida).getTime() -
      new Date(b.viagem.dataSaida).getTime(),
  );

  const viagensPesquisadas = viagensFiltradas.filter((item) => {
    const termo = pesquisa.trim().toLowerCase();

    if (!termo) return true;

    const viagem = item;

    return [
      viagem.origem?.sigla,
      viagem.destino?.sigla,
      viagem.linha?.descricao.toString(),
      viagem.viagem.codigo?.toString(),
    ].some((valor) =>
      String(valor ?? "").toLowerCase().includes(termo),
    );
  });

  const fetchViagens = async () => {
    try {
      setLoading(true)
      const resultado = await fetchSafe(buscarViagens);
      setViagens(resultado.viagens)
      handleTotais(resultado.viagens)
    } 
    catch (error) {}
    finally {
      setLoading(false)
    }
  }

  const handleTotais = (resultado: ViagemOutput[]) => {
    const total = resultado.length;
    const realizadas = resultado.filter((v) => isViagemIniciada(v.viagem.chaveStatus) || isViagemFinalizada(v.viagem.chaveStatus)).length;
    const prontas = resultado.filter((v) => isViagemPronta(v.viagem.chaveStatus)).length;
    const pendentes = resultado.filter((v) => isViagemPendente(v.viagem.chaveStatus)).length;

    const queryParams = new URLSearchParams();
    queryParams.set("total", total.toString());
    queryParams.set("realizadas", realizadas.toString());
    queryParams.set("prontas", prontas.toString());
    queryParams.set("pendentes", pendentes.toString());
    router.push(`?${queryParams.toString()}`);
  }

  useEffect(() => {
    fetchViagens()
  }, [])

  return (
    <div className="flex flex-col border-r border-gray-100 bg-white shrink-0 w-80 p-2">
      <div className="border-b border-gray-50 flex flex-col gap-1.5 shrink-0">
        {/* Seletor de Empresa (habilitado quando o usuário pertence a MATRIZ)
        <CompanySelect
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={(comp) => {
            setSelectedCompany(comp);
            setSelectedTrip(null); // Reseta seleção ao alternar de empresa
          }}
          isMatrizUser={isMatrizUser}
        /> */}

        <SelecaoData />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between mt-1">
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary text-white rounded-lg text-[9px] font-black shadow-md shadow-primary/10 hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" /> NOVA VIAGEM
          </button>
          <button
            onClick={fetchViagens}
            className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-primary transition-all cursor-pointer"
          >
            <RefreshCcw className={cn("w-3 h-3", loading && "animate-spin")} />
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-lg px-2.5 pl-7 py-1.5 text-[10px] focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <Search className="w-3 h-3 text-gray-400 absolute left-2 top-2" />
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-gray-50 rounded-lg overflow-x-auto no-scrollbar">
          {tabs.map((f) => (
            <button
              key={f.id}
              onClick={() => setTabSelecionada(f.id)}
              className={cn(
                "flex items-center gap-1 px-2 py-1.5 rounded-md text-[9px] font-black uppercase transition-all whitespace-nowrap cursor-pointer",
                tabSelecionada === f.id
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <SideBarSkeleton />
      ) : (
        <ListagemViagens viagens={viagensPesquisadas} />
      )}
      {!loading && viagensPesquisadas.length <= 0 && (
        <div className="text-center py-10 opacity-40">
          <ClipboardCheck className="w-8 h-8 mx-auto mb-2" />
          <p className="text-[10px] font-bold">Nenhuma viagem</p>
        </div>
      )}
    </div>
  );
}
