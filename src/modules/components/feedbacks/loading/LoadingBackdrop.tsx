"use client";

import { Loading } from "./Loading";
import { motion } from "motion/react";

type Props = {
  open: boolean;
  description?: string;
  progress?: boolean;
  value?: number;
};

export const LoadingBackdrop = ({
  open,
  description = "Aguarde...",
  progress,
  value,
}: Readonly<Props>) => {
  if (!open) return null;
  
  return (
    <motion.div
      key="loading-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm z-80 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-10 text-center gap-4"
      >
         <Loading
          description={description}
          progress={progress}
          value={value}
        />
      </motion.div>
    </motion.div>
  );
};
