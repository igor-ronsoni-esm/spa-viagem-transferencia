export type FormAuthsTOON = {
  form: string;
  c: number;
  r: number;
  u: number;
  d: number;
};

export type FormAuth = {
  form: string;
  permissions: PermissionsForm;
};

export type PermissionsForm = {
  create: boolean;
  update: boolean;
  read: boolean;
  delete: boolean;
};

export type Token = {
  sub: string;
  name: string;
  company: number;
  auth: string;
  sector: number;
};

export type JWT = {
  sub: string;
  name: string;
  company: number;
  auth?: string;
  sector: number;
};

export const permissions_initializer: PermissionsForm = {
  create: false,
  update: false,
  read: false,
  delete: false,
};


export const authorizeHomologation = {
  id: 31722,
  name: "Test",
  company: 2,
  sector: 1,
  // GT-4 (Consulta de Linhas, card 252548) e GT-3 (Configuração de Remuneração de Linha, card
  // 252631) — sem eles o bypass de dev loga o usuário sem permissão para as telas novas, e elas
  // ficam bloqueadas mesmo em `npm run dev`. GT-3 com c/r/u para exercitar a escrita.
  auth: String.raw`[4]{form,c,r,u,d}:\n\tGT-1,0,1,0,0\n\tGT-2,1,1,1,0\n\tGT-3,1,1,1,0\n\tGT-4,0,1,0,0\n\t`
};
