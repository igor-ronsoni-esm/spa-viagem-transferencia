// Teste de componente (Cypress) do bloco de mensagem usado em todos os estados sem dados da
// tela. Ele é a peça que garante o pedido do QA no card 252295: quando a consulta falha, a
// tela mostra a estrutura E informa o erro, em vez de ficar em branco.
import { EstadoMensagem } from "./EstadoMensagem";
import { BotaoTentarNovamente } from "./BotaoTentarNovamente";
import { mockRouter } from "@test-mocks/next-navigation";

describe("<EstadoMensagem />", () => {
  it("exibe título e descrição com o data-testid padrão", () => {
    cy.mount(
      <EstadoMensagem titulo="Não foi possível carregar os modelos" descricao="Serviço indisponível." />,
    );

    cy.get('[data-testid="estado-mensagem"]').should("be.visible");
    cy.contains("Não foi possível carregar os modelos").should("be.visible");
    cy.contains("Serviço indisponível.").should("be.visible");
  });

  it("usa o data-testid informado, permitindo distinguir cada estado nos testes", () => {
    cy.mount(<EstadoMensagem testId="erro-consulta" titulo="Falhou" />);

    cy.get('[data-testid="erro-consulta"]').should("exist");
    cy.get('[data-testid="estado-mensagem"]').should("not.exist");
  });

  it("renderiza como erro por padrão", () => {
    cy.mount(<EstadoMensagem titulo="Erro" />);
    // Classes do MUI Alert (Alert.js, useUtilityClasses): cor e variante são classes
    // SEPARADAS (`MuiAlert-colorError` + `MuiAlert-standard`) nesta versão do MUI — não existe
    // uma classe combinada `MuiAlert-standardError` (convenção de versões antigas).
    cy.get(".MuiAlert-colorError").should("exist");
  });

  it("renderiza como aviso quando pedido", () => {
    // Um mount por teste (ver nota equivalente em InterceptorFormAuth.cy.tsx).
    cy.mount(<EstadoMensagem severidade="warning" titulo="Aviso" />);
    cy.get(".MuiAlert-colorWarning").should("exist");
  });

  it("renderiza a ação recebida ao lado da mensagem", () => {
    cy.mount(
      <EstadoMensagem titulo="Falhou" acao={<BotaoTentarNovamente />} />,
    );

    cy.contains("button", "Tentar novamente").should("be.visible");
  });

  it("nunca renderiza vazio: sempre há texto para o usuário", () => {
    // A garantia central do card 252295 — este componente é o piso de todos os caminhos de
    // falha, então ele não pode produzir uma área sem conteúdo nem no uso mais mínimo.
    cy.mount(<EstadoMensagem titulo="Algo deu errado" />);

    // `.should(callback)`, não `.then(callback)`: a forma "function" é reexecutada pelo
    // Cypress até passar ou expirar — um `.then()` roda uma única vez, sem esperar o React
    // terminar de pintar (ver a mesma correção, motivada por uma falha real no pipeline, em
    // InterceptorFormAuth.cy.tsx).
    cy.get('[data-testid="estado-mensagem"]')
      .invoke("text")
      .should((texto) => {
        expect(texto.trim().length, "mensagem sem texto visível").to.be.greaterThan(0);
      });
  });
});

describe("<BotaoTentarNovamente />", () => {
  it("dispara router.refresh() ao clicar", () => {
    cy.stub(mockRouter, "refresh").as("refresh");

    cy.mount(<BotaoTentarNovamente />);
    cy.contains("button", "Tentar novamente").click();

    cy.get("@refresh").should("have.been.called");
  });

  it("aceita um rótulo customizado", () => {
    cy.mount(<BotaoTentarNovamente rotulo="Recarregar" />);

    cy.contains("button", "Recarregar").should("be.visible");
  });
});
