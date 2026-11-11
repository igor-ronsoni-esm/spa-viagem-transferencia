import { VeiculoOutput } from "@modules/domain/veiculos/schemas/veiculo.schema";
import { createContext } from "react";


type VeiculosContextType = {
  veiculos: VeiculoOutput[];
  loading: boolean;
  handleBuscarVeiculos: () => void;
};

export const VeiculosContext = createContext<VeiculosContextType>({
  veiculos: [],
  loading: false,
  handleBuscarVeiculos: () => {},
});