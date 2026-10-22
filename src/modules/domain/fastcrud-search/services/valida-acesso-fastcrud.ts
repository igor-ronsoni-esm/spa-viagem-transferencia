import { FormAuth } from "@components/auth/esm-auth";
import { FormNames } from "@configs/routes/routes-type";
import { CHAVE_FASTCRUD_EMPRESAS_TIPO_FILIAIS } from "@domain/empresa/entities/empresa.entity";

// Chave FastCrud "Tipos de Veículo Ativos", usada por `GradeTiposFaixas.tsx` (Modelos de Faixa,
// GT-2). Duplicada aqui em vez de importada do Client Component — a allowlist é domínio/rota de
// API, não deve puxar UI. Se o literal mudar lá, muda aqui também (sem teste automático cruzando
// os dois hoje).
const CHAVE_FASTCRUD_TIPOS_VEICULO = "8B8285ED-0395-4620-9D2B-F22AC06A2C9E";

// O `api-fc-search` é infraestrutura compartilhada entre telas — cada uma que precisar dele
// entra nesta lista (hoje o cadastro de Modelos de Faixa e a Consulta de Linhas). Acrescentar
// um formulário não afrouxa quem não tem nenhum: cada entrada continua exigindo sua própria
// permissão mínima, e agora só alcança a(s) chave(s) FastCrud que a própria tela usa — antes
// dessa allowlist (achado M3 do review da MR !6), qualquer usuário com acesso ao proxy podia
// mandar `searchKey` de qualquer consulta da empresa, não só a da tela dele.
const FORMULARIOS_COM_ACESSO_FASTCRUD: Array<{
  code?: string;
  temPermissao: (permissoes: FormAuth["permissions"]) => boolean;
  chavesPermitidas: string[];
}> = [
  {
    code: FormNames.MODELO_FAIXA_CADASTRO.code,
    temPermissao: (p) => p.create || p.update,
    chavesPermitidas: [CHAVE_FASTCRUD_TIPOS_VEICULO],
  },
  {
    code: FormNames.CONSULTA_LINHAS.code,
    temPermissao: (p) => p.read,
    chavesPermitidas: [CHAVE_FASTCRUD_EMPRESAS_TIPO_FILIAIS],
  },
];

// GUID (formato aceito pelo api-fc-search real, ex.: "521DA610-5E8D-4A06-A4CF-6AFF67CC3CFF").
// Barra qualquer coisa fora do formato antes de interpolar na URL upstream — o
// `BaseHttpConnector.montarURL` concatena string pura, então um `key` com `../` colapsaria para
// outro endpoint (`new URL(host + "/metadata/chave/" + "../../admin").href` sai como `host/admin`).
const FORMATO_CHAVE_FASTCRUD =
  /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;

export function possuiAcessoFastcrud(auths: FormAuth[]): boolean {
  return FORMULARIOS_COM_ACESSO_FASTCRUD.some(({ code, temPermissao }) =>
    auths.some((item) => item.form === code && temPermissao(item.permissions)),
  );
}

export function chaveFastcrudValida(chave: unknown): chave is string {
  return typeof chave === "string" && FORMATO_CHAVE_FASTCRUD.test(chave);
}

// União das chaves que os formulários do usuário liberam — usada para checar `searchKey`
// (POST /search/filter) e `key` (GET /metadata/chave/{key}) contra o que a tela dele realmente
// precisa, não contra "tem acesso ao proxy" de forma genérica.
export function chavesFastcrudPermitidas(auths: FormAuth[]): string[] {
  const chaves = new Set<string>();
  FORMULARIOS_COM_ACESSO_FASTCRUD.forEach(({ code, temPermissao, chavesPermitidas }) => {
    if (auths.some((item) => item.form === code && temPermissao(item.permissions))) {
      chavesPermitidas.forEach((chave) => chaves.add(chave));
    }
  });
  return [...chaves];
}
