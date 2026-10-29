"use client";

import DadosLacres from "./DadosLacres";
import DadosBasicos from "./DadosBasicos";
import DadosLinhasTransferencia from "./DadosLinhasTransferencia";
import DadosMotoristas from "./DadosMotoristas";
import DadosVeiculos from "./DadosVeiculos";
import DadosTrocasDeMotoristas from "./DadosTrocasDeMotoristas";

export default function AbaDadosGerais() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <DadosBasicos />
      <DadosLinhasTransferencia />     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DadosVeiculos />
        <DadosMotoristas />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DadosTrocasDeMotoristas />
        <DadosLacres />
      </div>
    </div>
  );
}
