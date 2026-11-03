"use client";

import { ReactNode, startTransition, useContext, useEffect, useState } from "react";
import { EmpresaOutput } from "@modules/domain/empresa/schemas/empresa.schema";
import { SelecaoEmpresaContext } from "./SelecaoEmpresaContext";
import { useEmpresasContext } from "@contexts/empresas/EmpresasProvider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  children: ReactNode;
};

const CODIGO_EMPRESA_MATRIZ: number = 2
const CODIGO_EMPRESA_DEFAULT: number = 1

export function SelecaoEmpresaProvider({ children }: Props) {
  const [empresa, setEmpresa] = useState<EmpresaOutput>({} as EmpresaOutput);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { empresas } = useEmpresasContext();

  const handleSelecionarEmpresa = (empresa: EmpresaOutput) => {    
    const params = new URLSearchParams(searchParams.toString());

    params.delete("viagem");
    params.delete("modoEdicao");

    const query = params.toString();

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname);
      setEmpresa(empresa);
    });
  };

  useEffect(() => {
    if (!empresas) return;
    const empresaUsuario = 64; //TODO: substituir pelo código da empresa do usuário logado
    const isUsuarioMatriz = empresaUsuario === CODIGO_EMPRESA_MATRIZ;
    if (isUsuarioMatriz) {
      const empresaPadrao = empresas.find(e => e.codigo === CODIGO_EMPRESA_DEFAULT);
      if (empresaPadrao) setEmpresa(empresaPadrao);
    } 
    else {
      const empresaUsuarioEncontrada = empresas.find(e => e.codigo === empresaUsuario);
      if (empresaUsuarioEncontrada) setEmpresa(empresaUsuarioEncontrada);
    }
  }, [empresas]);

  return (
    <SelecaoEmpresaContext.Provider
      value={{
        empresa,
        handleSelecionarEmpresa: handleSelecionarEmpresa,
      }}
    >
      {children}
    </SelecaoEmpresaContext.Provider>
  );
}

export const useSelecaoEmpresaContext = () => {
  return useContext(SelecaoEmpresaContext);
}