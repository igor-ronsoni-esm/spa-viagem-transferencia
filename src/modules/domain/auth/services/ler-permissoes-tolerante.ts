import { FormAuth } from "@components/auth/esm-auth";
import DeparamTokenUseCase from "../usecases/deparam-token.usecase";

export type PermissoesLidas = {
  auths: FormAuth[];
  erroPermissoes: boolean;
};

const SEM_PERMISSOES: PermissoesLidas = { auths: [], erroPermissoes: false };

/**
 * Lê as permissões da claim `auth` do token via o usecase informado, absorvendo qualquer
 * exceção de decodificação (claim em formato ilegível) em vez de deixá-la subir crua.
 *
 * Consumida tanto pelo cliente (AuthProvider) quanto pelo servidor (SearchData) — os dois
 * tinham cada um seu próprio try/catch quase idêntico para o mesmo problema (card 252295);
 * consolidado aqui numa única peça, testada uma vez só.
 */
export function lerPermissoesTolerante(
  deparamUseCase: DeparamTokenUseCase,
  auth: string | undefined,
): PermissoesLidas {
  if (!auth) return SEM_PERMISSOES;

  try {
    return { auths: deparamUseCase.execute(auth), erroPermissoes: false };
  } catch (error) {
    console.error("[lerPermissoesTolerante] falha ao interpretar as permissões do token:", error);
    return { auths: [], erroPermissoes: true };
  }
}
