"use client";

import React from "react";
import { useAuth } from "./hooks";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { FormType } from "@configs/routes/routes-type";
import { EstadoMensagem } from "@components/feedbacks/estado/EstadoMensagem";

export type InterceptorFormAuthProps = {
  children: React.ReactNode;
  forms: FormType[];
  withoutPermissions?: boolean;
};

/**
 * `validando` cobre o intervalo entre montar e o AuthProvider terminar de ler o token;
 * `erro` é quando a claim de permissões não pôde ser interpretada (≠ não ter permissão).
 */
type EstadoAcesso = "validando" | "liberado" | "negado" | "erro";

export const InterceptorFormAuth = ({ forms, children, withoutPermissions }: InterceptorFormAuthProps) => {
  const context = useAuth();
  const router = useRouter();

  // Estado DERIVADO, não guardado: a decisão de acesso é função pura do contexto de auth.
  // Guardá-lo em useState e sincronizar por efeito (como era antes) gera render em cascata
  // e deixa uma janela em que o valor exibido está atrasado em relação ao contexto.
  const estado: EstadoAcesso = React.useMemo(() => {
    // Enquanto o AuthProvider não terminou de ler o token não há o que decidir — decidir
    // aqui daria "negado" para todo mundo no primeiro render.
    if (!context.authenticated) return "validando";
    if (context.erroPermissoes) return "erro";
    if (withoutPermissions) return "negado";
    if (!forms || forms.length === 0) return "liberado";

    const liberado = forms.some((v) => {
      const perms = context.getPermissions(v.code);
      return perms && Object.values(perms).some((valor) => valor === true);
    });
    return liberado ? "liberado" : "negado";
  }, [context, forms, withoutPermissions]);

  React.useEffect(() => {
    if (estado !== "negado") return;

    Swal.fire({
      icon: "error",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCloseButton: false,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Voltar à tela anterior",
      reverseButtons: true,
      title: "Você não tem permissão para acessar essa página",
      text: "Parece que você não tem permissão para esta operação",
      footer: `<div>
              <strong>Formulários</strong></br>
              ${forms.map((v) => `&bull; ${v.label}<br>`).join("")}
            </div>`,
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        router.back();
      }
    });
    // `forms`/`router` ficam fora das deps de propósito: `forms` é um literal recriado a cada
    // render do layout (reabriria o alerta sem parar) e `router` é estável na prática. O
    // alerta deve disparar uma vez por transição para "negado" — é isso que `estado` expressa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  if (estado === "liberado") return <>{children}</>;

  // 🔧 O caso "negado" voltou a ser `return null` no commit 120bc9a ("remoção para
  // apresentação de detalhe sobre permissão de tela"), decisão deliberada de não expor na
  // tela quais formulários são exigidos. O que segura a área de conteúdo em branco hoje é o
  // SweetAlert ser modal: `allowOutsideClick`/`allowEscapeKey` false e sem botão de fechar,
  // com "Voltar à tela anterior" como única saída (`router.back()`).
  //
  // ⚠️ Risco residual conhecido: se não houver histórico de navegação — que é o caso quando a
  // tela é aberta direto pelo TMS via `?jwt=` — o `router.back()` não sai da página e o
  // usuário fica com a área de conteúdo em branco, sem nada explicando o motivo. Era esse o
  // sintoma da 3ª rodada de review do card 252295. Não tratado aqui de propósito: mexer nisso
  // é reabrir a decisão do 120bc9a.
  if (estado === "validando") {
    return (
      <Box className="flex flex-1 items-center justify-center p-6" data-testid="validando-permissoes">
        <CircularProgress aria-label="Validando permissões" />
      </Box>
    );
  }

  if (estado === "erro") {
    return (
      <EstadoMensagem
        testId="erro-permissoes"
        severidade="error"
        titulo="Não foi possível validar suas permissões"
        descricao="As permissões do seu usuário vieram em um formato que o sistema não conseguiu interpretar. Feche a tela e abra novamente pelo TMS; se persistir, acione o suporte."
      />
    );
  }

  return null;
};
