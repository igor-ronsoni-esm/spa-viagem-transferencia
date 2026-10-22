import { decode } from "@toon-format/toon";
import DeparamTokenUseCase from "../usecases/deparam-token.usecase";
import { PermissoesIlegiveisError } from "../errors/permissoes-ilegiveis.error";
import { FormAuth, FormAuthsTOON } from "@components/auth/esm-auth";

export default class DeparamTokenService implements DeparamTokenUseCase {
  execute(auths?: string): FormAuth[] {
    if (!auths) return [];
    const normalized = auths.replaceAll(/\\n/g, "\n").replaceAll(/\\t/g, "  ");

    // `decode` lança em qualquer conteúdo que não seja TOON válido. Sem este catch a exceção
    // subia crua: no cliente derrubava o efeito do AuthProvider (que então nunca marcava
    // `authenticated`), e o InterceptorFormAuth ficava renderizando `null` para sempre — a
    // tela branca sem mensagem nenhuma reportada no card 252295.
    let decoded: FormAuthsTOON[];
    try {
      decoded = decode(normalized) as FormAuthsTOON[];
    } catch (error) {
      console.error("[DeparamTokenService] claim `auth` do JWT em formato inesperado:", error);
      throw new PermissoesIlegiveisError(error);
    }

    // Um TOON válido mas de outro shape (ex.: um objeto solto no lugar da tabela de
    // formulários) decodifica sem erro e explodiria no `for..of` logo abaixo.
    if (!Array.isArray(decoded)) {
      console.error("[DeparamTokenService] claim `auth` decodificada não é uma lista de formulários");
      throw new PermissoesIlegiveisError();
    }

    const array: FormAuth[] = [];
    for (const item of decoded) {
      array.push({
        form: item.form,
        permissions: {
          create: item.c === 1,
          read: item.r === 1,
          update: item.u === 1,
          delete: item.d === 1,
        },
      });
    }
    return array;
  }
}
