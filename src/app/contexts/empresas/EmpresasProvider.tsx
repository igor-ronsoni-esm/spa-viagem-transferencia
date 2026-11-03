"use client";

import { ReactNode, useContext, useEffect, useState } from "react";
import { EmpresasContext } from "./EmpresasContext";
import { EmpresaOutput } from "@modules/domain/empresa/schemas/empresa.schema";
import { fetchSafe } from "@modules/utils/fetches/fetch-safe";
import { buscarEmpresas } from "../../server-actions";

type Props = {
  children: ReactNode;
};

export function EmpresasProvider({ children }: Props) {
  const [empresas, setEmpresas] = useState<EmpresaOutput[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBuscarEmpresas = async () => {
   try {
      setLoading(true);
      const resultado = await fetchSafe<EmpresaOutput[]>(buscarEmpresas)
      setEmpresas(resultado);
    } catch (err) {
      console.error("[BUSCAR_EMPRESAS] Erro ao buscar empresas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleBuscarEmpresas();
  }, []);

  return (
    <EmpresasContext.Provider
      value={{
        empresas,
        loading,
        handleBuscarEmpresas,
      }}
    >
      {children}
    </EmpresasContext.Provider>
  );
}

export const useEmpresasContext = () => {
  return useContext(EmpresasContext);
}