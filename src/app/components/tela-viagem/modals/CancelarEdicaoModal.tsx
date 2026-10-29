"use client";

import { AlertCircle } from "lucide-react";
import { motion } from "motion/react";

type Props = {
  open: boolean;
  codigoViagem: number;
  handleCancelar: () => void;
  handleConfirmar: () => void;
}

export default function CancelarEdicaoModal({ open, codigoViagem, handleCancelar, handleConfirmar }: Readonly<Props>) {
  const viagemNova = codigoViagem === 0 || codigoViagem === undefined || codigoViagem === null;
  if (!open) return null;

  return (
    <motion.div
      key="cancel-confirm-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm z-80 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center gap-4"
      >
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 text-sm">
            {viagemNova
              ? "Deseja realmente cancelar esta nova viagem?"
              : "Deseja realmente descartar as alterações?"}
          </h3>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            {viagemNova
              ? "A nova viagem complementar iniciada será cancelada e removida permanentemente. Esta ação é definitiva."
              : "Todas as alterações feitas nesta sessão de edição serão revertidas para os valores originais."}
          </p>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={handleCancelar}
            className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider cursor-pointer"
          >
            {viagemNova
              ? "Manter Viagem"
              : "Voltar para Edição"}
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider cursor-pointer"
          >
            {viagemNova
              ? "Confirmar Cancelamento"
              : "Confirmar Descarte"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
