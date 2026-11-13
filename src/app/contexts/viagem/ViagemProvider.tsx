import { ReactNode, useContext } from "react";
import { ViagemContext } from "./ViagemContext";

type Props = {
  children: ReactNode;
};

export function ViagemProvider({ children }: Props) {
  const handleGerarViagem = () => {};
  const handleResetarViagem = () => {};
  const handleCancelarViagem = () => {};
  
  const handleIniciarManualmente = () => {};

  return (
    <ViagemContext.Provider
      value={{
        handleGerarViagem,
        handleResetarViagem,
        handleCancelarViagem,
        handleIniciarManualmente,
      }}
    >
      {children}
    </ViagemContext.Provider>
  );
}

export const useViagemContext = () => {
  return useContext(ViagemContext);
}