import { createContext } from "react";

type ViagemContextType = {
  handleGerarViagem: () => void;
  handleResetarViagem: () => void;
  handleCancelarViagem: () => void;
  handleIniciarManualmente: () => void;
};

export const ViagemContext = createContext<ViagemContextType>({
  handleGerarViagem: () => {},
  handleResetarViagem: () => {},
  handleCancelarViagem: () => {},
  handleIniciarManualmente: () => {},
});