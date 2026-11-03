import { ABAS_TELA_VIAGEM_ENUM } from "@constants/enum";
import { createContext, Dispatch, SetStateAction } from "react";

type FormularioContextType = {
  modoEdicao: boolean;
  loading: boolean;
  tabSelecionada: ABAS_TELA_VIAGEM_ENUM;
  setTabSelecionada: Dispatch<SetStateAction<ABAS_TELA_VIAGEM_ENUM>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  handleEditarViagem: () => void,
  handleSalvarEdicao: () => void,
  handleCancelarEdicao: () => void,

};

export const FormularioContext = createContext<FormularioContextType>({
  modoEdicao: false,
  loading: false,
  tabSelecionada: ABAS_TELA_VIAGEM_ENUM.DADOS_GERAIS,
  setTabSelecionada: () => {},
  setLoading: () => {},
  handleEditarViagem: () => {},
  handleSalvarEdicao: () => {},
  handleCancelarEdicao: () => {},
});