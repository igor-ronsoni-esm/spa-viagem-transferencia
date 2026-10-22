"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

export type BotaoTentarNovamenteProps = {
  rotulo?: string;
};

/**
 * Refaz a consulta do Server Component que renderizou a mensagem de erro.
 *
 * `router.refresh()` (e não `location.reload()`): re-executa só a árvore do servidor,
 * preservando os filtros já digitados e o estado do restante da SPA.
 */
export function BotaoTentarNovamente({ rotulo = "Tentar novamente" }: Readonly<BotaoTentarNovamenteProps>) {
  const router = useRouter();
  const [recarregando, iniciarRecarga] = React.useTransition();

  return (
    <Button
      size="small"
      color="inherit"
      variant="outlined"
      startIcon={<RefreshIcon />}
      loading={recarregando}
      onClick={() => iniciarRecarga(() => router.refresh())}
    >
      {rotulo}
    </Button>
  );
}
