/**
 * A claim `auth` do JWT existe mas não pôde ser interpretada (formato diferente do TOON
 * esperado, conteúdo truncado, etc.).
 *
 * Precisa ser distinguível de "usuário sem permissão": são dois problemas com donos
 * diferentes — um é cadastro de permissão do usuário, o outro é o emissor do token
 * mandando a claim em formato inesperado. Tratar os dois como "sem permissão" manda o
 * suporte investigar o lugar errado.
 */
export class PermissoesIlegiveisError extends Error {
  constructor(cause?: unknown) {
    super("Não foi possível interpretar as permissões do seu usuário.");
    this.name = "PermissoesIlegiveisError";
    this.cause = cause;
    // Sem isto, `instanceof PermissoesIlegiveisError` falha quando o bundle é transpilado
    // para um alvo que não preserva a cadeia de protótipo ao estender um built-in (Error) —
    // é o caso do babel-loader do component testing (cypress/webpack.config.cjs), que não
    // declara `targets` e por isso assume o padrão ES5 do @babel/preset-env.
    Object.setPrototypeOf(this, PermissoesIlegiveisError.prototype);
  }
}
