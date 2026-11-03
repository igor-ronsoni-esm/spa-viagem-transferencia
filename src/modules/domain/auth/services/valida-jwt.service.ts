import { verify } from "jsonwebtoken";
import { AuthError } from "next-auth";
import EnvConfiguration from "@configs/environment/env.config";
import ValidaJWTUseCase from "../usecases/valida-jwt.usecase";
import { JWT, Token } from "@modules/components/auth/esm-auth";

export default class ValidaJWTService implements ValidaJWTUseCase {
  execute(jwt: string): Token {
    try {
      const secret = EnvConfiguration.get().secret;
      if (!secret) throw new AuthError("Chave secreta não encontrada");

      const decoded = verify(jwt, secret) as JWT;

      return { ...decoded } as Token;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
