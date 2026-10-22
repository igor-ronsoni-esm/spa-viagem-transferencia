"use client";

import { Play, Truck, ClipboardCheck, Clock, Search } from "lucide-react";
import { motion } from "motion/react";

type Props = {
  dataSelecionada: Date;
  total: number,
  realizadas: number,
  prontas: number,
  pendentes: number
};

export default function PainelOperacao({ dataSelecionada, total, realizadas, prontas, pendentes }: Readonly<Props>) {
  const stats = {
    total,
    realizadas,
    prontas,
    pendentes,
  };
  
  return (
    <motion.div
      key="dashboard-summary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12"
    >
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Painel de Operação
          </h2>
          {dataSelecionada && (
            <p className="text-gray-500 font-medium tracking-wide">
              Resumo da escala para{" "}
              {new Date(
                dataSelecionada.toISOString().split("T")[0] + "T00:00:00",
              ).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
            <div className="p-2 bg-gray-50 w-fit rounded-lg group-hover:bg-primary/5 transition-colors">
              <Truck className="w-5 h-5 text-gray-600 group-hover:text-primary" />
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Total Geral
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
            <div className="p-2 bg-orange-50 w-fit rounded-lg group-hover:bg-orange-100 transition-colors">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none">
                Pendentes
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">
                {stats.pendentes}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
            <div className="p-2 bg-purple-50 w-fit rounded-lg group-hover:bg-purple-100 transition-colors">
              <ClipboardCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest leading-none">
                Prontas
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">
                {stats.prontas}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
            <div className="p-2 bg-blue-50 w-fit rounded-lg group-hover:bg-blue-100 transition-colors">
              <Play className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">
                Realizadas
              </p>
              <p className="text-3xl font-black text-gray-900 mt-1">
                {stats.realizadas}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-3xl p-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-gray-200/50 border border-gray-50 mb-4 transform -rotate-6">
            <Search className="w-8 h-8 text-gray-200" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-gray-900">
              Aguardando Seleção
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Selecione uma viagem na lista à esquerda para gerenciar
              documentos, motoristas e veículos.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
