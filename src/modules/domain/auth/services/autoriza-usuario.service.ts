import { auth } from "@configs/auth/auth";
import { container } from "@domain/DI";
import DeparamTokenUseCase from "@domain/auth/usecases/deparam-token.usecase";
import { PermissionsForm } from "@components/auth/esm-auth";

export async function autorizarUsuario(
  formCode: string,
  temPermissao: (permissions: PermissionsForm) => boolean,
  mensagemSemPermissao: string,
): Promise<{ id: number }> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Não autenticado.");
  }

  const deparamUseCase: DeparamTokenUseCase = container.get(
    "DeparamTokenUseCase",
  );
  const auths = deparamUseCase.execute(session.user.auth as string | undefined);
  const autorizado = auths.some(
    (item) => item.form === formCode && temPermissao(item.permissions),
  );

  if (!autorizado) {
    throw new Error(mensagemSemPermissao);
  }

  return { id: session.user.id };
}
