import { Alert, AlertTitle, Box } from "@mui/material";

export type EstadoMensagemProps = {
  severidade?: "error" | "warning" | "info";
  titulo: string;
  descricao?: string;
  /** Ação opcional à direita da mensagem (ex.: <BotaoTentarNovamente />). */
  acao?: React.ReactNode;
  testId?: string;
};

/**
 * Bloco padrão para os estados em que a tela não tem dados para mostrar (erro de consulta,
 * falta de permissão, falha ao ler o token).
 *
 * Existe para que NENHUM desses caminhos volte a renderizar uma área de conteúdo vazia: o
 * `data-testid` é o gancho que os testes usam para afirmar que sempre há algo explicando o
 * que aconteceu (card 252295).
 */
export function EstadoMensagem({
  severidade = "error",
  titulo,
  descricao,
  acao,
  testId = "estado-mensagem",
}: Readonly<EstadoMensagemProps>) {
  return (
    <Box className="flex flex-1 items-center justify-center p-6" data-testid={testId}>
      <Alert
        severity={severidade}
        action={acao}
        className="w-full max-w-2xl"
        // `items-center` alinha o ícone/ação com o texto quando a mensagem ocupa uma só linha.
        sx={{ alignItems: "center" }}
      >
        <AlertTitle className="font-semibold">{titulo}</AlertTitle>
        {descricao}
      </Alert>
    </Box>
  );
}
