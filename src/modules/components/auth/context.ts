import { createContext } from "react";
import { User } from "next-auth";
import { FormAuth, PermissionsForm } from "./esm-auth";

export interface AuthContextProps {
  auths: FormAuth[];
  user: User | null;
  authenticated: boolean;
  /**
   * A sessão existe, mas a claim `auth` do token não pôde ser interpretada — as permissões
   * são desconhecidas, e não "vazias". Quem consome precisa diferenciar os dois casos para
   * não acusar falta de permissão quando o problema é o formato do token.
   */
  erroPermissoes: boolean;
  autenticate: (data: FormAuth[]) => void;
  getPermissions: (form?: string) => PermissionsForm;
}
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
