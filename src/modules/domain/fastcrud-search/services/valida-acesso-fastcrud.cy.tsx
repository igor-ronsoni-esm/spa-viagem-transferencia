// A rota `/api/fastcrud/search/filter` (card 252295) exigia só GT-2 (create/update). Ao criar
// a Consulta de Linhas (card 252548), quem só tem GT-4 (read) levaria 403 nessa mesma rota — a
// função pura abaixo é o que resolve isso, e este teste garante que nenhum dos dois formulários
// regrediu ao ganhar o outro.
import {
  chaveFastcrudValida,
  chavesFastcrudPermitidas,
  possuiAcessoFastcrud,
} from "./valida-acesso-fastcrud";
import { CHAVE_FASTCRUD_EMPRESAS_TIPO_FILIAIS } from "@domain/empresa/entities/empresa.entity";
import { FormAuth, permissions_initializer } from "@components/auth/esm-auth";

const CHAVE_FASTCRUD_TIPOS_VEICULO = "8B8285ED-0395-4620-9D2B-F22AC06A2C9E";

function formAuth(form: string, permissoes: Partial<FormAuth["permissions"]>): FormAuth {
  return { form, permissions: { ...permissions_initializer, ...permissoes } };
}

describe("possuiAcessoFastcrud", () => {
  it("libera quem tem GT-2 (Modelos de Faixa) com create", () => {
    expect(possuiAcessoFastcrud([formAuth("GT-2", { create: true })])).to.equal(true);
  });

  it("libera quem tem GT-2 com update, mesmo sem create", () => {
    expect(possuiAcessoFastcrud([formAuth("GT-2", { update: true })])).to.equal(true);
  });

  it("não libera GT-2 só com read (a rota exige escrita para esse formulário)", () => {
    expect(possuiAcessoFastcrud([formAuth("GT-2", { read: true })])).to.equal(false);
  });

  it("libera quem tem GT-4 (Consulta de Linhas) com read", () => {
    expect(possuiAcessoFastcrud([formAuth("GT-4", { read: true })])).to.equal(true);
  });

  it("não libera GT-4 só com create (a rota exige leitura para esse formulário)", () => {
    expect(possuiAcessoFastcrud([formAuth("GT-4", { create: true })])).to.equal(false);
  });

  it("não libera quem não tem nenhum dos dois formulários", () => {
    expect(possuiAcessoFastcrud([formAuth("GT-1", { read: true })])).to.equal(false);
  });

  it("não libera lista de permissões vazia", () => {
    expect(possuiAcessoFastcrud([])).to.equal(false);
  });

  it("libera quando o usuário tem os dois formulários", () => {
    expect(
      possuiAcessoFastcrud([
        formAuth("GT-2", { create: true }),
        formAuth("GT-4", { read: true }),
      ]),
    ).to.equal(true);
  });
});

// M3 do review da MR !6: antes desta allowlist, `possuiAcessoFastcrud` liberava o proxy inteiro
// para qualquer `searchKey`/`key` — quem tinha GT-4 podia consultar a chave de Tipos de Veículo
// (GT-2) e vice-versa, mesmo sem nenhuma tela que precisasse disso.
describe("chavesFastcrudPermitidas", () => {
  it("devolve só a chave de Tipos de Veículo para quem tem GT-2", () => {
    expect(chavesFastcrudPermitidas([formAuth("GT-2", { create: true })])).to.deep.equal([
      CHAVE_FASTCRUD_TIPOS_VEICULO,
    ]);
  });

  it("devolve só a chave de Empresas Tipo Filiais para quem tem GT-4", () => {
    expect(chavesFastcrudPermitidas([formAuth("GT-4", { read: true })])).to.deep.equal([
      CHAVE_FASTCRUD_EMPRESAS_TIPO_FILIAIS,
    ]);
  });

  it("une as duas chaves quando o usuário tem os dois formulários", () => {
    const chaves = chavesFastcrudPermitidas([
      formAuth("GT-2", { create: true }),
      formAuth("GT-4", { read: true }),
    ]);
    expect(chaves).to.have.members([CHAVE_FASTCRUD_TIPOS_VEICULO, CHAVE_FASTCRUD_EMPRESAS_TIPO_FILIAIS]);
  });

  it("não devolve nenhuma chave para quem não tem os formulários (ou tem sem a permissão certa)", () => {
    expect(chavesFastcrudPermitidas([formAuth("GT-2", { read: true })])).to.deep.equal([]);
    expect(chavesFastcrudPermitidas([])).to.deep.equal([]);
  });
});

describe("chaveFastcrudValida", () => {
  it("aceita um GUID no formato do api-fc-search", () => {
    expect(chaveFastcrudValida(CHAVE_FASTCRUD_EMPRESAS_TIPO_FILIAIS)).to.equal(true);
  });

  it("rejeita valor que não é GUID, incluindo tentativa de path traversal", () => {
    expect(chaveFastcrudValida("../../admin")).to.equal(false);
    expect(chaveFastcrudValida("abc")).to.equal(false);
    expect(chaveFastcrudValida("")).to.equal(false);
  });

  it("rejeita valor que não é string", () => {
    expect(chaveFastcrudValida(undefined)).to.equal(false);
    expect(chaveFastcrudValida(null)).to.equal(false);
    expect(chaveFastcrudValida(123)).to.equal(false);
  });
});
