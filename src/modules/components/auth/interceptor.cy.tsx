// Teste de componente (Cypress) do InterceptorFormAuth.
//
// Regressão do card 252295: o componente devolvia `null` em TODOS os caminhos que não fossem
// "liberado" — validando, sem permissão e falha ao ler o token davam exatamente a mesma coisa
// na tela (nada). Cada `it` abaixo trava um desses caminhos em algo visível.
import Swal from "sweetalert2";
import { InterceptorFormAuth } from "./interceptor";
import { FormNames } from "@configs/routes/routes-type";

const FORMS = [FormNames.MODELO_FAIXA_LISTAGEM];
const CONTEUDO = <p data-testid="conteudo-protegido">conteúdo da tela</p>;

describe("<InterceptorFormAuth />", () => {
  beforeEach(() => {
    // O SweetAlert é modal e bloqueia o restante do teste — aqui só interessa se ele foi
    // chamado, não a animação dele. `.as()` precisa vir logo após `cy.stub()`: uma vez que
    // `.resolves()` (SinonStub) roda antes, o tipo perde o Cypress.Agent que carrega `.as`.
    const stubSwal = cy.stub(Swal, "fire").as("swal");
    stubSwal.resolves({ isDismissed: false });
  });

  it("libera o conteúdo quando o usuário tem permissão no formulário", () => {
    cy.mount(<InterceptorFormAuth forms={FORMS}>{CONTEUDO}</InterceptorFormAuth>, {
      permissions: { read: true },
    });

    cy.get('[data-testid="conteudo-protegido"]').should("be.visible");
    cy.get("@swal").should("not.have.been.called");
  });

  it("libera o conteúdo quando nenhum formulário é exigido", () => {
    cy.mount(<InterceptorFormAuth forms={[]}>{CONTEUDO}</InterceptorFormAuth>);

    cy.get('[data-testid="conteudo-protegido"]').should("be.visible");
  });

  it("mostra estado de carregamento — não uma tela vazia — enquanto valida", () => {
    cy.mount(<InterceptorFormAuth forms={FORMS}>{CONTEUDO}</InterceptorFormAuth>, {
      authenticated: false,
      permissions: { read: true },
    });

    cy.get('[data-testid="validando-permissoes"]').should("be.visible");
    cy.get('[data-testid="conteudo-protegido"]').should("not.exist");
  });

  it("dispara o alerta e não renderiza o conteúdo quando falta permissão", () => {
    // O nome antigo ("mostra o bloqueio na tela, além do alerta") descrevia um bloco
    // renderizado na própria tela que foi removido de propósito no commit 120bc9a — as
    // asserções correspondentes já tinham saído, só o nome ficou para trás.
    cy.mount(<InterceptorFormAuth forms={FORMS}>{CONTEUDO}</InterceptorFormAuth>);

    cy.get("@swal").should("have.been.called");
    cy.get('[data-testid="conteudo-protegido"]').should("not.exist");
  });

  it("diferencia claim ilegível de falta de permissão", () => {
    // São problemas de donos diferentes: um é cadastro de permissão, o outro é o emissor do
    // token mandando a claim em formato inesperado.
    cy.mount(<InterceptorFormAuth forms={FORMS}>{CONTEUDO}</InterceptorFormAuth>, {
      erroPermissoes: true,
      permissions: { read: true },
    });

    cy.get('[data-testid="erro-permissoes"]').should("be.visible");
    cy.contains("Não foi possível validar suas permissões").should("be.visible");
    cy.get('[data-testid="sem-permissao"]').should("not.exist");
    // Claim ilegível não é negativa de permissão: não faz sentido acusar o usuário disso.
    cy.get("@swal").should("not.have.been.called");
  });

  // Guarda-chuva da regressão: se um caminho futuro voltar a devolver `null`, um destes cai.
  // Um `it()` por estado, gerado aqui fora de qualquer teste. O estado "negado" ficou de fora
  // de propósito: desde 120bc9a ele devolve `null` por decisão, e quem segura a tela em
  // branco é o SweetAlert modal (ver comentário no interceptor.tsx).
  const ESTADOS: { nome: string; opcoes: Parameters<typeof cy.mount>[1] }[] = [
    { nome: "validando", opcoes: { authenticated: false } },
    { nome: "erro", opcoes: { erroPermissoes: true } },
    { nome: "liberado", opcoes: { permissions: { read: true } } },
  ];

  ESTADOS.forEach(({ nome, opcoes }) => {
    it(`não renderiza uma área vazia no estado "${nome}"`, () => {
      cy.mount(<InterceptorFormAuth forms={FORMS}>{CONTEUDO}</InterceptorFormAuth>, opcoes);
      // `.should(callback)` (não `.then(callback)`): a forma "function" do `.should()` é
      // reexecutada pelo Cypress (junto com o `cy.get` anterior) até passar ou expirar o
      // timeout. Um `.then()` roda uma única vez, sem esperar o React terminar de pintar —
      // foi exatamente isso que fez esta asserção falhar direto no pipeline (CI mais lento
      // que o ambiente local), inclusive no estado "liberado", que outro teste acima já prova
      // que renderiza conteúdo.
      cy.get("[data-cy-root]")
        .invoke("html")
        .should((html) => {
          expect(html.trim().length, `estado "${nome}" renderizou vazio`).to.be.greaterThan(0);
        });
    });
  });
});
