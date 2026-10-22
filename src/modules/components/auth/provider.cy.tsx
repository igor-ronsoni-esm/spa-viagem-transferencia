// Teste de componente (Cypress) do AuthProvider.
//
// Até este arquivo, AuthProvider nunca era montado de verdade em nenhum teste: o `cy.mount`
// custom command (cypress/support/commands.tsx) contorna o provider inteiro, injetando o
// AuthContext manualmente para os demais specs. Aqui ele roda de fato, com next-auth/react
// mockado (cypress/mocks/next-auth-react.tsx) — é a peça central da correção do card 252295
// (deriva erroPermissoes a partir do token em vez de travar `authenticated` numa exceção).
import { AuthProvider } from "./provider";
import { useAuth } from "./hooks";
import { __setSession } from "@test-mocks/next-auth-react";
import type { Session } from "next-auth";

const CLAIM_VALIDA = String.raw`[1]{form,c,r,u,d}:\n\tGT-1,1,1,1,1\n\t`;
const CLAIM_ILEGIVEL = "isto não é TOON válido {{{";

function sessaoCom(auth: string): Session {
  return {
    user: { id: 1, name: "Usuário de teste", company: 2, sector: 1, auth },
  } as unknown as Session;
}

function Consumidor() {
  const { authenticated, erroPermissoes, auths, getPermissions } = useAuth();
  return (
    <div data-testid="consumidor">
      <span data-testid="authenticated">{String(authenticated)}</span>
      <span data-testid="erro-permissoes">{String(erroPermissoes)}</span>
      <span data-testid="qtd-auths">{auths.length}</span>
      <span data-testid="permissao-leitura-gt1">{String(getPermissions("GT-1").read)}</span>
    </div>
  );
}

describe("<AuthProvider />", () => {
  it("mostra estado de carregamento — não uma tela vazia — enquanto a sessão não resolve", () => {
    __setSession(null, "loading");

    cy.mount(
      <AuthProvider>
        <Consumidor />
      </AuthProvider>,
    );

    cy.get('[data-testid="carregando-sessao"]').should("be.visible");
    cy.get('[data-testid="consumidor"]').should("not.exist");
  });

  it("expõe as permissões decodificadas quando autenticado com uma claim válida", () => {
    __setSession(sessaoCom(CLAIM_VALIDA), "authenticated");

    cy.mount(
      <AuthProvider>
        <Consumidor />
      </AuthProvider>,
    );

    cy.get('[data-testid="authenticated"]').should("have.text", "true");
    cy.get('[data-testid="erro-permissoes"]').should("have.text", "false");
    cy.get('[data-testid="permissao-leitura-gt1"]').should("have.text", "true");
  });

  it("marca erroPermissoes quando a claim é ilegível, sem impedir o resto da árvore de montar", () => {
    // A garantia central: a claim ilegível não pode travar `authenticated` (era isso que
    // deixava o InterceptorFormAuth preso em `null` para sempre — a tela branca do card).
    __setSession(sessaoCom(CLAIM_ILEGIVEL), "authenticated");

    cy.mount(
      <AuthProvider>
        <Consumidor />
      </AuthProvider>,
    );

    cy.get('[data-testid="authenticated"]').should("have.text", "true");
    cy.get('[data-testid="erro-permissoes"]').should("have.text", "true");
    cy.get('[data-testid="qtd-auths"]').should("have.text", "0");
  });

  it("não sinaliza erro quando simplesmente não há claim `auth` no token", () => {
    __setSession(sessaoCom(""), "authenticated");

    cy.mount(
      <AuthProvider>
        <Consumidor />
      </AuthProvider>,
    );

    cy.get('[data-testid="erro-permissoes"]').should("have.text", "false");
    cy.get('[data-testid="qtd-auths"]').should("have.text", "0");
  });
});
