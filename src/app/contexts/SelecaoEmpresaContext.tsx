import { EmpresaOutput } from "@modules/domain/empresa/schemas/empresa.schema";
import { createContext } from "react";


type SelecaoEmpresaContextType = {
  empresa: EmpresaOutput;
  handleSelecionarEmpresa: (empresa: EmpresaOutput) => void;
};

export const SelecaoEmpresaContext = createContext<SelecaoEmpresaContextType>({
  empresa: {} as EmpresaOutput,
  handleSelecionarEmpresa: (empresa: EmpresaOutput) => {},
});