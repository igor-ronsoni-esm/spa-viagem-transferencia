"use client";

import { Play, Truck, ClipboardCheck, Clock, Search } from "lucide-react";
import { motion } from "motion/react";
import { ViagemOutput } from "@modules/domain/viagem/schemas/resultado-consulta-viagens.schema";
import { TripDetail } from "./DetalhaViagem";

type Props = {
  codigoViagem: number;
};

export default function TelaViagem({ codigoViagem }: Readonly<Props>) {
 
  return (
    <motion.div
      key={codigoViagem}
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="flex-1 flex flex-col h-full"
    >
     <TripDetail  
       trip={null}
       onClose={null}
       onUpdate={null}
       lines={null}
       drivers={null}
       vehicles={null}
       agencies={null}
       selectedCompany={null}
     />
    </motion.div>
  );
}
