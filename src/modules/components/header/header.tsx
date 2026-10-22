import { ReactNode } from "react";

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
};

export const HeaderAtom = ({ children, ...rest }: HeaderProps) => {
  return (
    // `shrink-0`: como flex item de uma coluna, o h-12 era só a altura *preferida* —
    // com o conteúdo estourando a altura da tela o header encolhia para 24px na
    // listagem/detalhe e ficava 48px no cadastro, a diferença apontada no review
    // (card 252295, 5ª rodada).
    <div className="flex w-full h-12 shrink-0 px-4 items-center justify-between bg-gray" { ...rest }>
      {children}
    </div>
  );
};
