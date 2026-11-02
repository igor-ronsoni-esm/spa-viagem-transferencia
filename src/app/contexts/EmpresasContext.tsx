import { EmpresaOutput } from "@modules/domain/empresa/schemas/empresa.schema";
import { createContext } from "react";


type EmpresasContextType = {
  empresas: EmpresaOutput[];
  loading: boolean;
  handleBuscarEmpresas: () => void;
};

export const EmpresasContext = createContext<EmpresasContextType>({
  empresas: [],
  loading: false,
  handleBuscarEmpresas: () => {},
});