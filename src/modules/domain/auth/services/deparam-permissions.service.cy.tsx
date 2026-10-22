// Teste do DeparamTokenService rodando no runner de componentes (é onde o projeto coleta
// coverage para o Sonar). Não monta nada: exercita a função pura de leitura da claim `auth`.
//
// Causa raiz do card 252295: `decode()` do TOON lançava para qualquer conteúdo inesperado e a
// exceção subia crua, derrubando o efeito do AuthProvider — daí a tela em branco.
import DeparamTokenService from "./deparam-permissions.service";
import { PermissoesIlegiveisError } from "../errors/permissoes-ilegiveis.error";

const CLAIM_VALIDA = String.raw`[2]{form,c,r,u,d}:\n\tGT-1,0,1,0,0\n\tGT-2,1,1,1,0\n\t`;

// `.to.throw(PermissoesIlegiveisError)` (a forma "matcher" do chai) não é confiável no bundle
// deste component testing — falha mesmo quando o erro lançado É de fato uma instância da
// classe (confirmado comparando com o try/catch abaixo, que passa). Este helper reproduz o
// padrão explícito, evitando o matcher problemático nos 3 testes que precisam dele.
function esperaLancarPermissoesIlegiveis(fn: () => unknown) {
  try {
    fn();
    expect.fail("deveria ter lançado PermissoesIlegiveisError");
  } catch (error) {
    expect(error).to.be.instanceOf(PermissoesIlegiveisError);
  }
}

describe("DeparamTokenService", () => {
  const service = new DeparamTokenService();

  it("converte a claim TOON em permissões por formulário", () => {
    const auths = service.execute(CLAIM_VALIDA);

    expect(auths).to.have.length(2);
    expect(auths[0]).to.deep.equal({
      form: "GT-1",
      permissions: { create: false, read: true, update: false, delete: false },
    });
    expect(auths[1].permissions).to.deep.equal({
      create: true,
      read: true,
      update: true,
      delete: false,
    });
  });

  it("devolve lista vazia quando a claim não veio no token", () => {
    expect(service.execute(undefined)).to.deep.equal([]);
    expect(service.execute("")).to.deep.equal([]);
  });

  it("lança PermissoesIlegiveisError quando a claim não é TOON", () => {
    // Antes esta exceção era o SyntaxError cru do decode, sem tipo próprio, e ninguém a tratava.
    esperaLancarPermissoesIlegiveis(() =>
      service.execute(JSON.stringify([{ form: "GT-1", c: 1, r: 1, u: 1, d: 1 }])),
    );
  });

  it("lança PermissoesIlegiveisError quando a claim vem truncada", () => {
    esperaLancarPermissoesIlegiveis(() => service.execute(String.raw`[3]{form,c,r,u,d}:\n\tGT-1,1,1`));
  });

  it("lança PermissoesIlegiveisError quando o TOON é válido mas não é uma lista", () => {
    // Decodifica sem erro e explodiria adiante no for..of com "is not iterable".
    esperaLancarPermissoesIlegiveis(() => service.execute("form: GT-1"));
  });

  it("expõe uma mensagem em PT-BR adequada para exibir ao usuário", () => {
    try {
      service.execute("{{{ não é toon");
      throw new Error("deveria ter lançado");
    } catch (error) {
      expect(error).to.be.instanceOf(PermissoesIlegiveisError);
      expect((error as Error).message).to.contain("permissões");
    }
  });
});
