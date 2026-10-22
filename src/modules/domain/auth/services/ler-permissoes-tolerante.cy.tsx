// Teste da peça central da correção do card 252295: ler as permissões do token sem deixar uma
// claim ilegível derrubar o AuthProvider (cliente) ou o SearchData (servidor). Testado com um
// DeparamTokenUseCase fake — não depende de TOON real nem de DeparamTokenService.
import { lerPermissoesTolerante } from "./ler-permissoes-tolerante";
import DeparamTokenUseCase from "../usecases/deparam-token.usecase";
import { FormAuth } from "@components/auth/esm-auth";

const AUTHS_FAKE: FormAuth[] = [
  { form: "GT-1", permissions: { create: false, read: true, update: false, delete: false } },
];

function usecaseQueRetorna(auths: FormAuth[]): DeparamTokenUseCase {
  return { execute: () => auths };
}

function usecaseQueLanca(erro: unknown): DeparamTokenUseCase {
  return {
    execute: () => {
      throw erro;
    },
  };
}

describe("lerPermissoesTolerante", () => {
  it("devolve as permissões do usecase quando a leitura funciona", () => {
    const resultado = lerPermissoesTolerante(usecaseQueRetorna(AUTHS_FAKE), "claim-qualquer");

    expect(resultado).to.deep.equal({ auths: AUTHS_FAKE, erroPermissoes: false });
  });

  it("devolve lista vazia sem erro quando não há claim (undefined)", () => {
    // Não chama o usecase à toa — nem precisa ser capaz de lançar para este caso.
    const usecase = usecaseQueLanca(new Error("não deveria ser chamado"));

    const resultado = lerPermissoesTolerante(usecase, undefined);

    expect(resultado).to.deep.equal({ auths: [], erroPermissoes: false });
  });

  it("absorve a exceção do usecase e sinaliza erroPermissoes, sem propagar", () => {
    const erroOriginal = new Error("claim em formato inesperado");

    // A chamada não deve lançar — é essa a garantia central: nem AuthProvider (cliente) nem
    // SearchData (servidor) podem quebrar por causa de uma claim ilegível (card 252295).
    const resultado = lerPermissoesTolerante(usecaseQueLanca(erroOriginal), "claim-corrompida");

    expect(resultado).to.deep.equal({ auths: [], erroPermissoes: true });
  });

  it("absorve exceções que não são instâncias de Error", () => {
    const resultado = lerPermissoesTolerante(usecaseQueLanca("string crua, não um Error"), "x");

    expect(resultado).to.deep.equal({ auths: [], erroPermissoes: true });
  });
});
