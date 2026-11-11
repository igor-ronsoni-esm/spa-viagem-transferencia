"use client";

import { ReactNode, useContext, useEffect, useState } from "react";
import { VeiculosContext } from "./VeiculosContext";
import { fetchSafe } from "@modules/utils/fetches/fetch-safe";
import { VeiculoOutput } from "@modules/domain/veiculos/schemas/veiculo.schema";
import { buscarVeiculos } from "../../server-actions";

type Props = {
  children: ReactNode;
};

export function VeiculosProvider({ children }: Props) {
  const [veiculos, setVeiculos] = useState<VeiculoOutput[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBuscarVeiculos = async () => {
   try {
      setLoading(true);
      const resultado = await fetchSafe<VeiculoOutput[]>(buscarVeiculos)
      setVeiculos(resultado);
    } catch (err) {
      console.error("[BUSCAR_VEICULOS] Erro ao buscar veiculos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleBuscarVeiculos();
  }, []);

  return (
    <VeiculosContext.Provider
      value={{
        veiculos,
        loading,
        handleBuscarVeiculos,
      }}
    >
      {children}
    </VeiculosContext.Provider>
  );
}

export const useVeiculosContext = () => {
  return useContext(VeiculosContext);
}