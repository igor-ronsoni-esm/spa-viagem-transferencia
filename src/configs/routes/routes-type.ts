export type FormType = {
  code?: string;
  label: string;
};

export const FormNames = {
  MODELO_FAIXA_LISTAGEM: {
    code: "GT-1",
    label: "Consulta de Modelos de Faixa de Remuneração",
  },
  MODELO_FAIXA_CADASTRO: {
    code: "GT-2",
    label: "Cadastro de Modelo de Faixa de Remuneração",
  },
  // GT-4 é o formulário da Consulta de Linhas, gravado em T_FORMULARIO pelo card 252500
  // (conferido no banco em 2026-09-14: ID='GT-4', FORMULARIO='ConsultaLinhasRemuneracao').
  CONSULTA_LINHAS: {
    code: "GT-4",
    label: "Consulta de Linhas",
  },
  // GT-3 é o formulário da tela de Configuração de Remuneração de Linha (história 245167),
  // gravado pelo card 252621 (conferido no banco em 2026-09-24: ID='GT-3',
  // FORMULARIO='ConfiguracaoRemuneracaoLinha', FRM_CODIGO=1454).
  CONFIGURACAO_REMUNERACAO_LINHA: {
    code: "GT-3",
    label: "Configuração de Remuneração de Linha",
  },
};

export interface MenuSideBar {
  title: string;
  pages: Pages[];
}

export interface Pages {
  name: string;
  description?: string;
  route?: string;
  icon?: React.ReactNode;
  subpages?: Pages[];
  forms?: FormType[];
  enabled?: boolean;
}
