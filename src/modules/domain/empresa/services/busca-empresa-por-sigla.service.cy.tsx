// Teste de componente (Cypress) do BuscaEmpresaPorSiglaService. `fetch` é stubado diretamente
// (mesmo padrão de busca-modelos-faixa.service.cy.tsx) — aqui o destino é a rota local
// `/api/fastcrud/search/filter`, não um host externo, então não há EnvConfiguration a stubar.
import BuscaEmpresaPorSiglaService from "./busca-empresa-por-sigla.service";

function stubFetch(resposta: Partial<Response> & { json?: () => Promise<unknown> }) {
  return cy.stub(window, "fetch").resolves({
    ok: true,
    status: 200,
    text: () => Promise.resolve(""),
    ...resposta,
  } as Response);
}

describe("BuscaEmpresaPorSiglaService", () => {
  let service: BuscaEmpresaPorSiglaService;

  beforeEach(() => {
    service = new BuscaEmpresaPorSiglaService();
  });

  it("devolve a empresa quando a sigla existe", () => {
    stubFetch({
      json: () =>
        Promise.resolve({ data: [{ EMP_FANTASIA: "SAO LEOPOLDO", EMP_CODAG: "AT", CLD_CODIGO: 7 }] }),
    });

    cy.wrap(service.execute("AT")).should("deep.equal", {
      cldCodigo: 7,
      sigla: "AT",
      nome: "SAO LEOPOLDO",
    });
  });

  it("devolve null quando a sigla não existe (data: [] é HTTP 200, não erro)", () => {
    stubFetch({ json: () => Promise.resolve({ data: [] }) });

    cy.wrap(service.execute("ZZZ")).should("equal", null);
  });

  it("envia field/operation/value corretos para o filtro por EMP_CODAG", () => {
    const fetchStub = stubFetch({ json: () => Promise.resolve({ data: [] }) });

    cy.wrap(service.execute("AT")).then(() => {
      const corpoEnviado = JSON.parse(fetchStub.getCall(0).args[1].body as string);
      expect(corpoEnviado.filters).to.deep.equal([
        { field: "EMP_CODAG", operation: "=", value: "AT" },
      ]);
    });
  });

  it("rejeita com mensagem amigável quando a rota local responde 403 (sem permissão)", () => {
    stubFetch({ ok: false, status: 403, text: () => Promise.resolve('{"message":"..."}') });

    cy.wrap(
      service.execute("AT").catch((error: Error) => error.message),
    ).should("equal", "Não foi possível validar a unidade informada.");
  });

  it("rejeita com mensagem amigável quando o fetch falha por rede", () => {
    cy.stub(window, "fetch").rejects(new TypeError("Failed to fetch"));

    cy.wrap(
      service.execute("AT").catch((error: Error) => error.message),
    ).should("equal", "Não foi possível conectar ao serviço de consulta de empresas.");
  });

  it("rejeita sem vazar o texto técnico quando o erro não é reconhecido", () => {
    // A mensagem vai direto para o Swal.fire de validarSigla — texto do runtime não pode chegar lá.
    stubFetch({
      json: () => Promise.reject(new TypeError("Body is unusable: http://10.0.0.5:8080/interno")),
    });

    cy.wrap(
      service.execute("AT").catch((error: Error) => error.message),
    ).should("equal", "Erro inesperado ao validar a unidade informada.");
  });

  it("devolve null quando o registro não bate com o schema (proteção contra outra chave FastCrud)", () => {
    stubFetch({ json: () => Promise.resolve({ data: [{ SIGLA: "AT", FANTASIA: "outra chave" }] }) });

    cy.wrap(service.execute("AT")).should("equal", null);
  });
});
