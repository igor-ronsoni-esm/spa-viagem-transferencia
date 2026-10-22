"use client"

import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { Box, CircularProgress } from "@mui/material";
import { FormAuth, permissions_initializer } from "./esm-auth";
import { container } from "@domain/DI";
import { AuthContext } from "./context";
import DeparamTokenUseCase from "@domain/auth/usecases/deparam-token.usecase";
import { lerPermissoesTolerante, PermissoesLidas } from "@domain/auth/services/ler-permissoes-tolerante";

type AuthProviderProps = {
  children: React.ReactNode
}

const SEM_PERMISSOES: PermissoesLidas = { auths: [], erroPermissoes: false };

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: session, status } = useSession();
  const [override, setOverride] = React.useState<FormAuth[] | null>(null);

  // Derivado do token, não sincronizado por efeito: ler a claim é uma transformação pura e
  // síncrona. Fazendo por useEffect+setState havia um render intermediário sem permissões, e
  // qualquer exceção no meio do efeito abortava o `setAuthenticated(true)` — era esse o
  // caminho que deixava a tela em branco para sempre (card 252295).
  const { auths: authsDoToken, erroPermissoes } = useMemo<PermissoesLidas>(() => {
    if (status !== "authenticated") return SEM_PERMISSOES;
    const usecase: DeparamTokenUseCase = container.get("DeparamTokenUseCase");
    return lerPermissoesTolerante(usecase, session?.user?.auth as string | undefined);
  }, [session, status]);

  const auths = override ?? authsDoToken;

  const user: User | null = useMemo(
    () => (status === "authenticated" && session?.user ? { ...session.user, auth: [] } : null),
    [session, status],
  );

  const value = useMemo(() => {
    const getPermissions = (form?: string) => {
      if (!form) return permissions_initializer;
      const permissions = auths.findLast((auth) => auth.form === form);

      if (!permissions) return permissions_initializer
      return permissions.permissions
    };

    return {
      // Quando o provider renderiza, a leitura do token já aconteceu (é síncrona) — não há
      // mais um estado intermediário "autenticado mas sem permissões carregadas".
      authenticated: true,
      erroPermissoes,
      user,
      auths,
      autenticate: setOverride,
      getPermissions,
    };
  }, [auths, erroPermissoes, user]);

  // Sem sessão resolvida ainda: mostra que está carregando em vez de devolver `null`, que
  // apagaria a área inteira (SideBar inclusive) sem explicar nada ao usuário.
  if (status !== "authenticated") {
    return (
      <Box className="flex flex-1 items-center justify-center" data-testid="carregando-sessao">
        <CircularProgress aria-label="Carregando sessão" />
      </Box>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
