import { ABAS_TELA_VIAGEM_ENUM } from "@/src/app/constants";
import { ViagemOutput } from "@/src/modules/domain/viagem/schemas/viagem.schema";
import { createContext, Dispatch, SetStateAction } from "react";


type ViagemContextType = {
  modoEdicao: boolean;
  loading: boolean;
  tabSelecionada: ABAS_TELA_VIAGEM_ENUM;
  setTabSelecionada: Dispatch<SetStateAction<ABAS_TELA_VIAGEM_ENUM>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  handleEditarViagem: () => void;
  handleGerarViagem: () => void;
  handleResetarViagem: () => void;
  handleCancelarViagem: () => void;
  handleSalvarEdicao: () => void;
  handleCancelarEdicao: () => void;
  handleIniciarManualmente: () => void;
};

export const ViagemContext = createContext<ViagemContextType>({
  modoEdicao: false,
  loading: false,
  tabSelecionada: ABAS_TELA_VIAGEM_ENUM.DADOS_GERAIS,
  setTabSelecionada: () => {},
  setLoading: () => {},
  handleEditarViagem: () => {},
  handleGerarViagem: () => {},
  handleResetarViagem: () => {},
  handleCancelarViagem: () => {},
  handleSalvarEdicao: () => {},
  handleCancelarEdicao: () => {},
  handleIniciarManualmente: () => {},
});