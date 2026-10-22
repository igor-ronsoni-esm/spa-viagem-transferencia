import { Token } from "@components/auth/esm-auth";

export default interface ValidaJWTUseCase {
  execute(jwt: string): Token;
}