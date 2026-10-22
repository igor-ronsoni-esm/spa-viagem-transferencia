import { RequestQuote } from "@mui/icons-material";
import RouteIcon from "@mui/icons-material/Route";
import { MenuSideBar } from "./routes-type";

// Estrutura plana (item de página com `icon` + `route` próprios), não pasta + subpágina.
//
// Com o menu recolhido, `Item.tsx` trata item com `subpages` e sem `route` como pasta:
// o clique só expande (`setOpenSubOptions` + `setExpandedMenu(true)`, sem `router.push`).
// Somado a isso, `Item.tsx` não repassa `iconAvailable` ao renderizar as subpáginas, então
// subpágina nenhuma exibe ícone. O efeito combinado é que a tela deixa de ter um ícone que
// a abra com o menu recolhido — exatamente o apontamento da 1ª rodada de review do card
// 252295 ("deve ser criado um ícone no side bar para abertura desta tela"), que foi
// perdido quando o item virou a pasta "Terceiros" no merge da feature-252296 (commit
// 67f21f4). Coberto por `Item.cy.tsx` e por `e2e/home/home.spec.ts`.
//
// A 2ª tela chegou (GT2, card 252548) — mas continua **plana**, não em pasta: cada entrada
// deste array já recebe `iconAvailable={true}` diretamente de `MenuOptions.tsx`, sem passar
// pelo caminho de `subpages` do `Item.tsx` onde o bug acima vive. Virar pasta com subpágina
// só valeria a pena junto do fix em `Item.tsx` — sem necessidade aqui, não vale o risco.
export const menu: MenuSideBar[] = [
  {
    title: "Gestão de Terceiros",
    pages: [
      {
        name: "Modelos de Faixa de Remuneração",
        description:
          "Consulta e cadastro de modelos de faixa de valores de remuneração",
        route: "/modelos-faixa-remuneracao",
        icon: <RequestQuote />,
        enabled: true,
      },
      {
        name: "Consulta de Linhas",
        description:
          "Consulta de linhas válidas da operação, com indicadores de Proprietário e Remuneração Padrão",
        route: "/gestao-terceiros/linhas",
        icon: <RouteIcon />,
        enabled: true,
      },
    ],
  },
];
