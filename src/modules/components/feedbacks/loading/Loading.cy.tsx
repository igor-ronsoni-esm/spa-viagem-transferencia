// Teste de componente (Cypress) do <Loading />.
//
// Existe por um motivo específico: o gif precisa ser servido a partir de /static, a única
// pasta de assets fora do matcher do middleware de auth (src/proxy.ts). Este componente é
// renderizado na tela de login, ou seja, com o usuário AINDA SEM SESSÃO — de qualquer outro
// caminho o NextAuth responde 307 para /login em vez do arquivo, e o gif não aparece
// (card 252295). O template irmão (spa-integracao-vpo) ainda usa "logo.gif" na raiz, então
// uma sincronização futura com ele reintroduz a regressão em silêncio: este teste é a trava.
import { Loading } from "./Loading";

describe("<Loading />", () => {
  it("aponta o gif para /static, fora do matcher do middleware de auth", () => {
    cy.mount(<Loading description="Autenticando..." />);

    cy.get('img[alt="Logo ESM"]')
      .should("have.attr", "src")
      .and("match", /^\/static\//);
  });

  it("exibe a descrição recebida", () => {
    cy.mount(<Loading description="Autenticando..." />);

    cy.contains("Autenticando...").should("be.visible");
  });
});
